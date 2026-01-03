import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { ErrorBoundary } from "@/components/ErrorBoundary";

import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AdminSetup from "./pages/AdminSetup";
import NotFound from "./pages/NotFound";
import Search from "./pages/Search";
import Casting from "./pages/Casting";
import Campaigns from "./pages/Campaigns";
import Services from "./pages/Services";
import Messages from "./pages/Messages";
import Favorites from "./pages/Favorites";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";

// User pages
import UserDashboard from "./pages/user/Dashboard";
import UserProfile from "./pages/user/Profile";
import Subscription from "./pages/user/Subscription";
import Billing from "./pages/user/Billing";
import PaymentHistory from "./pages/user/PaymentHistory";
import CommunityAccess from "./pages/user/CommunityAccess";
import SecureContact from "./pages/user/SecureContact";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";

// Error pages
import Unauthorized from "./pages/errors/Unauthorized";
import Forbidden from "./pages/errors/Forbidden";
import ServerError from "./pages/errors/ServerError";
import Maintenance from "./pages/errors/Maintenance";
import Restricted from "./pages/errors/Restricted";

// Model category pages
import NewFaces from "./pages/models/NewFaces";
import TopModels from "./pages/models/TopModels";
import Fashion from "./pages/models/Fashion";
import Editorial from "./pages/models/Editorial";
import Runway from "./pages/models/Runway";
import Commercial from "./pages/models/Commercial";
import PlusSize from "./pages/models/PlusSize";
import Mature from "./pages/models/Mature";
import ModelsIndex from "./pages/models/ModelsIndex";
import ModelDetail from "./pages/models/ModelDetail";

// Agency pages
import AgenciesIndex from "./pages/agencies/AgenciesIndex";
import AgencyDetail from "./pages/agencies/AgencyDetail";
import BecomePartner from "./pages/agencies/BecomePartner";

// Company pages
import About from "./pages/company/About";
import Contact from "./pages/company/Contact";
import Mission from "./pages/company/Mission";
import Careers from "./pages/company/Careers";
import Press from "./pages/company/Press";
import Terms from "./pages/company/Terms";
import Privacy from "./pages/company/Privacy";

// Create pages
import CreateModel from "./pages/CreateModel";
import CreateAgency from "./pages/CreateAgency";
import CreateCampaign from "./pages/CreateCampaign";
import CreateCasting from "./pages/CreateCasting";
import CreateEvent from "./pages/CreateEvent";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Pages */}
              <Route path="/" element={<Landing />} />
              <Route path="/index" element={<Index />} />
              <Route path="/landing" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/features" element={<Features />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Legacy/Model Platform Pages */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin-setup" element={<AdminSetup />} />
              <Route path="/search" element={<Search />} />
              <Route path="/casting" element={<Casting />} />
              <Route path="/campaigns" element={<Campaigns />} />
              <Route path="/services" element={<Services />} />
              
              {/* User Pages (Premium) */}
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/profile" element={<UserProfile />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/payment-history" element={<PaymentHistory />} />
              <Route path="/community" element={<CommunityAccess />} />
              <Route path="/contact" element={<SecureContact />} />
              
              {/* Legacy User Pages */}
              <Route path="/messages" element={<Messages />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/settings" element={<Settings />} />
              
              {/* Admin Pages */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              
              {/* Models */}
              <Route path="/models" element={<ModelsIndex />} />
              <Route path="/models/:id" element={<ModelDetail />} />
              <Route path="/models/new-faces" element={<NewFaces />} />
              <Route path="/models/top-models" element={<TopModels />} />
              <Route path="/models/fashion" element={<Fashion />} />
              <Route path="/models/editorial" element={<Editorial />} />
              <Route path="/models/runway" element={<Runway />} />
              <Route path="/models/commercial" element={<Commercial />} />
              <Route path="/models/plus-size" element={<PlusSize />} />
              <Route path="/models/mature" element={<Mature />} />
              
              {/* Agencies */}
              <Route path="/agencies" element={<AgenciesIndex />} />
              <Route path="/agencies/:id" element={<AgencyDetail />} />
              <Route path="/agencies/become-partner" element={<BecomePartner />} />
              
              {/* Company */}
              <Route path="/company/about" element={<About />} />
              <Route path="/company/contact" element={<Contact />} />
              <Route path="/company/mission" element={<Mission />} />
              <Route path="/company/careers" element={<Careers />} />
              <Route path="/company/press" element={<Press />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/company/terms" element={<Terms />} />
              <Route path="/company/privacy" element={<Privacy />} />
              
              {/* Create Pages */}
              <Route path="/create-model" element={<CreateModel />} />
              <Route path="/create-agency" element={<CreateAgency />} />
              <Route path="/create-campaign" element={<CreateCampaign />} />
              <Route path="/create-casting" element={<CreateCasting />} />
              <Route path="/create-event" element={<CreateEvent />} />
              
              {/* Error Pages */}
              <Route path="/401" element={<Unauthorized />} />
              <Route path="/403" element={<Forbidden />} />
              <Route path="/500" element={<ServerError />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/restricted" element={<Restricted />} />
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;
