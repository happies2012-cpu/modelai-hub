import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useMessages } from '@/hooks/useMessages';
import { Inbox, Send, Plus, Mail, MailOpen } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const Messages = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [newMessage, setNewMessage] = useState({ to: '', subject: '', content: '' });
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        navigate('/auth');
      } else {
        setUser(user);
      }
    });
  }, [navigate]);

  const { inbox, sent, unreadCount, isLoading, sendMessage, markAsRead } = useMessages(user?.id);

  const handleSendMessage = () => {
    if (!newMessage.to || !newMessage.content) {
      toast.error('Please fill in recipient and message');
      return;
    }
    sendMessage({ receiverId: newMessage.to, subject: newMessage.subject, content: newMessage.content });
    setNewMessage({ to: '', subject: '', content: '' });
    setDialogOpen(false);
  };

  const handleSelectMessage = (message: any) => {
    setSelectedMessage(message);
    if (!message.read && message.receiver_id === user?.id) {
      markAsRead(message.id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading messages...</div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-background pt-20">
        <div className="container-luxury py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-display">Messages</h1>
              {unreadCount > 0 && (
                <p className="text-muted-foreground mt-1">
                  {unreadCount} unread message{unreadCount > 1 ? 's' : ''}
                </p>
              )}
            </div>
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Message
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New Message</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <Input
                    placeholder="Recipient ID"
                    value={newMessage.to}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, to: e.target.value }))}
                  />
                  <Input
                    placeholder="Subject (optional)"
                    value={newMessage.subject}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                  />
                  <Textarea
                    placeholder="Write your message..."
                    rows={5}
                    value={newMessage.content}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                  />
                  <Button onClick={handleSendMessage} className="w-full">
                    Send Message
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Message List */}
            <div className="lg:col-span-1 border border-border/50 bg-card">
              <Tabs defaultValue="inbox">
                <TabsList className="w-full rounded-none border-b">
                  <TabsTrigger value="inbox" className="flex-1 gap-2">
                    <Inbox className="h-4 w-4" />
                    Inbox ({inbox.length})
                  </TabsTrigger>
                  <TabsTrigger value="sent" className="flex-1 gap-2">
                    <Send className="h-4 w-4" />
                    Sent ({sent.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="inbox" className="m-0">
                  <div className="divide-y divide-border/50 max-h-[600px] overflow-y-auto">
                    {inbox.length === 0 ? (
                      <p className="p-8 text-center text-muted-foreground">No messages</p>
                    ) : (
                      inbox.map((message) => (
                        <div
                          key={message.id}
                          onClick={() => handleSelectMessage(message)}
                          className={`p-4 cursor-pointer transition-smooth hover:bg-secondary/50 ${
                            selectedMessage?.id === message.id ? 'bg-secondary/50' : ''
                          } ${!message.read ? 'bg-accent/5' : ''}`}
                        >
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={message.sender?.avatar_url || ''} />
                              <AvatarFallback>
                                {message.sender?.full_name?.[0] || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                {!message.read ? (
                                  <Mail className="h-4 w-4 text-accent" />
                                ) : (
                                  <MailOpen className="h-4 w-4 text-muted-foreground" />
                                )}
                                <span className={`font-medium truncate ${!message.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                  {message.sender?.full_name || 'Unknown'}
                                </span>
                              </div>
                              {message.subject && (
                                <p className="text-sm font-medium truncate mt-1">{message.subject}</p>
                              )}
                              <p className="text-xs text-muted-foreground truncate mt-1">
                                {message.content}
                              </p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {format(new Date(message.created_at), 'MMM d, h:mm a')}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="sent" className="m-0">
                  <div className="divide-y divide-border/50 max-h-[600px] overflow-y-auto">
                    {sent.length === 0 ? (
                      <p className="p-8 text-center text-muted-foreground">No sent messages</p>
                    ) : (
                      sent.map((message) => (
                        <div
                          key={message.id}
                          onClick={() => handleSelectMessage(message)}
                          className={`p-4 cursor-pointer transition-smooth hover:bg-secondary/50 ${
                            selectedMessage?.id === message.id ? 'bg-secondary/50' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={message.receiver?.avatar_url || ''} />
                              <AvatarFallback>
                                {message.receiver?.full_name?.[0] || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">
                                To: {message.receiver?.full_name || 'Unknown'}
                              </p>
                              {message.subject && (
                                <p className="text-sm truncate mt-1">{message.subject}</p>
                              )}
                              <p className="text-xs text-muted-foreground truncate mt-1">
                                {message.content}
                              </p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {format(new Date(message.created_at), 'MMM d, h:mm a')}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Message Detail */}
            <div className="lg:col-span-2 border border-border/50 bg-card min-h-[600px]">
              {selectedMessage ? (
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-6 pb-6 border-b border-border/50">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={selectedMessage.sender?.avatar_url || ''} />
                      <AvatarFallback>
                        {selectedMessage.sender?.full_name?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-display text-lg">
                        {selectedMessage.sender?.full_name || 'Unknown'}
                      </p>
                      {selectedMessage.subject && (
                        <p className="font-medium mt-1">{selectedMessage.subject}</p>
                      )}
                      <p className="text-sm text-muted-foreground mt-1">
                        {format(new Date(selectedMessage.created_at), 'MMMM d, yyyy at h:mm a')}
                      </p>
                    </div>
                  </div>
                  <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a message to read</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Messages;
