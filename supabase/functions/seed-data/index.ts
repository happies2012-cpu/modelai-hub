// Guidesoft: Seed data loader for GSModeling platform
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Guidesoft: Starting database seeding...');

    // Create dummy users for agencies
    const agencyUsers = [];
    const agencyEmails = [
      'elite@example.com', 'img@example.com', 'next@example.com', 
      'society@example.com', 'women@example.com', 'storm@example.com',
      'dna@example.com', 'ford@example.com', 'select@example.com', 'marilyn@example.com'
    ];

    for (const email of agencyEmails) {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password: 'TempPassword123!',
        email_confirm: true,
        user_metadata: { role: 'agency' }
      });

      if (authError) {
        console.log(`Skipping existing user: ${email}`);
        // Try to get existing user
        const { data: existingUsers } = await supabase
          .from('profiles')
          .select('user_id')
          .eq('email', email)
          .limit(1);
        
        if (existingUsers && existingUsers.length > 0) {
          agencyUsers.push(existingUsers[0].user_id);
        }
      } else if (authData.user) {
        agencyUsers.push(authData.user.id);
        console.log(`Created user for: ${email}`);
      }
    }

    console.log(`Guidesoft: Created/found ${agencyUsers.length} agency users`);

    // Seed model categories
    const categories = [
      { name: 'Fashion', description: 'High fashion runway and editorial' },
      { name: 'Editorial', description: 'Magazine and artistic photography' },
      { name: 'Commercial', description: 'Advertising and brand campaigns' },
      { name: 'Runway', description: 'Fashion show specialists' },
      { name: 'Plus Size', description: 'Size-inclusive modeling' },
      { name: 'Mature', description: '40+ experienced professionals' },
    ];

    const { data: categoryData, error: catError } = await supabase
      .from('model_categories')
      .upsert(categories, { onConflict: 'name' })
      .select();

    if (catError) throw catError;
    console.log(`Guidesoft: Seeded ${categoryData.length} categories`);

    // Seed agencies
    const agencies = [
      { name: 'Elite Model Management', country: 'USA', city: 'New York', email: 'contact@elite-ny.com', phone: '+1-212-555-0100', website: 'https://elitemodel.com', description: 'Premier modeling agency with global reach', verified: true, status: 'approved', user_id: agencyUsers[0] },
      { name: 'IMG Models', country: 'USA', city: 'Los Angeles', email: 'info@imgmodels.com', phone: '+1-310-555-0200', website: 'https://imgmodels.com', description: 'Leading international talent agency', verified: true, status: 'approved', user_id: agencyUsers[1] },
      { name: 'Next Model Management', country: 'France', city: 'Paris', email: 'paris@nextmodels.com', phone: '+33-1-555-0300', website: 'https://nextmodels.com', description: 'Top European modeling agency', verified: true, status: 'approved', user_id: agencyUsers[2] },
      { name: 'The Society Management', country: 'USA', city: 'New York', email: 'hello@thesocietynyc.com', phone: '+1-212-555-0400', website: 'https://thesociety.com', description: 'Boutique agency representing top talent', verified: true, status: 'approved', user_id: agencyUsers[3] },
      { name: 'Women Management', country: 'Italy', city: 'Milan', email: 'milan@womenmanagement.com', phone: '+39-02-555-0500', website: 'https://womenmanagement.com', description: 'Fashion capital representation', verified: true, status: 'approved', user_id: agencyUsers[4] },
      { name: 'Storm Models', country: 'UK', city: 'London', email: 'info@stormmodels.com', phone: '+44-20-555-0600', website: 'https://stormmodels.com', description: 'Iconic British modeling agency', verified: true, status: 'approved', user_id: agencyUsers[5] },
      { name: 'DNA Models', country: 'USA', city: 'New York', email: 'info@dnamodels.com', phone: '+1-212-555-0700', website: 'https://dnamodels.com', description: 'Innovative talent representation', verified: true, status: 'approved', user_id: agencyUsers[6] },
      { name: 'Ford Models', country: 'USA', city: 'Chicago', email: 'chicago@fordmodels.com', phone: '+1-312-555-0800', website: 'https://fordmodels.com', description: 'Historic agency since 1946', verified: true, status: 'approved', user_id: agencyUsers[7] },
      { name: 'Select Model Management', country: 'UK', city: 'London', email: 'bookings@selectmodel.com', phone: '+44-20-555-0900', website: 'https://selectmodel.com', description: 'Premier UK representation', verified: true, status: 'approved', user_id: agencyUsers[8] },
      { name: 'Marilyn Agency', country: 'France', city: 'Paris', email: 'contact@marilynagency.com', phone: '+33-1-555-1000', website: 'https://marilynagency.com', description: 'Parisian excellence in modeling', verified: true, status: 'approved', user_id: agencyUsers[9] },
    ];

    const { data: agencyData, error: agencyError } = await supabase
      .from('agencies')
      .insert(agencies)
      .select();

    if (agencyError) throw agencyError;
    console.log(`Guidesoft: Seeded ${agencyData.length} agencies`);

    // Seed models with varied data
    const firstNames = ['Emma', 'Olivia', 'Sophia', 'Isabella', 'Ava', 'Mia', 'Charlotte', 'Amelia', 'Harper', 'Evelyn', 'Liam', 'Noah', 'Oliver', 'Elijah', 'James', 'William', 'Benjamin', 'Lucas', 'Henry', 'Alexander', 'Zoe', 'Luna', 'Stella', 'Maya', 'Aria', 'Kai', 'Leo', 'Felix', 'Finn', 'Atlas'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'King'];
    const ethnicities = ['Caucasian', 'African', 'Asian', 'Hispanic', 'Mixed', 'Middle Eastern'];
    const hairColors = ['Blonde', 'Brown', 'Black', 'Red', 'Auburn', 'Gray'];
    const eyeColors = ['Blue', 'Brown', 'Green', 'Hazel', 'Gray'];
    const genders = ['Female', 'Male', 'Non-binary'];

    const models = [];
    for (let i = 0; i < 50; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const gender = genders[Math.floor(Math.random() * genders.length)];
      
      models.push({
        full_name: `${firstName} ${lastName}`,
        stage_name: Math.random() > 0.5 ? firstName : null,
        gender,
        date_of_birth: new Date(1990 + Math.floor(Math.random() * 15), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString().split('T')[0],
        height_cm: 165 + Math.floor(Math.random() * 25),
        weight_kg: 50 + Math.floor(Math.random() * 30),
        bust_cm: gender === 'Female' ? 80 + Math.floor(Math.random() * 15) : null,
        waist_cm: 60 + Math.floor(Math.random() * 20),
        hips_cm: gender === 'Female' ? 85 + Math.floor(Math.random() * 15) : null,
        shoe_size: gender === 'Female' ? `${6 + Math.floor(Math.random() * 5)}` : `${9 + Math.floor(Math.random() * 4)}`,
        hair_color: hairColors[Math.floor(Math.random() * hairColors.length)],
        eye_color: eyeColors[Math.floor(Math.random() * eyeColors.length)],
        ethnicity: ethnicities[Math.floor(Math.random() * ethnicities.length)],
        experience_years: Math.floor(Math.random() * 10),
        agency_id: agencyData[Math.floor(Math.random() * agencyData.length)].id,
        featured: Math.random() > 0.7,
        verified: Math.random() > 0.3,
        available: Math.random() > 0.2,
        rating: (3 + Math.random() * 2).toFixed(2),
        total_bookings: Math.floor(Math.random() * 100),
        status: 'approved',
      });
    }

    const { data: modelData, error: modelError } = await supabase
      .from('models')
      .insert(models)
      .select();

    if (modelError) throw modelError;
    console.log(`Guidesoft: Seeded ${modelData.length} models`);

    // Seed portfolio images (200+ total)
    const portfolioImages = [];
    const unsplashIds = [1489424816437, 1506794778202, 1515886657613, 1534528741775, 1524504388940, 1529626455594, 1490000000000, 1495000000000, 1500000000000, 1505000000000];
    
    for (const model of modelData) {
      const numImages = 3 + Math.floor(Math.random() * 5); // 3-7 images per model
      for (let j = 0; j < numImages; j++) {
        const baseId = unsplashIds[Math.floor(Math.random() * unsplashIds.length)];
        portfolioImages.push({
          model_id: model.id,
          image_url: `https://images.unsplash.com/photo-${baseId + j * 100000}?w=800&h=1000&fit=crop`,
          is_cover: j === 0,
          title: j === 0 ? 'Cover Photo' : `Portfolio ${j}`,
          display_order: j,
        });
      }
    }

    const { data: portfolioData, error: portfolioError } = await supabase
      .from('portfolio_images')
      .insert(portfolioImages)
      .select();

    if (portfolioError) throw portfolioError;
    console.log(`Guidesoft: Seeded ${portfolioData.length} portfolio images`);

    // Seed campaigns
    const campaignTypes = ['Editorial', 'Commercial', 'Fashion Show', 'Brand Campaign', 'Catalog', 'E-commerce'];
    const brands = ['Gucci', 'Prada', 'Versace', 'Chanel', 'Dior', 'Calvin Klein', 'Nike', 'Adidas', 'Zara', 'H&M', 'Louis Vuitton', 'Hermès', 'Balenciaga', 'Burberry', 'Fendi', 'Givenchy', 'Valentino', 'Saint Laurent', 'Armani', 'Dolce & Gabbana'];
    
    const campaigns = [];
    for (let i = 0; i < 20; i++) {
      campaigns.push({
        title: `${brands[Math.floor(Math.random() * brands.length)]} ${campaignTypes[Math.floor(Math.random() * campaignTypes.length)]} 202${4 + Math.floor(Math.random() * 2)}`,
        slug: `campaign-${i + 1}`,
        campaign_type: campaignTypes[Math.floor(Math.random() * campaignTypes.length)],
        brand_name: brands[Math.floor(Math.random() * brands.length)],
        description: 'Premium campaign seeking diverse talent for international exposure. Professional production with top photographers and creative team.',
        start_date: new Date(2024, Math.floor(Math.random() * 12), 1).toISOString(),
        end_date: new Date(2025, Math.floor(Math.random() * 12), 1).toISOString(),
        budget_min: 5000 + Math.floor(Math.random() * 10000),
        budget_max: 20000 + Math.floor(Math.random() * 30000),
        location: ['New York', 'Los Angeles', 'Paris', 'Milan', 'London', 'Tokyo'][Math.floor(Math.random() * 6)],
        country: ['USA', 'France', 'Italy', 'UK', 'Japan'][Math.floor(Math.random() * 5)],
        featured: Math.random() > 0.6,
        status: 'approved',
      });
    }

    const { data: campaignData, error: campaignError } = await supabase
      .from('campaigns')
      .insert(campaigns)
      .select();

    if (campaignError) throw campaignError;
    console.log(`Guidesoft: Seeded ${campaignData.length} campaigns`);

    // Seed casting calls / events
    const events = [];
    for (let i = 0; i < 15; i++) {
      events.push({
        title: `${brands[Math.floor(Math.random() * brands.length)]} Casting Call`,
        event_type: 'casting',
        description: 'Open casting for upcoming fashion campaign. Looking for fresh faces with unique style and personality.',
        start_date: new Date(2025, Math.floor(Math.random() * 6), Math.floor(Math.random() * 28)).toISOString(),
        end_date: new Date(2025, Math.floor(Math.random() * 6) + 6, Math.floor(Math.random() * 28)).toISOString(),
        location: ['New York', 'Los Angeles', 'Miami', 'Chicago', 'Atlanta'][Math.floor(Math.random() * 5)],
        country: 'USA',
        required_models: Math.floor(Math.random() * 10) + 5,
        budget_min: 1000 + Math.floor(Math.random() * 5000),
        budget_max: 5000 + Math.floor(Math.random() * 10000),
        featured: Math.random() > 0.7,
        status: 'active',
      });
    }

    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .insert(events)
      .select();

    if (eventError) throw eventError;
    console.log(`Guidesoft: Seeded ${eventData.length} casting calls`);

    console.log('Guidesoft: Database seeding completed successfully!');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Database seeded successfully',
        stats: {
          categories: categoryData.length,
          agencies: agencyData.length,
          models: modelData.length,
          portfolioImages: portfolioData.length,
          campaigns: campaignData.length,
          events: eventData.length,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Guidesoft: Seeding error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
