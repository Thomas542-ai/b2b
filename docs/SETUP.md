# LeadsFynder Setup Guide

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)
- PostgreSQL 14+ (for local development)
- Redis 6+ (for local development)

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd leadsfynder

# Copy environment file
cp env.example .env

# Edit environment variables
nano .env
```

### 2. Start with Docker

```bash
# Start all services
docker-compose up -d

# Check services
docker-compose ps

# View logs
docker-compose logs -f
```

### 3. Database Setup

```bash
# Run migrations
docker-compose exec backend npm run migrate

# Seed demo data
docker-compose exec backend npm run seed
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api/docs
- **Health Check**: http://localhost:8000/api/health

## Manual Setup (Development)

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment
cp env.example .env
# Edit .env with your configuration

# Run database migrations
npm run migrate

# Seed data
npm run seed

# Start development server
npm run dev
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## Environment Configuration

### Required Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/leadsfynder

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Payment Gateways
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# APIs
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
NEVERBOUNCE_API_KEY=your-neverbounce-api-key
DEBOUNCE_API_KEY=your-debounce-api-key
```

## Production Deployment

### 1. Build Production Images

```bash
docker-compose -f docker-compose.prod.yml build
```

### 2. Set Production Environment

```bash
# Create production .env file
cp env.example .env.prod
# Edit with production values
```

### 3. Deploy

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 4. Run Migrations

```bash
docker-compose -f docker-compose.prod.yml exec backend npm run migrate
```

## Database Migration (cPanel/MySQL)

### 1. Export PostgreSQL Schema

```bash
pg_dump -h localhost -U username -d leadsfynder --schema-only > schema.sql
```

### 2. Convert to MySQL

Use the provided conversion script:

```bash
./scripts/convert-to-mysql.sh schema.sql
```

### 3. Import to MySQL

```bash
mysql -u username -p database_name < schema_mysql.sql
```

## Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run with coverage
npm run test:cov

# Run E2E tests
npm run test:e2e
```

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check DATABASE_URL in .env
   - Ensure PostgreSQL is running
   - Verify network connectivity

2. **Port Already in Use**
   - Change ports in docker-compose.yml
   - Kill existing processes

3. **Permission Denied**
   - Check file permissions
   - Run with sudo if needed

4. **Build Failures**
   - Clear Docker cache: `docker system prune`
   - Rebuild images: `docker-compose build --no-cache`

### Logs

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend

# Follow logs in real-time
docker-compose logs -f
```

## Support

For additional help:
- Check the [README.md](../README.md)
- Review [API Documentation](../docs/api-reference.md)
- Open an issue on GitHub
