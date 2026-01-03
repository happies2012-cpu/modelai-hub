import { Instagram, Twitter, Linkedin, Facebook, Globe } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-bold mb-4">GSMODELING</h3>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-4">
              By Guidesoft - Connecting exceptional talent with world-class opportunities.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="hover:text-gold transition-smooth"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="hover:text-gold transition-smooth"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="hover:text-gold transition-smooth"><Linkedin className="h-5 w-5" /></a>
              <a href="#" className="hover:text-gold transition-smooth"><Facebook className="h-5 w-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Discover</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><a href="/search" className="hover:text-gold transition-smooth">Search Models</a></li>
              <li><a href="/models/new-faces" className="hover:text-gold transition-smooth">New Faces</a></li>
              <li><a href="/models/top-models" className="hover:text-gold transition-smooth">Top Models</a></li>
              <li><a href="/models/fashion" className="hover:text-gold transition-smooth">Fashion</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Models & Agencies</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><a href="/models" className="hover:text-gold transition-smooth">All Models</a></li>
              <li><a href="/agencies" className="hover:text-gold transition-smooth">Agencies</a></li>
              <li><a href="/casting" className="hover:text-gold transition-smooth">Casting</a></li>
              <li><a href="/campaigns" className="hover:text-gold transition-smooth">Campaigns</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><a href="/company/about" className="hover:text-gold transition-smooth">About Us</a></li>
              <li><a href="/company/contact" className="hover:text-gold transition-smooth">Contact</a></li>
              <li><a href="/services" className="hover:text-gold transition-smooth">Services</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><a href="#" className="hover:text-gold transition-smooth">Help Center</a></li>
              <li><a href="#" className="hover:text-gold transition-smooth">API Docs</a></li>
              <li><button className="hover:text-gold transition-smooth flex items-center gap-1"><Globe className="h-3 w-3" />English</button></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-primary-foreground/60">
          <p>&copy; 2025 GSMODELING by Guidesoft. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-gold transition-smooth">Privacy</a>
            <a href="#" className="hover:text-gold transition-smooth">Terms</a>
            <a href="#" className="hover:text-gold transition-smooth">DMCA</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
