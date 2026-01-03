import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Search, ChevronDown, Bell, User, LogOut, Settings, Heart, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useNotifications } from '@/hooks/useNotifications';
import { ThemeToggle } from '@/components/ThemeToggle';

export const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<{ full_name?: string; avatar_url?: string } | null>(null);

  const { unreadCount } = useNotifications(user?.id);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('full_name, avatar_url')
      .eq('id', userId)
      .single();
    
    if (data) {
      setProfile(data);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const navigation = {
    discover: {
      label: 'Discover',
      items: [
        { label: 'Search Models', href: '/search' },
        { label: 'New Faces', href: '/models/new-faces' },
        { label: 'Top Models', href: '/models/top-models' },
      ]
    },
    models: {
      label: 'Models',
      items: [
        { label: 'All Models', href: '/models' },
        { label: 'Fashion', href: '/models/fashion' },
        { label: 'Editorial', href: '/models/editorial' },
        { label: 'Commercial', href: '/models/commercial' },
        { label: 'Runway', href: '/models/runway' },
        { label: 'Plus Size', href: '/models/plus-size' },
        { label: 'Mature', href: '/models/mature' },
      ]
    },
    agencies: {
      label: 'Agencies',
      items: [
        { label: 'All Agencies', href: '/agencies' },
        { label: 'Become a Partner', href: '/agencies/become-partner' },
      ]
    },
    casting: {
      label: 'Casting',
      href: '/casting'
    },
    campaigns: {
      label: 'Campaigns',
      href: '/campaigns'
    },
    services: {
      label: 'Services',
      href: '/services'
    },
    company: {
      label: 'Company',
      items: [
        { label: 'About Us', href: '/company/about' },
        { label: 'Our Mission', href: '/company/mission' },
        { label: 'Careers', href: '/company/careers' },
        { label: 'Press & Media', href: '/company/press' },
        { label: 'Contact', href: '/company/contact' },
      ]
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <a href="/" className="text-2xl font-bold tracking-tight hover:text-gold transition-smooth font-display">
              GSMODELING
            </a>
            
            <div className="hidden lg:flex items-center space-x-6">
              {Object.entries(navigation).map(([key, item]) => (
                <div 
                  key={key}
                  className="relative group"
                  onMouseEnter={() => 'items' in item && setActiveDropdown(key)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {'items' in item ? (
                    <>
                      <button className="text-sm font-medium hover:text-gold transition-smooth flex items-center gap-1">
                        {item.label}
                        <ChevronDown className="h-3 w-3" />
                      </button>
                      {activeDropdown === key && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg py-2 animate-fade-in">
                          {item.items.map((subItem) => (
                            <a
                              key={subItem.href}
                              href={subItem.href}
                              className="block px-4 py-2 text-sm hover:bg-muted transition-smooth"
                            >
                              {subItem.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <a href={item.href} className="text-sm font-medium hover:text-gold transition-smooth">
                      {item.label}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />
            
            <Button variant="ghost" size="icon" onClick={() => navigate('/search')}>
              <Search className="h-5 w-5" />
            </Button>

            {user ? (
              <>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => navigate('/favorites')}
                  className="relative"
                >
                  <Heart className="h-5 w-5" />
                </Button>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => navigate('/messages')}
                >
                  <MessageSquare className="h-5 w-5" />
                </Button>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => navigate('/notifications')}
                  className="relative"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-medium">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile?.avatar_url || ''} />
                        <AvatarFallback className="text-xs">
                          {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span className="font-medium">{profile?.full_name || 'User'}</span>
                        <span className="text-xs text-muted-foreground font-normal">{user.email}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={() => navigate('/auth')}>
                  Sign In
                </Button>
                <Button size="sm" onClick={() => navigate('/auth')}>
                  Join Now
                </Button>
              </>
            )}
          </div>

          <button
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 space-y-3 border-t border-border pt-4 max-h-[70vh] overflow-y-auto animate-fade-in">
            {Object.entries(navigation).map(([key, item]) => (
              <div key={key}>
                {'items' in item ? (
                  <>
                    <div className="font-medium text-sm mb-2">{item.label}</div>
                    <div className="pl-4 space-y-2">
                      {item.items.map((subItem) => (
                        <a
                          key={subItem.href}
                          href={subItem.href}
                          className="block text-sm text-muted-foreground hover:text-foreground transition-smooth"
                        >
                          {subItem.label}
                        </a>
                      ))}
                    </div>
                  </>
                ) : (
                  <a href={item.href} className="block text-sm font-medium hover:text-gold transition-smooth">
                    {item.label}
                  </a>
                )}
              </div>
            ))}
            
            <div className="flex flex-col space-y-2 pt-4 border-t border-border">
              {user ? (
                <>
                  <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                    Dashboard
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={() => navigate('/auth')}>
                    Sign In
                  </Button>
                  <Button size="sm" onClick={() => navigate('/auth')}>
                    Join Now
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
