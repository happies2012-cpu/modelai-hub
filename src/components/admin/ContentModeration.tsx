import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Check, X, Eye, Loader2, User, Building2, Megaphone, Calendar, AlertTriangle } from 'lucide-react';

interface Model {
  id: string;
  full_name: string;
  stage_name: string | null;
  gender: string | null;
  height_cm: number | null;
  status: string;
  created_at: string;
  user_id: string;
}

interface Agency {
  id: string;
  name: string;
  email: string;
  city: string | null;
  country: string | null;
  status: string;
  created_at: string;
}

interface Campaign {
  id: string;
  title: string;
  brand_name: string | null;
  campaign_type: string | null;
  status: string;
  created_at: string;
}

interface Event {
  id: string;
  title: string;
  event_type: string | null;
  city: string | null;
  status: string;
  start_date: string;
  created_at: string;
}

export const ContentModeration = () => {
  const [pendingModels, setPendingModels] = useState<Model[]>([]);
  const [pendingAgencies, setPendingAgencies] = useState<Agency[]>([]);
  const [pendingCampaigns, setPendingCampaigns] = useState<Campaign[]>([]);
  const [pendingEvents, setPendingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    loadPendingContent();
  }, []);

  const loadPendingContent = async () => {
    try {
      const [modelsRes, agenciesRes, campaignsRes, eventsRes] = await Promise.all([
        supabase.from('models').select('*').eq('status', 'pending').order('created_at', { ascending: false }),
        supabase.from('agencies').select('*').eq('status', 'pending').order('created_at', { ascending: false }),
        supabase.from('campaigns').select('*').eq('status', 'pending').order('created_at', { ascending: false }),
        supabase.from('events').select('*').eq('status', 'pending').order('created_at', { ascending: false }),
      ]);

      setPendingModels(modelsRes.data || []);
      setPendingAgencies(agenciesRes.data || []);
      setPendingCampaigns(campaignsRes.data || []);
      setPendingEvents(eventsRes.data || []);
    } catch (error) {
      toast.error('Failed to load pending content');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (table: string, id: string, status: 'approved' | 'rejected') => {
    setActionLoading(id);
    try {
      const { error } = await supabase.from(table as any).update({ status }).eq('id', id);
      if (error) throw error;
      toast.success(`${status === 'approved' ? 'Approved' : 'Rejected'} successfully`);
      loadPendingContent();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    } finally {
      setActionLoading(null);
    }
  };

  const totalPending = pendingModels.length + pendingAgencies.length + pendingCampaigns.length + pendingEvents.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {totalPending > 0 && (
        <Card className="p-4 border-yellow-500/50 bg-yellow-500/5">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <p className="text-sm">
              <strong>{totalPending}</strong> items pending review
            </p>
          </div>
        </Card>
      )}

      <Tabs defaultValue="models" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="models" className="relative">
            <User className="h-4 w-4 mr-2" />
            Models
            {pendingModels.length > 0 && (
              <Badge className="ml-2 h-5 min-w-5 px-1.5" variant="destructive">
                {pendingModels.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="agencies">
            <Building2 className="h-4 w-4 mr-2" />
            Agencies
            {pendingAgencies.length > 0 && (
              <Badge className="ml-2 h-5 min-w-5 px-1.5" variant="destructive">
                {pendingAgencies.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="campaigns">
            <Megaphone className="h-4 w-4 mr-2" />
            Campaigns
            {pendingCampaigns.length > 0 && (
              <Badge className="ml-2 h-5 min-w-5 px-1.5" variant="destructive">
                {pendingCampaigns.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="events">
            <Calendar className="h-4 w-4 mr-2" />
            Events
            {pendingEvents.length > 0 && (
              <Badge className="ml-2 h-5 min-w-5 px-1.5" variant="destructive">
                {pendingEvents.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="mt-6">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Stage Name</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Height</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingModels.map((model) => (
                  <TableRow key={model.id}>
                    <TableCell className="font-medium">{model.full_name}</TableCell>
                    <TableCell className="text-muted-foreground">{model.stage_name || '-'}</TableCell>
                    <TableCell className="capitalize">{model.gender || '-'}</TableCell>
                    <TableCell>{model.height_cm ? `${model.height_cm}cm` : '-'}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(model.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedItem(model)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg">
                            <DialogHeader>
                              <DialogTitle>Model Application Details</DialogTitle>
                            </DialogHeader>
                            {selectedItem && (
                              <div className="space-y-4 pt-4">
                                <div className="flex items-center gap-4">
                                  <Avatar className="h-16 w-16">
                                    <AvatarFallback className="text-lg">{selectedItem.full_name?.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="font-semibold text-lg">{selectedItem.full_name}</h3>
                                    {selectedItem.stage_name && (
                                      <p className="text-sm text-muted-foreground">"{selectedItem.stage_name}"</p>
                                    )}
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground">Gender</p>
                                    <p className="capitalize">{selectedItem.gender || 'Not specified'}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Height</p>
                                    <p>{selectedItem.height_cm ? `${selectedItem.height_cm}cm` : 'Not specified'}</p>
                                  </div>
                                </div>
                                <div className="flex gap-2 pt-4">
                                  <Button
                                    className="flex-1"
                                    onClick={() => handleApproval('models', selectedItem.id, 'approved')}
                                    disabled={actionLoading === selectedItem.id}
                                  >
                                    {actionLoading === selectedItem.id ? (
                                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                      <Check className="h-4 w-4 mr-2" />
                                    )}
                                    Approve
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    className="flex-1"
                                    onClick={() => handleApproval('models', selectedItem.id, 'rejected')}
                                    disabled={actionLoading === selectedItem.id}
                                  >
                                    <X className="h-4 w-4 mr-2" />
                                    Reject
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          size="sm"
                          onClick={() => handleApproval('models', model.id, 'approved')}
                          disabled={actionLoading === model.id}
                        >
                          {actionLoading === model.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleApproval('models', model.id, 'rejected')}
                          disabled={actionLoading === model.id}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {pendingModels.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">No pending model applications</div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="agencies" className="mt-6">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingAgencies.map((agency) => (
                  <TableRow key={agency.id}>
                    <TableCell className="font-medium">{agency.name}</TableCell>
                    <TableCell className="text-muted-foreground">{agency.email}</TableCell>
                    <TableCell>{agency.city && agency.country ? `${agency.city}, ${agency.country}` : '-'}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(agency.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApproval('agencies', agency.id, 'approved')}
                          disabled={actionLoading === agency.id}
                        >
                          {actionLoading === agency.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleApproval('agencies', agency.id, 'rejected')}
                          disabled={actionLoading === agency.id}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {pendingAgencies.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">No pending agency applications</div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="mt-6">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingCampaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.title}</TableCell>
                    <TableCell className="text-muted-foreground">{campaign.brand_name || '-'}</TableCell>
                    <TableCell className="capitalize">{campaign.campaign_type || '-'}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(campaign.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApproval('campaigns', campaign.id, 'approved')}
                          disabled={actionLoading === campaign.id}
                        >
                          {actionLoading === campaign.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleApproval('campaigns', campaign.id, 'rejected')}
                          disabled={actionLoading === campaign.id}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {pendingCampaigns.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">No pending campaigns</div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell className="capitalize">{event.event_type || '-'}</TableCell>
                    <TableCell>{event.city || '-'}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(event.start_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApproval('events', event.id, 'approved')}
                          disabled={actionLoading === event.id}
                        >
                          {actionLoading === event.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleApproval('events', event.id, 'rejected')}
                          disabled={actionLoading === event.id}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {pendingEvents.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">No pending events</div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
