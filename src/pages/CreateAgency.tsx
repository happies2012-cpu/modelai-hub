import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import AgencyRegistrationForm from '@/components/forms/AgencyRegistrationForm';

const CreateAgency = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto py-12">
        <AgencyRegistrationForm />
      </main>
      <Footer />
    </div>
  );
};

export default CreateAgency;
