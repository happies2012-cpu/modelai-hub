# Workflows Documentation

## Overview
This document describes the core workflows implemented in the platform, ensuring all user journeys are enforced by backend logic.

## Registration & Payment Workflow

### Flow
1. **User Registration**
   - User visits `/login` and clicks "Create Account"
   - User fills in: Full Name, Email, Password
   - Account is created in Supabase Auth
   - User is redirected to `/register` with email parameter

2. **Payment Selection**
   - User selects subscription plan (Monthly/Annual)
   - User chooses payment method (PayU/UPI/Google Pay)
   - Payment intent is created in database
   - User is redirected to payment gateway

3. **Payment Verification**
   - Payment gateway processes transaction
   - Webhook verifies payment
   - Subscription is activated in database
   - User receives confirmation

4. **Account Activation**
   - User can now access premium features
   - Community links are revealed
   - Full platform access granted

### Backend Enforcement
- Subscription status checked on every protected route
- Payment webhooks verified server-side
- Subscription expiry enforced automatically

## Login & Authentication Workflow

### Flow
1. **User Login**
   - User visits `/login`
   - Enters email and password
   - Supabase Auth validates credentials
   - User session created

2. **Role & Subscription Check**
   - System checks user roles
   - System verifies active subscription
   - User redirected based on status:
     - No subscription → `/pricing` or `/restricted`
     - Active subscription → `/user/dashboard`
     - Admin role → `/admin/dashboard`

### Backend Enforcement
- Session validation on every request
- Role-based access control (RBAC)
- Subscription status verified server-side

## Community Access Workflow

### Flow
1. **Access Request**
   - User navigates to `/community`
   - System checks subscription status
   - If active: Community links displayed
   - If inactive: Redirected to `/pricing`

2. **Link Reveal**
   - WhatsApp group link shown
   - Telegram channel link shown
   - Links are copyable
   - User can join directly

### Backend Enforcement
- Subscription check before link display
- Links stored securely in database
- Admin can update links without code changes

## AI Chatbot Workflow

### Flow
1. **Chat Initiation**
   - User clicks AI chat icon (bottom right)
   - Chat window opens
   - System loads conversation history

2. **Message Exchange**
   - User types message
   - Message sent to AI service (Supabase Edge Function)
   - AI processes with platform context
   - Response returned and displayed
   - Conversation saved to database

3. **Context Management**
   - Bot trained on platform content
   - Admin can update training data
   - Responses are contextual and helpful

### Backend Enforcement
- All messages logged for moderation
- Rate limiting on API calls
- Admin can review conversations

## Support & Contact Workflow

### Flow
1. **Form Submission**
   - User navigates to `/contact`
   - Fills secure contact form
   - No email/phone visible (privacy-first)
   - Submission stored in database

2. **Response Handling**
   - Admin receives notification
   - Admin responds via platform
   - User notified through platform
   - Alternative: AI bot can answer common questions

### Backend Enforcement
- All submissions encrypted
- Admin-only access to submissions
- Automated responses for common queries

## Admin Moderation Workflow

### Flow
1. **Admin Access**
   - Admin logs in
   - Redirected to `/admin/dashboard`
   - Full platform access granted

2. **Management Tasks**
   - User management
   - Subscription control
   - Payment logs review
   - Content moderation
   - Support ticket handling

### Backend Enforcement
- Admin role verified on every action
- Audit logs for all admin actions
- Super admin can manage admins

## Payment & Billing Workflow

### Flow
1. **Invoice Generation**
   - Payment successful
   - Invoice automatically generated
   - Stored in database
   - Available in `/payment-history`

2. **Subscription Management**
   - User can view subscription in `/subscription`
   - Billing cycle displayed
   - Payment method management
   - Renewal automatic (if enabled)

### Backend Enforcement
- Invoices generated server-side
- Payment history immutable
- Subscription renewal automated

## Security Workflow

### Flow
1. **Content Protection**
   - Right-click disabled (production)
   - Text selection disabled (production)
   - Copy/paste disabled (production)
   - Screenshot attempts blocked (best-effort)

2. **Data Obfuscation**
   - Sensitive data hidden in console
   - Debug info removed in production
   - API keys never exposed

### Backend Enforcement
- Security features enabled in production only
- Development mode allows debugging
- All security client-side (supplemented by server-side)

## Error Handling Workflow

### Flow
1. **Error Detection**
   - System detects error type
   - Appropriate error page shown:
     - 401: Unauthorized → `/401`
     - 403: Forbidden → `/403`
     - 404: Not Found → `/404`
     - 500: Server Error → `/500`

2. **User Guidance**
   - Clear error message
   - Actionable next steps
   - Navigation options provided

### Backend Enforcement
- Errors logged server-side
- User-friendly messages only
- Technical details hidden from users

