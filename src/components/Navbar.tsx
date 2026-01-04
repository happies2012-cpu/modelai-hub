import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Heart, LogOut, Menu, MessageSquare, Search, Settings, User } from 'lucide-react';
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
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useNotifications } from '@/hooks/useNotifications';
import { ThemeToggle } from '@/components/ThemeToggle';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
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

  // Close mobile nav when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

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

  const navigation = useMemo(() => {
    return [
      {
        key: 'discover',
        label: 'Discover',
        items: [
          { label: 'Search Models', href: '/search' },
          { label: 'New Faces', href: '/models/new-faces' },
          { label: 'Top Models', href: '/models/top-models' },
        ],
      },
      {
        key: 'models',
        label: 'Models',
        items: [
          { label: 'All Models', href: '/models' },
          { label: 'Fashion', href: '/models/fashion' },
          { label: 'Editorial', href: '/models/editorial' },
          { label: 'Commercial', href: '/models/commercial' },
          { label: 'Runway', href: '/models/runway' },
          { label: 'Plus Size', href: '/models/plus-size' },
          { label: 'Mature', href: '/models/mature' },
        ],
      },
      {
        key: 'agencies',
        label: 'Agencies',
        items: [
          { label: 'All Agencies', href: '/agencies' },
          { label: 'Become a Partner', href: '/agencies/become-partner' },
        ],
      },
      { key: 'casting', label: 'Casting', href: '/casting' },
      { key: 'campaigns', label: 'Campaigns', href: '/campaigns' },
      { key: 'services', label: 'Services', href: '/services' },
      {
        key: 'company',
        label: 'Company',
        items: [
          { label: 'About Us', href: '/company/about' },
          { label: 'Our Mission', href: '/company/mission' },
          { label: 'Careers', href: '/company/careers' },
          { label: 'Press & Media', href: '/company/press' },
          { label: 'Contact', href: '/company/contact' },
        ],
      },
    ] as const;
  }, []);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-xl font-bold tracking-tight hover:text-gold transition-smooth font-display">
              GSMODELING
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex">
              <NavigationMenu>
                <NavigationMenuList className="gap-1">
                  {navigation.map((item) => (
                    <NavigationMenuItem key={item.key}>
                      {'items' in item ? (
                        <>
                          <NavigationMenuTrigger className="bg-transparent">{item.label}</NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <ul className="grid gap-1 p-2 md:w-[520px] md:grid-cols-2">
                              {item.items.map((subItem) => (
                                <li key={subItem.href}>
                                  <NavigationMenuLink asChild>
                                    <NavLink
                                      to={subItem.href}
                                      className={({ isActive }) =>
                                        cn(
                                          'block select-none rounded-md p-3 text-sm leading-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none',
                                          isActive && 'bg-accent/50',
                                        )
                                      }
                                    >
                                      <div className="font-medium">{subItem.label}</div>
                                      <div className="mt-1 text-xs text-muted-foreground">{subItem.href}</div>
                                    </NavLink>
                                  </NavigationMenuLink>
                                </li>
                              ))}
                            </ul>
                          </NavigationMenuContent>
                        </>
                      ) : (
                        <NavigationMenuLink asChild>
                          <NavLink
                            to={item.href}
                            className={({ isActive }) =>
                              cn(navigationMenuTriggerStyle(), 'bg-transparent', isActive && 'bg-accent/50')
                            }
                          >
                            {item.label}
                          </NavLink>
                        </NavigationMenuLink>
                      )}
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />

            <Button variant="ghost" size="icon" onClick={() => navigate('/search')} aria-label="Search">
              <Search className="h-5 w-5" />
            </Button>

            {user ? (
              <>
                <Button variant="ghost" size="icon" onClick={() => navigate('/favorites')} aria-label="Favorites">
                  <Heart className="h-5 w-5" />
                </Button>

                <Button variant="ghost" size="icon" onClick={() => navigate('/messages')} aria-label="Messages">
                  <MessageSquare className="h-5 w-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/notifications')}
                  aria-label="Notifications"
                  className="relative"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-accent text-accent-foreground text-[10px] flex items-center justify-center font-medium">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full" aria-label="Account menu">
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

          {/* Mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-0">
                <SheetHeader className="p-6 pb-3">
                  <SheetTitle className="font-display">GSMODELING</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-88px)] px-6 pb-6">
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/search')}>
                        <Search className="mr-2 h-4 w-4" />
                        Search
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {navigation.map((item) => (
                        <div key={item.key} className="space-y-2">
                          {'items' in item ? (
                            <>
                              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                {item.label}
                              </div>
                              <div className="grid gap-1">
                                {item.items.map((subItem) => (
                                  <NavLink
                                    key={subItem.href}
                                    to={subItem.href}
                                    className={({ isActive }) =>
                                      cn(
                                        'rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
                                        isActive && 'bg-accent/50',
                                      )
                                    }
                                  >
                                    {subItem.label}
                                  </NavLink>
                                ))}
                              </div>
                            </>
                          ) : (
                            <NavLink
                              to={item.href}
                              className={({ isActive }) =>
                                cn(
                                  'flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                                  isActive && 'bg-accent/50',
                                )
                              }
                            >
                              <span>{item.label}</span>
                            </NavLink>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4 space-y-2">
                      {user ? (
                        <>
                          <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/dashboard')}>
                            <User className="mr-2 h-4 w-4" />
                            Dashboard
                          </Button>
                          <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/favorites')}>
                            <Heart className="mr-2 h-4 w-4" />
                            Favorites
                          </Button>
                          <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/messages')}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Messages
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-between"
                            onClick={() => navigate('/notifications')}
                          >
                            <span className="flex items-center">
                              <Bell className="mr-2 h-4 w-4" />
                              Notifications
                            </span>
                            {unreadCount > 0 && (
                              <span className="min-w-5 h-5 px-1 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center">
                                {unreadCount > 9 ? '9+' : unreadCount}
                              </span>
                            )}
                          </Button>
                          <Button variant="destructive" size="sm" className="w-full" onClick={handleSignOut}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/auth')}>
                            Sign In
                          </Button>
                          <Button size="sm" className="w-full" onClick={() => navigate('/auth')}>
                            Join Now
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};
