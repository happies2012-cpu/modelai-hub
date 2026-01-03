/**
 * Role-Based Access Control (RBAC) utilities
 * Centralized authorization logic
 */

import { supabase } from '@/integrations/supabase/client';
import { getUserRoles, UserRole, isAdmin } from './auth';
import { hasActiveSubscription } from './payments';

export interface AccessCheck {
  hasAccess: boolean;
  reason?: string;
  redirectTo?: string;
}

/**
 * Check if user has required role
 */
export const checkRole = async (
  userId: string,
  requiredRoles: UserRole[]
): Promise<AccessCheck> => {
  if (requiredRoles.length === 0) {
    return { hasAccess: true };
  }

  const userRoles = await getUserRoles(userId);
  const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

  if (!hasRequiredRole) {
    return {
      hasAccess: false,
      reason: 'Insufficient permissions',
      redirectTo: '/403',
    };
  }

  return { hasAccess: true };
};

/**
 * Check if user is admin
 */
export const checkAdmin = async (userId: string): Promise<AccessCheck> => {
  const userRoles = await getUserRoles(userId);
  const isUserAdmin = isAdmin(userRoles);

  if (!isUserAdmin) {
    return {
      hasAccess: false,
      reason: 'Admin access required',
      redirectTo: '/403',
    };
  }

  return { hasAccess: true };
};

/**
 * Check if user has active subscription
 */
export const checkSubscription = async (userId: string): Promise<AccessCheck> => {
  const hasSubscription = await hasActiveSubscription(userId);

  if (!hasSubscription) {
    return {
      hasAccess: false,
      reason: 'Active subscription required',
      redirectTo: '/restricted',
    };
  }

  return { hasAccess: true };
};

/**
 * Comprehensive access check
 */
export const checkAccess = async (
  userId: string,
  options: {
    requireRoles?: UserRole[];
    requireAdmin?: boolean;
    requireSubscription?: boolean;
  } = {}
): Promise<AccessCheck> => {
  const { requireRoles, requireAdmin, requireSubscription } = options;

  // Check admin requirement first
  if (requireAdmin) {
    const adminCheck = await checkAdmin(userId);
    if (!adminCheck.hasAccess) {
      return adminCheck;
    }
  }

  // Check role requirements
  if (requireRoles && requireRoles.length > 0) {
    const roleCheck = await checkRole(userId, requireRoles);
    if (!roleCheck.hasAccess) {
      return roleCheck;
    }
  }

  // Check subscription requirement
  if (requireSubscription) {
    const subscriptionCheck = await checkSubscription(userId);
    if (!subscriptionCheck.hasAccess) {
      return subscriptionCheck;
    }
  }

  return { hasAccess: true };
};

/**
 * Get current user's access level
 */
export const getUserAccessLevel = async (userId: string): Promise<{
  isAdmin: boolean;
  isSuperAdmin: boolean;
  hasSubscription: boolean;
  roles: UserRole[];
}> => {
  const roles = await getUserRoles(userId);
  const hasSubscription = await hasActiveSubscription(userId);

  return {
    isAdmin: isAdmin(roles),
    isSuperAdmin: roles.includes('super_admin'),
    hasSubscription,
    roles,
  };
};

