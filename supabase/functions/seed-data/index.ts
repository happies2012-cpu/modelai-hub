// Seed data loader for GSModeling platform (idempotent for seed accounts)
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type AppRole = 'super_admin' | 'admin' | 'agency' | 'model' | 'brand';

const SEED_TAG = 'Guidesoft Seed';

const getEnv = (key: string) => {
  const v = Deno.env.get(key);
  if (!v) throw new Error(`${key} is not configured`);
  return v;
};

async function findUserIdByEmail(supabase: any, email: string): Promise<string | null> {
  // Best-effort lookup via admin list (requires service role)
  const lower = email.toLowerCase();
  let page = 1;
  const perPage = 1000;

  while (page <= 10) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const hit = data?.users?.find((u: any) => (u.email || '').toLowerCase() === lower);
    if (hit?.id) return hit.id;
    if (!data?.users || data.users.length < perPage) break;
    page += 1;
  }
  return null;
}

async function ensureAuthUser(
  supabase: any,
  {
    email,
    password,
    role,
    fullName,
  }: { email: string; password: string; role: AppRole; fullName: string },
): Promise<string> {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role },
  });

  let userId = data?.user?.id as string | undefined;
  if (!userId) {
    // user may already exist
    if (error) {
      const existingId = await findUserIdByEmail(supabase, email);
      if (!existingId) throw error;
      userId = existingId;
    } else {
      throw new Error(`Unable to create/find user for ${email}`);
    }
  }

  // Profiles table uses id = auth.users.id
  await supabase.from('profiles').upsert(
    {
      id: userId,
      email,
      full_name: fullName,
      bio: `${SEED_TAG}: Demo profile`,
    },
    { onConflict: 'id' },
  );

  // Ensure role exists (unique on user_id + role)
  await supabase.from('user_roles').upsert(
    { user_id: userId, role },
    { onConflict: 'user_id,role' },
  );

  return userId;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(getEnv('SUPABASE_URL'), getEnv('SUPABASE_SERVICE_ROLE_KEY'));

    const body = req.method === 'POST' ? await req.json().catch(() => ({})) : {};
    const modelCount = Math.min(Math.max(parseInt(body?.modelCount ?? '30', 10) || 30, 10), 80);

    console.log(`${SEED_TAG}: Starting database seeding...`);

    // Seed accounts
    const agencyAccounts = [
      { email: 'elite@seed.gsmodeling.app', fullName: 'Elite Model Management', country: 'USA', city: 'New York' },
      { email: 'img@seed.gsmodeling.app', fullName: 'IMG Models', country: 'USA', city: 'Los Angeles' },
      { email: 'next@seed.gsmodeling.app', fullName: 'Next Model Management', country: 'France', city: 'Paris' },
      { email: 'storm@seed.gsmodeling.app', fullName: 'Storm Models', country: 'UK', city: 'London' },
      { email: 'women@seed.gsmodeling.app', fullName: 'Women Management', country: 'Italy', city: 'Milan' },
    ];

    const brandAccounts = [
      { email: 'brand1@seed.gsmodeling.app', fullName: 'Aurora Studio' },
      { email: 'brand2@seed.gsmodeling.app', fullName: 'Northlight Brands' },
    ];

    const password = 'TempPassword123!';

    const agencyUserIds: string[] = [];
    for (const a of agencyAccounts) {
      agencyUserIds.push(
        await ensureAuthUser(supabase, { email: a.email, password, role: 'agency', fullName: a.fullName }),
      );
    }

    const brandUserIds: string[] = [];
    for (const b of brandAccounts) {
      brandUserIds.push(await ensureAuthUser(supabase, { email: b.email, password, role: 'brand', fullName: b.fullName }));
    }

    // Clean previous seed rows for seed accounts (idempotent)
    // - models -> cascades portfolio_images + mapping
    const seedModelEmails = Array.from({ length: modelCount }).map((_, i) => `model${i + 1}@seed.gsmodeling.app`);
    const seedModelUserIds: string[] = [];
    for (let i = 0; i < seedModelEmails.length; i++) {
      const email = seedModelEmails[i];
      const fullName = `Model ${i + 1}`;
      seedModelUserIds.push(await ensureAuthUser(supabase, { email, password, role: 'model', fullName }));
    }

    // Delete existing rows tied to seed accounts
    await supabase.from('bookings').delete().in('client_id', brandUserIds);
    await supabase.from('events').delete().in('created_by', brandUserIds);
    // Keep cleanup simple and PostgREST-safe: delete any previous seed campaigns by slug prefix
    await supabase.from('campaigns').delete().like('slug', 'seed-%');
    await supabase.from('models').delete().in('user_id', seedModelUserIds);
    await supabase.from('agencies').delete().in('user_id', agencyUserIds);

    // Seed categories (merge with defaults)
    const categories = [
      { name: 'Editorial', description: 'High-fashion editorial modeling' },
      { name: 'Runway', description: 'Catwalk and fashion show modeling' },
      { name: 'Commercial', description: 'Commercial and advertising modeling' },
      { name: 'Beauty', description: 'Beauty and cosmetic modeling' },
      { name: 'Fitness', description: 'Fitness and athletic modeling' },
      { name: 'Plus Size', description: 'Plus size fashion modeling' },
      { name: 'Petite', description: 'Petite fashion modeling' },
      { name: 'Fashion', description: 'High fashion runway and editorial' },
      { name: 'Mature', description: '40+ experienced professionals' },
    ];

    const { data: categoryData, error: catError } = await supabase
      .from('model_categories')
      .upsert(categories, { onConflict: 'name' })
      .select('id,name');
    if (catError) throw catError;

    const categoryIdByName = new Map<string, string>();
    for (const c of categoryData ?? []) categoryIdByName.set(c.name, c.id);

    // Seed agencies (one per agency user)
    const agenciesToInsert = agencyAccounts.map((a, idx) => ({
      user_id: agencyUserIds[idx],
      name: a.fullName,
      description: `${SEED_TAG}: Premium modeling agency (${a.city})`,
      email: `contact@${a.fullName.toLowerCase().replace(/\s+/g, '')}.example`,
      phone: '+1-000-000-0000',
      website: 'https://example.com',
      city: a.city,
      country: a.country,
      status: 'approved',
      verified: true,
    }));

    const { data: agencyData, error: agencyError } = await supabase.from('agencies').insert(agenciesToInsert).select('id');
    if (agencyError) throw agencyError;

    // Seed models
    const firstNames = [
      'Aarav', 'Vihaan', 'Arjun', 'Ishaan', 'Kabir', 'Reyansh',
      'Aanya', 'Diya', 'Ira', 'Meera', 'Saanvi', 'Anaya',
      'Maya', 'Aria', 'Zoe', 'Luna', 'Noah', 'Leo', 'Finn', 'Mia',
    ];
    const lastNames = [
      'Sharma', 'Gupta', 'Iyer', 'Reddy', 'Singh', 'Patel', 'Khan', 'Roy', 'Kapoor', 'Mehta',
      'Chen', 'Garcia', 'Brown', 'Rossi', 'Nguyen', 'Kim', 'Ivanov', 'Silva',
    ];

    const genders = ['Female', 'Male', 'Non-binary'] as const;
    const hairColors = ['Blonde', 'Brown', 'Black', 'Red', 'Auburn'] as const;
    const eyeColors = ['Blue', 'Brown', 'Green', 'Hazel'] as const;
    const ethnicities = ['Asian', 'South Asian', 'African', 'Hispanic', 'Caucasian', 'Mixed', 'Middle Eastern'] as const;
    const categoryNames = Array.from(categoryIdByName.keys());

    const modelsToInsert = seedModelUserIds.map((userId, i) => {
      const first = firstNames[i % firstNames.length];
      const last = lastNames[(i * 3) % lastNames.length];
      const gender = genders[i % genders.length];

      const height = 164 + (i % 20);
      const rating = Math.max(3.8, 4.2 + ((i % 8) / 20));

      return {
        user_id: userId,
        agency_id: agencyData?.[i % (agencyData?.length || 1)]?.id ?? null,
        full_name: `${first} ${last}`,
        stage_name: i % 3 === 0 ? first : null,
        gender,
        date_of_birth: new Date(1994 + (i % 8), (i * 7) % 12, ((i * 3) % 27) + 1).toISOString().split('T')[0],
        height_cm: height,
        weight_kg: 50 + (i % 18),
        bust_cm: gender === 'Female' ? 80 + (i % 12) : null,
        waist_cm: 58 + (i % 16),
        hips_cm: gender === 'Female' ? 86 + (i % 12) : null,
        shoe_size: gender === 'Female' ? String(6 + (i % 5)) : String(9 + (i % 4)),
        hair_color: hairColors[i % hairColors.length],
        eye_color: eyeColors[i % eyeColors.length],
        ethnicity: ethnicities[i % ethnicities.length],
        experience_years: i % 8,
        featured: i % 6 === 0,
        verified: true,
        available: i % 10 !== 0,
        rating,
        total_bookings: 10 + (i % 70),
        status: 'approved',
      };
    });

    const { data: modelData, error: modelError } = await supabase.from('models').insert(modelsToInsert).select('id, user_id');
    if (modelError) throw modelError;

    // Seed model categories mapping (1-2 categories per model)
    const mappingRows: any[] = [];
    for (let i = 0; i < (modelData?.length || 0); i++) {
      const m = modelData[i];
      const c1 = categoryNames[i % categoryNames.length];
      const c2 = categoryNames[(i + 3) % categoryNames.length];
      const id1 = categoryIdByName.get(c1);
      const id2 = categoryIdByName.get(c2);
      if (id1) mappingRows.push({ model_id: m.id, category_id: id1 });
      if (id2 && id2 !== id1) mappingRows.push({ model_id: m.id, category_id: id2 });
    }
    const { error: mapError } = await supabase
      .from('model_category_mapping')
      .upsert(mappingRows, { onConflict: 'model_id,category_id' });
    if (mapError) throw mapError;

    // Seed portfolio images (stable demo URLs)
    const portfolioImages: any[] = [];
    for (let i = 0; i < (modelData?.length || 0); i++) {
      const model = modelData[i];
      const count = 4 + (i % 3); // 4-6
      for (let j = 0; j < count; j++) {
        portfolioImages.push({
          model_id: model.id,
          image_url: `https://picsum.photos/seed/gsmodel-${model.id}-${j}/800/1000`,
          is_cover: j === 0,
          title: j === 0 ? 'Cover Photo' : `Portfolio ${j + 1}`,
          display_order: j,
          description: `${SEED_TAG}: Demo image`,
        });
      }
    }
    const { error: portfolioError } = await supabase.from('portfolio_images').insert(portfolioImages);
    if (portfolioError) throw portfolioError;

    // Seed campaigns (slug is unique, safe to upsert)
    const campaignTypes = ['Editorial', 'Commercial', 'Fashion Show', 'Brand Campaign', 'Catalog', 'E-commerce'];
    const brands = ['GSMODELING Studio', 'Aurora', 'Northlight', 'Maison Noir', 'Silverline', 'Luxe & Co.'];

    const campaigns = Array.from({ length: 12 }).map((_, i) => ({
      title: `${brands[i % brands.length]} ${campaignTypes[i % campaignTypes.length]} 2026`,
      slug: `seed-campaign-${i + 1}`,
      campaign_type: campaignTypes[i % campaignTypes.length],
      brand_name: brands[i % brands.length],
      client_id: brandUserIds[i % brandUserIds.length],
      description: `${SEED_TAG}: Premium campaign seeking diverse talent for international exposure.`,
      start_date: new Date(2026, (i % 12), 1).toISOString(),
      end_date: new Date(2026, (i % 12), 28).toISOString(),
      budget_min: 10000 + i * 500,
      budget_max: 25000 + i * 1000,
      location: ['New York', 'Los Angeles', 'Paris', 'Milan', 'London', 'Tokyo'][i % 6],
      country: ['USA', 'France', 'Italy', 'UK', 'Japan'][i % 5],
      images: [`https://picsum.photos/seed/gs-campaign-${i}/1200/700`],
      featured: i % 4 === 0,
      status: 'approved',
    }));

    const { data: campaignData, error: campaignError } = await supabase
      .from('campaigns')
      .upsert(campaigns, { onConflict: 'slug' })
      .select('id');
    if (campaignError) throw campaignError;

    // Seed events (casting calls)
    const events = Array.from({ length: 10 }).map((_, i) => ({
      created_by: brandUserIds[i % brandUserIds.length],
      title: `Seed Casting Call #${i + 1}`,
      event_type: 'casting',
      description: `${SEED_TAG}: Open casting for upcoming campaign.`,
      start_date: new Date(2026, (i % 6), ((i * 3) % 25) + 1).toISOString(),
      end_date: new Date(2026, (i % 6), ((i * 3) % 25) + 2).toISOString(),
      location: ['New York', 'Los Angeles', 'Miami', 'Chicago', 'Atlanta'][i % 5],
      country: 'USA',
      required_models: 5 + (i % 6),
      budget_min: 2500 + i * 200,
      budget_max: 7000 + i * 400,
      featured: i % 3 === 0,
      status: 'active',
    }));

    const { data: eventData, error: eventError } = await supabase.from('events').insert(events).select('id');
    if (eventError) throw eventError;

    console.log(`${SEED_TAG}: Database seeding completed successfully!`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Database seeded successfully',
        demoLogins: {
          password,
          agencies: agencyAccounts.map((a) => a.email),
          brands: brandAccounts.map((b) => b.email),
          models: seedModelEmails.slice(0, Math.min(5, seedModelEmails.length)),
        },
        stats: {
          categories: categoryData?.length || 0,
          agencies: agencyData?.length || 0,
          models: modelData?.length || 0,
          portfolioImages: portfolioImages.length,
          campaigns: campaignData?.length || 0,
          events: eventData?.length || 0,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error(`${SEED_TAG}: Seeding error:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
