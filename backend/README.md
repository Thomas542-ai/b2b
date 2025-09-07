# LeadsFynder Backend

NestJS-based backend API for the LeadsFynder lead generation and email marketing platform.

## Features

- **Authentication**: JWT-based authentication with user registration/login
- **Lead Management**: CRUD operations for leads
- **Campaign Management**: Email campaign creation and management
- **Lead Sources**: Integration with Google Maps, LinkedIn, and other sources
- **Analytics**: Dashboard and reporting analytics
- **Email Integration**: SMTP email sending capabilities
- **Payment Processing**: Stripe, PayPal, and Razorpay integration
- **WhatsApp Integration**: Bulk messaging via Flexa Wapi API
- **Health Monitoring**: API health checks and monitoring

## Tech Stack

- **NestJS**: Node.js framework
- **TypeScript**: Type safety
- **Supabase**: PostgreSQL database
- **JWT**: Authentication
- **BullMQ**: Job queues
- **Redis**: Caching and sessions

## Quick Start

1. **Install dependencies**
```bash
npm install
```

2. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start development server**
```bash
npm run dev
```

4. **Build for production**
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### Leads
- `GET /api/leads` - Get all leads
- `GET /api/leads/:id` - Get lead by ID
- `POST /api/leads` - Create new lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead

### Campaigns
- `GET /api/campaigns` - Get all campaigns
- `GET /api/campaigns/:id` - Get campaign by ID
- `POST /api/campaigns` - Create new campaign
- `PUT /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign

### Lead Sources
- `GET /api/lead-sources` - Get available lead sources
- `POST /api/lead-sources/google-maps` - Scrape Google Maps
- `POST /api/lead-sources/linkedin` - Scrape LinkedIn

### Analytics
- `GET /api/analytics/dashboard` - Dashboard analytics
- `GET /api/analytics/leads` - Lead analytics
- `GET /api/analytics/campaigns` - Campaign analytics

### Health
- `GET /api/health` - API health check
- `GET /api/health/db` - Database health check
- `GET /api/health/redis` - Redis health check

## Environment Variables

See `.env.example` for all required environment variables.

## Database Schema

The backend expects the following Supabase tables:

- `users` - User accounts
- `leads` - Lead records
- `campaigns` - Email campaigns
- `lead_sources` - Lead source configurations

## Development

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Set environment variables in your hosting platform

3. Start the application:
```bash
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request
