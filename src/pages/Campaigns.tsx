import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useCampaigns } from '@/hooks/useCampaigns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, Tag } from 'lucide-react';

const Campaigns = () => {
  const { data: campaigns, isLoading } = useCampaigns();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8">Brand Campaigns</h1>
        {isLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {campaigns?.map((c: any) => (
              <Card key={c.id}>
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-2">{c.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{c.brand_name}</p>
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2"><Tag className="h-4 w-4" />{c.campaign_type}</div>
                    <div className="flex items-center gap-2"><MapPin className="h-4 w-4" />{c.location}</div>
                  </div>
                  <Button className="w-full">View Details</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Campaigns;
