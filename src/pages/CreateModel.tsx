import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import ModelProfileForm from '@/components/forms/ModelProfileForm';

const CreateModel = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto py-12">
        <ModelProfileForm />
      </main>
      <Footer />
    </div>
  );
};

export default CreateModel;
