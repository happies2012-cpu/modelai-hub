# Production Deployment Guide

## Prerequisites

1. **Supabase Project**
   - Create project at https://supabase.com
   - Note your project URL and anon key
   - Run all migrations from `supabase/migrations/`

2. **Payment Gateway Accounts**
   - PayU: https://www.payu.in
   - Cashfree: https://www.cashfree.com
   - Configure webhooks pointing to your domain

3. **Domain & SSL**
   - Domain name configured
   - SSL certificate (Let's Encrypt or platform-provided)

## Step 1: Database Setup

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

## Step 2: Environment Variables

### Frontend (.env.production)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_APP_ENV=production
```

### Supabase Secrets (Edge Functions)
```bash
supabase secrets set PAYU_MERCHANT_KEY=your_key
supabase secrets set PAYU_MERCHANT_SALT=your_salt
supabase secrets set CASHFREE_APP_ID=your_app_id
supabase secrets set CASHFREE_SECRET_KEY=your_secret
supabase secrets set CASHFREE_ENV=PRODUCTION
supabase secrets set LOVABLE_API_KEY=your_key
```

## Step 3: Deploy Edge Functions

```bash
# Deploy AI chat function
supabase functions deploy ai-chat

# Deploy PayU payment function
supabase functions deploy payu-payment

# Deploy Cashfree payment function
supabase functions deploy cashfree-payment
```

## Step 4: Build Application

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Output will be in dist/ folder
```

## Step 5: Deploy Frontend

### Option A: Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Add environment variables in Vercel dashboard
```

### Option B: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod

# Add environment variables in Netlify dashboard
```

### Option C: Docker

```bash
# Build image
docker build -t platform-app .

# Run container
docker run -d \
  -p 3000:80 \
  -e VITE_SUPABASE_URL=... \
  -e VITE_SUPABASE_PUBLISHABLE_KEY=... \
  --name platform-app \
  platform-app
```

### Option D: Self-Hosted (Nginx)

```bash
# Build application
npm run build

# Copy dist/ to server
scp -r dist/* user@server:/var/www/html/

# Configure Nginx (see nginx.conf)
sudo cp nginx.conf /etc/nginx/sites-available/platform
sudo ln -s /etc/nginx/sites-available/platform /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 6: Configure Webhooks

### PayU Webhook
- URL: `https://yourdomain.com/api/webhooks/payu`
- Events: Payment Success, Payment Failure

### Cashfree Webhook
- URL: `https://yourdomain.com/api/webhooks/cashfree`
- Events: PAYMENT_SUCCESS, PAYMENT_FAILED

## Step 7: Security Checklist

- [ ] HTTPS enabled and enforced
- [ ] Environment variables secured
- [ ] API keys not exposed in frontend
- [ ] RLS policies verified
- [ ] Rate limiting active
- [ ] Error logging configured
- [ ] Backup strategy in place

## Step 8: Monitoring

### Set up monitoring for:
- Application errors
- Payment failures
- API rate limits
- Database performance
- User activity

### Recommended tools:
- Supabase Dashboard (built-in)
- Sentry (error tracking)
- Vercel Analytics (if using Vercel)

## Step 9: Post-Deployment

1. **Test Critical Flows**
   - User registration
   - Payment processing
   - Subscription activation
   - Community access
   - AI chatbot

2. **Verify Security**
   - Right-click disabled
   - Text selection disabled
   - Console obfuscated
   - Source maps disabled

3. **Performance Check**
   - Page load times
   - API response times
   - Database query performance

## Troubleshooting

### Build Errors
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Database Connection Issues
- Verify Supabase URL and keys
- Check RLS policies
- Verify network connectivity

### Payment Gateway Issues
- Verify API credentials
- Check webhook URLs
- Review payment logs

### Edge Function Errors
- Check function logs in Supabase dashboard
- Verify secrets are set
- Test functions locally first

## Support

For issues or questions:
1. Check documentation in `/docs`
2. Review error logs
3. Contact support through platform

