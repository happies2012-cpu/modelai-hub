# Deployment Documentation

## Overview
This document covers deployment strategies, cloud configuration, and hosting options.

## Architecture

### Cloud-Neutral Design
- **Abstract Services**: Provider-agnostic implementation
- **Environment Variables**: Configuration via env vars
- **Docker Support**: Containerized deployment
- **Self-Hosting**: Compatible with self-hosting

### Components
- **Frontend**: React + Vite
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Storage**: Supabase Storage
- **CDN**: Optional (Vercel, Netlify, Cloudflare)

## Environment Configuration

### Required Variables
```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key

# Payment Gateway (PayU)
PAYU_MERCHANT_KEY=your_merchant_key
PAYU_MERCHANT_SALT=your_merchant_salt

# AI Service (Optional)
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key

# Environment
VITE_APP_ENV=production
```

## Deployment Options

### Vercel (Recommended)
1. **Setup**
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

2. **Configuration**
   - Add environment variables
   - Configure build settings
   - Set up custom domain

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Netlify
1. **Setup**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify init
   ```

2. **Configuration**
   - `netlify.toml` configuration
   - Environment variables
   - Build settings

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

### Docker
1. **Build Image**
   ```bash
   docker build -t platform-app .
   ```

2. **Run Container**
   ```bash
   docker run -p 3000:3000 \
     -e VITE_SUPABASE_URL=... \
     -e VITE_SUPABASE_PUBLISHABLE_KEY=... \
     platform-app
   ```

3. **Docker Compose**
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - "3000:3000"
       environment:
         - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
         - VITE_SUPABASE_PUBLISHABLE_KEY=${VITE_SUPABASE_PUBLISHABLE_KEY}
   ```

### Self-Hosting
1. **Build**
   ```bash
   npm run build
   ```

2. **Serve**
   ```bash
   # Using serve
   npx serve -s dist

   # Using nginx
   # Configure nginx to serve dist/ folder
   ```

## Supabase Setup

### Database Migrations
1. **Run Migrations**
   ```bash
   supabase db push
   ```

2. **Verify Tables**
   - Check all tables created
   - Verify RLS policies
   - Test permissions

### Edge Functions
1. **Deploy Functions**
   ```bash
   supabase functions deploy ai-chat
   supabase functions deploy payu-payment
   ```

2. **Set Secrets**
   ```bash
   supabase secrets set OPENAI_API_KEY=...
   supabase secrets set PAYU_MERCHANT_KEY=...
   ```

## Build Process

### Production Build
```bash
npm run build
```

### Build Output
- `dist/` folder
- Optimized assets
- Minified code
- Source maps (optional)

### Build Optimization
- Code splitting
- Tree shaking
- Asset optimization
- Compression

## Security Configuration

### Production Settings
- Security features enabled
- Console obfuscation
- Content protection
- HTTPS only

### Environment Detection
```typescript
if (import.meta.env.MODE === 'production') {
  enableSecurityFeatures();
  obfuscateConsole();
}
```

## Monitoring & Logging

### Error Tracking
- Error boundaries
- Error logging
- User feedback
- Admin notifications

### Analytics
- Page views
- User actions
- Performance metrics
- Error rates

## Database Backups

### Automated Backups
- Supabase automatic backups
- Daily snapshots
- Point-in-time recovery
- Export capabilities

### Manual Backups
```bash
supabase db dump -f backup.sql
```

## Scaling

### Frontend
- CDN caching
- Static asset optimization
- Code splitting
- Lazy loading

### Backend
- Database connection pooling
- Edge function optimization
- Caching strategies
- Rate limiting

## Maintenance

### Updates
1. **Code Updates**
   - Pull latest changes
   - Run migrations
   - Deploy new version
   - Verify functionality

2. **Database Updates**
   - Backup first
   - Run migrations
   - Verify data integrity
   - Monitor performance

### Rollback
1. **Code Rollback**
   - Revert to previous version
   - Clear cache
   - Verify functionality

2. **Database Rollback**
   - Restore from backup
   - Verify data
   - Test functionality

## Performance Optimization

### Frontend
- Image optimization
- Code splitting
- Lazy loading
- Caching headers

### Backend
- Query optimization
- Index usage
- Connection pooling
- Caching

## SSL/TLS

### Certificate Management
- Automatic (Vercel/Netlify)
- Manual (Let's Encrypt)
- Custom certificates

### HTTPS Enforcement
- Redirect HTTP to HTTPS
- HSTS headers
- Secure cookies

## Domain Configuration

### Custom Domain
1. **Add Domain**
   - Configure DNS
   - Add domain to platform
   - Verify ownership

2. **SSL Certificate**
   - Automatic (platform)
   - Manual (Let's Encrypt)

### Subdomain Setup
- `www` subdomain
- `api` subdomain (if needed)
- `admin` subdomain (optional)

## Checklist

### Pre-Deployment
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] Edge functions deployed
- [ ] Secrets configured
- [ ] Build successful
- [ ] Tests passing

### Post-Deployment
- [ ] Site accessible
- [ ] Authentication working
- [ ] Payments processing
- [ ] AI bot functional
- [ ] Admin access verified
- [ ] Monitoring active

## Troubleshooting

### Common Issues
1. **Build Failures**
   - Check dependencies
   - Verify Node version
   - Review error logs

2. **Runtime Errors**
   - Check environment variables
   - Verify API endpoints
   - Review console logs

3. **Database Issues**
   - Verify connections
   - Check migrations
   - Review RLS policies

## Support

### Resources
- Supabase documentation
- Platform documentation
- Community forums
- Support tickets

### Contact
- Technical support
- Deployment assistance
- Custom configurations

