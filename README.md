# LeadsFynder

A lead generation and email marketing platform.

## Quick Start

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
- **Supabase** (Cloud PostgreSQL)
- **Redis** for caching and sessions

### Infrastructure
- **Supabase** for database hosting
- **Node.js** for backend runtime
- **Vite** for frontend build tool

## 📦 Installation

### Prerequisites
- Node.js 18+
- Supabase account

### Quick Start

1. **Clone the repository**
```bash
git clone <repository-url>
cd leadsfynder
```

2. **Set up Supabase**
```bash
# Create a new project at https://supabase.com
# Get your database URL and API keys
```

3. **Set up environment variables**
```bash
cp env.example .env
# Edit .env with your Supabase configuration
```

4. **Install dependencies**
```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

5. **Set up Supabase database**
```bash
# Create tables in your Supabase project using the SQL editor
# Or use the Supabase dashboard to create the required tables
```

6. **Start the application**
```bash
# Backend (Terminal 1)
cd backend && npm run dev

# Frontend (Terminal 2)
cd frontend && npm run dev
```

7. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/api/docs

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
# Set up Supabase project and get connection details
# Update .env with your Supabase credentials

# Create database tables in Supabase dashboard
# No local migrations needed - using Supabase only
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

### 1. Get Supabase Database
- Go to [supabase.com](https://supabase.com) (free)
- Create project: "leadsfynder"
- Copy the Supabase URL and API keys from Settings > API

### 2. Update Environment
Edit `backend/.env`:
```env
# Database - Supabase Only
SUPABASE_URL="https://[PROJECT-REF].supabase.co"
SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[YOUR-SERVICE-ROLE-KEY]"

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

### 3. Run Project
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```


## 🚀 Deployment

### Production Deployment

1. **Build the application**
```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run build
```

2. **Deploy to your hosting platform**
- Deploy backend to services like Railway, Heroku, or DigitalOcean
- Deploy frontend to Netlify, GitHub Pages, or similar
- Ensure environment variables are set correctly

3. **Set up database tables**
```bash
# Run the SQL migration script in your Supabase SQL Editor
# See database/setup.md for instructions
```

## 📈 Monitoring

### Health Checks
- API health: `GET /api/health`
- Database health: `GET /api/health/db`
- Redis health: `GET /api/health/redis`

### Logs
```bash
# Backend logs (if using PM2)
pm2 logs

# Or check console output when running npm run dev
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
