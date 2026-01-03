import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Search, UserPlus, Shield, ShieldCheck, Ban, Loader2, Eye, Mail, Phone } from 'lucide-react';

interface UserWithRoles {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  roles: string[];
  phone?: string | null;
  location?: string | null;
}

const ROLES = ['super_admin', 'admin', 'agency', 'model', 'brand'] as const;

export const UserManagement = () => {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const [profilesRes, rolesRes] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('user_roles').select('*'),
      ]);

      if (profilesRes.error) throw profilesRes.error;
      if (rolesRes.error) throw rolesRes.error;

      const usersWithRoles: UserWithRoles[] = (profilesRes.data || []).map((profile) => ({
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        created_at: profile.created_at,
        phone: profile.phone,
        location: profile.location,
        roles: (rolesRes.data || [])
          .filter((r) => r.user_id === profile.id)
          .map((r) => r.role),
      }));

      setUsers(usersWithRoles);
    } catch (error: any) {
      toast.error('Failed to load users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const assignRole = async (userId: string, role: string) => {
    setActionLoading(`assign-${userId}-${role}`);
    try {
      const { error } = await supabase.from('user_roles').insert({
        user_id: userId,
        role: role as any,
      });
      if (error) throw error;
      toast.success(`Role ${role} assigned successfully`);
      loadUsers();
    } catch (error: any) {
      if (error.code === '23505') {
        toast.error('User already has this role');
      } else {
        toast.error('Failed to assign role');
      }
    } finally {
      setActionLoading(null);
    }
  };

  const removeRole = async (userId: string, role: string) => {
    setActionLoading(`remove-${userId}-${role}`);
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role as any);
      if (error) throw error;
      toast.success(`Role ${role} removed successfully`);
      loadUsers();
    } catch (error: any) {
      toast.error('Failed to remove role');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.roles.includes(roleFilter);
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'destructive';
      case 'admin':
        return 'default';
      case 'agency':
        return 'secondary';
      case 'model':
        return 'outline';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {ROLES.map((role) => (
              <SelectItem key={role} value={role}>
                {role.replace('_', ' ').toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar_url || ''} />
                      <AvatarFallback>
                        {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.full_name || 'Unknown'}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.roles.length === 0 ? (
                      <Badge variant="outline">No roles</Badge>
                    ) : (
                      user.roles.map((role) => (
                        <Badge key={role} variant={getRoleBadgeVariant(role) as any}>
                          {role.replace('_', ' ')}
                        </Badge>
                      ))
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedUser(user)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>User Details</DialogTitle>
                        </DialogHeader>
                        {selectedUser && (
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-16 w-16">
                                <AvatarImage src={selectedUser.avatar_url || ''} />
                                <AvatarFallback className="text-lg">
                                  {selectedUser.full_name?.charAt(0) || selectedUser.email.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold text-lg">{selectedUser.full_name || 'Unknown'}</h3>
                                <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{selectedUser.email}</span>
                              </div>
                              {selectedUser.phone && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  <span>{selectedUser.phone}</span>
                                </div>
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Current Roles</h4>
                              <div className="flex flex-wrap gap-2">
                                {selectedUser.roles.map((role) => (
                                  <Badge key={role} variant={getRoleBadgeVariant(role) as any}>
                                    {role.replace('_', ' ')}
                                    <button
                                      onClick={() => removeRole(selectedUser.id, role)}
                                      className="ml-1 hover:text-destructive"
                                      disabled={actionLoading === `remove-${selectedUser.id}-${role}`}
                                    >
                                      ×
                                    </button>
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Assign Role</h4>
                              <div className="flex flex-wrap gap-2">
                                {ROLES.filter((r) => !selectedUser.roles.includes(r)).map((role) => (
                                  <Button
                                    key={role}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => assignRole(selectedUser.id, role)}
                                    disabled={actionLoading === `assign-${selectedUser.id}-${role}`}
                                  >
                                    {actionLoading === `assign-${selectedUser.id}-${role}` ? (
                                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                    ) : (
                                      <UserPlus className="h-3 w-3 mr-1" />
                                    )}
                                    {role.replace('_', ' ')}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Shield className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Manage Roles for {user.full_name || user.email}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          {ROLES.map((role) => {
                            const hasRole = user.roles.includes(role);
                            return (
                              <div key={role} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {hasRole ? (
                                    <ShieldCheck className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <Shield className="h-4 w-4 text-muted-foreground" />
                                  )}
                                  <span className="capitalize">{role.replace('_', ' ')}</span>
                                </div>
                                <Button
                                  variant={hasRole ? 'destructive' : 'default'}
                                  size="sm"
                                  onClick={() =>
                                    hasRole ? removeRole(user.id, role) : assignRole(user.id, role)
                                  }
                                  disabled={
                                    actionLoading === `assign-${user.id}-${role}` ||
                                    actionLoading === `remove-${user.id}-${role}`
                                  }
                                >
                                  {(actionLoading === `assign-${user.id}-${role}` ||
                                    actionLoading === `remove-${user.id}-${role}`) && (
                                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                  )}
                                  {hasRole ? 'Remove' : 'Assign'}
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredUsers.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">No users found</div>
        )}
      </Card>

      <div className="text-sm text-muted-foreground">
        Showing {filteredUsers.length} of {users.length} users
      </div>
    </div>
  );
};
