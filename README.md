# LeadsFynder - B2B Lead Generation & Outreach SaaS

A comprehensive, production-ready B2B lead generation and outreach platform built with modern technologies.

## 🚀 Features

### Core Features
- **Multi-Source Lead Generation**: Google Maps, Domain crawling, LinkedIn, Facebook, CSV import
- **Lead Management (CRM-lite)**: Lead scoring, tags, notes, status tracking, call logs
- **Email Outreach**: SMTP integration, sequences, spintax, bulk sending, reply tracking
- **WhatsApp Integration**: Flexa Wapi API for bulk messaging
- **Email Verification**: NeverBounce & DeBounce API integration
- **Analytics & Reporting**: Comprehensive metrics and exportable reports

### Authentication & Billing
- Email login with verification
- Google OAuth integration
- Multiple payment gateways: Stripe, PayPal, Razorpay, UPI
- License system with feature flags per plan
- Admin panel for plan management

### Admin Features
- User management
- Plan and pricing controls
- Feature flag management
- Usage monitoring
- API key management
- Activity logs

## 🛠 Tech Stack

### Frontend
- **React 18** with Vite
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Query** for state management
- **React Router** for navigation
- **React Hook Form** for forms
- **Recharts** for analytics

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **NestJS** framework
- **JWT** for authentication
- **BullMQ** for job queues
- **Multer** for file uploads
- **Joi** for validation

### Database
- **PostgreSQL** (Supabase)
- **Prisma** ORM
- **Redis** for caching and sessions

### Infrastructure
- **Docker** for containerization
- **Docker Compose** for local development
- **Nginx** for reverse proxy
- **PM2** for process management

## 📦 Installation

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 14+
- Redis 6+

### Quick Start

1. **Clone the repository**
```bash
git clone <repository-url>
cd leadsfynder
```

2. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start with Docker**
```bash
docker-compose up -d
```

4. **Run migrations**
```bash
docker-compose exec backend npm run migrate
```

5. **Seed demo data**
```bash
docker-compose exec backend npm run seed
```

6. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Admin Panel: http://localhost:3000/admin

### Manual Setup

1. **Install dependencies**
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

2. **Database setup**
```bash
# Create database
createdb leadsfynder

# Run migrations
cd backend
npm run migrate

# Seed data
npm run seed
```

3. **Start development servers**
```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/leadsfynder"
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-jwt-secret"
JWT_EXPIRES_IN="7d"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Payment Gateways
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-secret"
RAZORPAY_KEY_ID="your-razorpay-key"
RAZORPAY_KEY_SECRET="your-razorpay-secret"

# APIs
GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
NEVERBOUNCE_API_KEY="your-neverbounce-api-key"
DEBOUNCE_API_KEY="your-debounce-api-key"
FLEXA_WAPI_API_KEY="your-flexa-wapi-key"

# OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# App
NODE_ENV="development"
PORT=8000
FRONTEND_URL="http://localhost:3000"
```

## 📊 Database Schema

The application uses PostgreSQL with the following main tables:

- `users` - User accounts and profiles
- `subscriptions` - User subscription data
- `leads` - Lead information
- `lead_sources` - Lead source tracking
- `emails` - Email campaign data
- `email_sequences` - Email sequence templates
- `call_logs` - Call tracking
- `follow_ups` - Follow-up reminders
- `analytics` - Analytics data
- `api_keys` - API key management

## 🧪 Testing

### Run Tests
```bash
# Backend tests
cd backend
npm run test
npm run test:e2e

# Frontend tests
cd frontend
npm run test
npm run test:e2e
```

### Test Coverage
```bash
# Backend coverage
cd backend
npm run test:cov

# Frontend coverage
cd frontend
npm run test:cov
```

## 🚀 Deployment

### Production Deployment

1. **Build the application**
```bash
docker-compose -f docker-compose.prod.yml build
```

2. **Deploy with Docker**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

3. **Run migrations**
```bash
docker-compose -f docker-compose.prod.yml exec backend npm run migrate
```

### cPanel/MySQL Migration

1. **Export PostgreSQL schema**
```bash
pg_dump -h localhost -U username -d leadsfynder --schema-only > schema.sql
```

2. **Convert to MySQL**
```bash
# Use the provided conversion script
./scripts/convert-to-mysql.sh schema.sql
```

3. **Import to MySQL**
```bash
mysql -u username -p database_name < schema_mysql.sql
```

## 📈 Monitoring

### Health Checks
- API health: `GET /api/health`
- Database health: `GET /api/health/db`
- Redis health: `GET /api/health/redis`

### Logs
```bash
# View logs
docker-compose logs -f

# Backend logs
docker-compose logs -f backend

# Frontend logs
docker-compose logs -f frontend
```

## 🔒 Security

- JWT-based authentication
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration
- Helmet.js for security headers
- SQL injection prevention with Prisma
- XSS protection

## 📝 API Documentation

- **OpenAPI Spec**: `/api/docs`
- **Postman Collection**: `docs/postman/LeadsFynder.postman_collection.json`
- **API Reference**: See `docs/api-reference.md`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Email**: support@leadsfynder.com

## 🗺 Roadmap

### Phase 1 (Current)
- Core lead generation features
- Basic CRM functionality
- Email outreach
- Payment integration

### Phase 2
- AI personalization
- Multi-channel outreach
- Advanced analytics
- Team/agency features
- White-label options

---

**Built with ❤️ for B2B sales teams**
