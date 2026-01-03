import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import CampaignForm from '@/components/forms/CampaignForm';

const CreateCampaign = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto py-12">
        <CampaignForm />
      </main>
      <Footer />
    </div>
  );
};

export default CreateCampaign;
