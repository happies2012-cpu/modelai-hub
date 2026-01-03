import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Search, DollarSign, Wallet, TrendingUp, CheckCircle, Clock, XCircle, Loader2, Eye, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Commission {
  id: string;
  total_amount: number;
  platform_fee: number;
  agency_commission: number | null;
  model_payout: number;
  status: string;
  created_at: string;
  paid_at: string | null;
  model_id: string | null;
  agency_id: string | null;
  booking_id: string | null;
}

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  payment_method: string | null;
  transaction_id: string | null;
  created_at: string;
  paid_at: string | null;
  user_id: string;
  booking_id: string | null;
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

export const PayoutsManagement = () => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalPlatformFees: 0,
    totalPendingPayouts: 0,
    totalPaidPayouts: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [commissionsRes, paymentsRes] = await Promise.all([
        supabase.from('commissions').select('*').order('created_at', { ascending: false }),
        supabase.from('payments').select('*').order('created_at', { ascending: false }),
      ]);

      if (commissionsRes.error) throw commissionsRes.error;
      if (paymentsRes.error) throw paymentsRes.error;

      const commData = commissionsRes.data || [];
      const payData = paymentsRes.data || [];

      setCommissions(commData);
      setPayments(payData);

      const totalRevenue = commData.reduce((sum, c) => sum + Number(c.total_amount || 0), 0);
      const totalPlatformFees = commData.reduce((sum, c) => sum + Number(c.platform_fee || 0), 0);
      const totalPendingPayouts = commData
        .filter((c) => c.status === 'pending')
        .reduce((sum, c) => sum + Number(c.model_payout || 0), 0);
      const totalPaidPayouts = commData
        .filter((c) => c.status === 'paid')
        .reduce((sum, c) => sum + Number(c.model_payout || 0), 0);

      setStats({
        totalRevenue,
        totalPlatformFees,
        totalPendingPayouts,
        totalPaidPayouts,
      });
    } catch (error: any) {
      toast.error('Failed to load payout data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const processPayment = async (commissionId: string) => {
    setActionLoading(commissionId);
    try {
      const { error } = await supabase
        .from('commissions')
        .update({ status: 'paid', paid_at: new Date().toISOString() })
        .eq('id', commissionId);
      if (error) throw error;
      toast.success('Payment processed successfully');
      loadData();
    } catch (error: any) {
      toast.error('Failed to process payment');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
      case 'completed':
        return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20"><CheckCircle className="h-3 w-3 mr-1" />Paid</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500/50"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredCommissions = commissions.filter((c) => {
    const matchesSearch = c.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const chartData = commissions.slice(0, 30).reverse().map((c, index) => ({
    name: `Day ${index + 1}`,
    revenue: Number(c.total_amount || 0),
    fees: Number(c.platform_fee || 0),
  }));

  const pieData = [
    { name: 'Platform Fees', value: stats.totalPlatformFees },
    { name: 'Model Payouts', value: stats.totalPaidPayouts + stats.totalPendingPayouts },
    { name: 'Agency Commissions', value: commissions.reduce((sum, c) => sum + Number(c.agency_commission || 0), 0) },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-500/10">
              <DollarSign className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Platform Fees</p>
              <p className="text-2xl font-bold">${stats.totalPlatformFees.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-yellow-500/10">
              <Clock className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Payouts</p>
              <p className="text-2xl font-bold">${stats.totalPendingPayouts.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-500/10">
              <Wallet className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed Payouts</p>
              <p className="text-2xl font-bold">${stats.totalPaidPayouts.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }} 
              />
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="fees" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Revenue Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => `$${value.toLocaleString()}`}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                <span className="text-xs text-muted-foreground">{entry.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Platform Fee</TableHead>
              <TableHead>Model Payout</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCommissions.map((commission) => (
              <TableRow key={commission.id}>
                <TableCell className="font-mono text-xs">
                  {commission.id.slice(0, 8)}...
                </TableCell>
                <TableCell className="font-semibold">
                  ${Number(commission.total_amount || 0).toLocaleString()}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  ${Number(commission.platform_fee || 0).toLocaleString()}
                </TableCell>
                <TableCell>
                  ${Number(commission.model_payout || 0).toLocaleString()}
                </TableCell>
                <TableCell>{getStatusBadge(commission.status || 'pending')}</TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(commission.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Commission Details</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Commission ID</p>
                              <p className="font-mono text-sm">{commission.id}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Status</p>
                              {getStatusBadge(commission.status || 'pending')}
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Total Amount</p>
                              <p className="text-lg font-semibold">${Number(commission.total_amount || 0).toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Platform Fee</p>
                              <p className="font-medium">${Number(commission.platform_fee || 0).toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Agency Commission</p>
                              <p className="font-medium">${Number(commission.agency_commission || 0).toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Model Payout</p>
                              <p className="font-medium text-green-500">${Number(commission.model_payout || 0).toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Created</p>
                              <p>{new Date(commission.created_at).toLocaleString()}</p>
                            </div>
                            {commission.paid_at && (
                              <div>
                                <p className="text-sm text-muted-foreground">Paid At</p>
                                <p>{new Date(commission.paid_at).toLocaleString()}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    {commission.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => processPayment(commission.id)}
                        disabled={actionLoading === commission.id}
                      >
                        {actionLoading === commission.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Process
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredCommissions.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">No commissions found</div>
        )}
      </Card>
    </div>
  );
};
