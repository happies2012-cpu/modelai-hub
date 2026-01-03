import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { useNotifications } from '@/hooks/useNotifications';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Check, 
  CheckCheck,
  Calendar, 
  MessageSquare, 
  DollarSign,
  Star,
  Users,
  Briefcase,
  Loader2,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const Notifications = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        navigate('/auth');
      } else {
        setUser(user);
      }
    });
  }, [navigate]);

  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } = useNotifications(user?.id);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'message':
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case 'payment':
        return <DollarSign className="h-5 w-5 text-yellow-500" />;
      case 'review':
        return <Star className="h-5 w-5 text-purple-500" />;
      case 'agency':
        return <Users className="h-5 w-5 text-indigo-500" />;
      case 'campaign':
        return <Briefcase className="h-5 w-5 text-orange-500" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container max-w-3xl mx-auto px-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-display font-semibold">Notifications</h1>
              <p className="text-muted-foreground mt-1">
                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
              </p>
            </div>
            
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => markAllAsRead()}
                className="gap-2"
              >
                <CheckCheck className="h-4 w-4" />
                Mark all as read
              </Button>
            )}
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              Unread
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            <AnimatePresence>
              {filteredNotifications.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <Bell className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                  </p>
                </motion.div>
              ) : (
                filteredNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      className={`p-4 transition-all cursor-pointer hover:shadow-md ${
                        !notification.read ? 'bg-accent/5 border-accent/20' : ''
                      }`}
                      onClick={() => {
                        if (!notification.read) {
                          markAsRead(notification.id);
                        }
                        if (notification.link) {
                          navigate(notification.link);
                        }
                      }}
                    >
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className={`font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {notification.title}
                              </h3>
                              {notification.message && (
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                  {notification.message}
                                </p>
                              )}
                            </div>
                            
                            {!notification.read && (
                              <div className="flex-shrink-0">
                                <div className="w-2 h-2 rounded-full bg-accent" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 mt-3">
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(notification.created_at), 'MMM d, h:mm a')}
                            </span>
                            
                            {!notification.read && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                                className="text-xs text-accent hover:underline flex items-center gap-1"
                              >
                                <Check className="h-3 w-3" />
                                Mark as read
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Notifications;
