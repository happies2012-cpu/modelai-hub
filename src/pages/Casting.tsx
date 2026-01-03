import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useCastings } from '@/hooks/useCastings';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, Calendar, Users } from 'lucide-react';

const Casting = () => {
  const { data: castings, isLoading } = useCastings();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8">Casting Calls</h1>
        {isLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {castings?.map((c: any) => (
              <Card key={c.id}>
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-4">{c.title}</h3>
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2"><MapPin className="h-4 w-4" />{c.location}</div>
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4" />{new Date(c.start_date).toLocaleDateString()}</div>
                    <div className="flex items-center gap-2"><Users className="h-4 w-4" />{c.required_models} models</div>
                  </div>
                  <Button className="w-full">Apply Now</Button>
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

export default Casting;
