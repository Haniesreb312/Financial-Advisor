# Financial Advisor Platform

<div align="center">

![Financial Advisor Platform](https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop)

**A comprehensive financial planning and analysis platform with investment calculators, retirement planning tools, savings tracking, and real-time currency conversion.**

[![Build Status](https://img.shields.io/github/workflow/status/yourusername/financial-advisor/CI)](https://github.com/yourusername/financial-advisor/actions)
[![Code Coverage](https://img.shields.io/badge/coverage-85%25-brightgreen)](https://github.com/yourusername/financial-advisor)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[Features](#features) • [Tech Stack](#tech-stack) • [Getting Started](#getting-started) • [Documentation](#documentation) • [Contributing](#contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Database Setup](#database-setup)
  - [Running the Application](#running-the-application)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 🌟 Overview

The Financial Advisor Platform is a modern, full-stack web application designed to provide users with comprehensive financial planning and analysis tools. Built with a focus on accuracy, usability, and professional design, the platform helps users make informed financial decisions through interactive calculators, personalized dashboards, and real-time data visualization.

### Why This Platform?

- **Professional Grade**: Enterprise-level architecture with separation of concerns
- **Accurate Calculations**: Implements industry-standard financial formulas and compound interest calculations
- **User-Centric Design**: Clean, modern UI with dark mode support and responsive design
- **Secure & Private**: Complete authentication system with JWT tokens and secure data storage
- **Comprehensive Testing**: 85% code coverage with 45+ automated tests
- **Production Ready**: CI/CD pipeline, Docker support, and comprehensive documentation

---

## ✨ Features

### 🔐 Authentication & User Management
- **Secure Authentication**: JWT-based authentication system with password hashing
- **User Profiles**: Complete profile management with personal information editing
- **Activity Tracking**: Comprehensive account activity logs and session management
- **Password Security**: Secure password reset and account recovery features

### 💰 Financial Calculators
- **Retirement Planning Calculator**: 
  - Calculate retirement savings needs based on current age, retirement age, and lifestyle
  - Factor in inflation, expected returns, and Social Security benefits
  - Visual projections with year-by-year breakdown
  
- **Investment Analysis Calculator**:
  - Analyze investment growth with compound interest
  - Portfolio allocation recommendations
  - Risk assessment and diversification strategies
  
- **Savings Growth Calculator**:
  - Project long-term savings with regular contributions
  - Compare different savings scenarios
  - Visual growth charts and milestone tracking

- **Currency Converter**:
  - Real-time conversion for all major world currencies
  - Historical exchange rate data
  - Multi-currency comparison tools

### 📊 Dashboard & Analytics
- **Monthly Savings Tracking**: Track and visualize savings goals and progress
- **Interactive Charts**: Beautiful data visualizations using Recharts
- **Goal Setting**: Set and monitor financial goals with progress indicators
- **Spending Analysis**: Categorize and analyze spending patterns

### 📄 Reporting Features
- **PDF Report Generation**: Professional, printable reports for all calculators
- **Reusable PrintReport Component**: Consistent formatting across all reports
- **Export Capabilities**: Download calculation results and historical data
- **Share Reports**: Generate shareable links for financial plans

### 🎨 User Experience
- **Dark Mode**: Full dark mode support with persistent user preference
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Smooth Navigation**: Intuitive routing and seamless transitions
- **Accessibility**: WCAG 2.1 compliant with keyboard navigation support

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18.x with TypeScript
- **Styling**: Tailwind CSS 4.0
- **UI Components**: shadcn/ui component library
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: React Hooks (useState, useEffect, useContext)
- **Routing**: React Router v6
- **Forms**: React Hook Form with Zod validation
- **Animations**: Motion (formerly Framer Motion)

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.x
- **Language**: TypeScript
- **Authentication**: JWT (jsonwebtoken) + bcrypt
- **API Documentation**: OpenAPI/Swagger
- **Validation**: express-validator
- **Security**: Helmet, CORS, rate limiting

### Database
- **Database**: PostgreSQL 14+
- **ORM**: Prisma 5.x
- **Migrations**: Prisma Migrate
- **Schema**: 7 tables with comprehensive relationships

### Testing & Quality
- **Testing Framework**: Jest
- **React Testing**: React Testing Library
- **E2E Testing**: Playwright (optional)
- **Code Coverage**: 85%+ coverage
- **Linting**: ESLint with TypeScript support
- **Formatting**: Prettier

### DevOps & Deployment
- **CI/CD**: GitHub Actions
- **Containerization**: Docker & Docker Compose
- **Hosting**: Vercel (Frontend) + Railway/Heroku (Backend)
- **Monitoring**: Application logs and error tracking

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: v9.0.0 or higher (comes with Node.js)
- **PostgreSQL**: v14.0 or higher ([Download](https://www.postgresql.org/download/))
- **Git**: Latest version ([Download](https://git-scm.com/))

Optional but recommended:
- **Docker**: For containerized development ([Download](https://www.docker.com/))
- **VS Code**: With recommended extensions ([Download](https://code.visualstudio.com/))

---

## 🚀 Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/financial-advisor.git
   cd financial-advisor
   ```

2. **Install dependencies**
   ```bash
   # Install all dependencies (frontend + backend)
   npm install
   
   # Or install separately
   cd frontend && npm install
   cd ../backend && npm install
   ```

### Environment Configuration

1. **Create environment files**

   Create a `.env` file in the `backend` directory:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Configure environment variables**

   Edit `backend/.env` with your settings:
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   
   # Database Configuration
   DATABASE_URL="postgresql://username:password@localhost:5432/financial_advisor?schema=public"
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   
   # API Keys (Optional - for real-time currency data)
   CURRENCY_API_KEY=your-api-key-here
   
   # Email Configuration (Optional - for notifications)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

3. **Frontend environment** (if needed)

   Create `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

### Database Setup

1. **Create PostgreSQL database**
   ```bash
   # Connect to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE financial_advisor;
   
   # Exit psql
   \q
   ```

2. **Run Prisma migrations**
   ```bash
   cd backend
   
   # Generate Prisma Client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev
   
   # (Optional) Seed the database with sample data
   npx prisma db seed
   ```

3. **Verify database setup**
   ```bash
   # Open Prisma Studio to view your database
   npx prisma studio
   ```

### Running the Application

#### Development Mode

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:5000`

2. **Start the frontend development server** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

3. **Open your browser**
   Navigate to `http://localhost:5173`

#### Using Docker (Alternative)

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# Stop services
docker-compose down
```

#### Production Build

```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd ../backend
npm run build

# Start production server
npm start
```

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test suite
npm test -- calculator.test.ts
```

### Test Structure

```
tests/
├── unit/              # Unit tests for individual components
├── integration/       # Integration tests for API endpoints
├── e2e/              # End-to-end tests (if configured)
└── fixtures/         # Test data and mocks
```

### Code Coverage

The project maintains **85%+ code coverage** across:
- ✅ Financial calculation functions
- ✅ API endpoints and middleware
- ✅ React components and hooks
- ✅ Database operations
- ✅ Authentication flows

View coverage report:
```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

---

## 📁 Project Structure

```
financial-advisor/
├── frontend/                 # React frontend application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── ui/         # shadcn/ui components
│   │   │   ├── calculators/ # Calculator components
│   │   │   ├── dashboard/  # Dashboard components
│   │   │   └── layout/     # Layout components (Header, Footer, etc.)
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   ├── types/          # TypeScript type definitions
│   │   ├── styles/         # Global styles (Tailwind)
│   │   ├── App.tsx         # Main application component
│   │   └── main.tsx        # Application entry point
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                 # Express.js backend API
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware (auth, validation, etc.)
│   │   ├── services/       # Business logic
│   │   ├── models/         # Data models (if not using Prisma exclusively)
│   │   ├── utils/          # Utility functions
│   │   ├── config/         # Configuration files
│   │   └── server.ts       # Express server setup
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   ├── migrations/     # Database migrations
│   │   └── seed.ts         # Database seeding script
│   ├── tests/              # Backend tests
│   ├── package.json
│   └── tsconfig.json
│
├── docs/                    # Documentation
│   ├── API.md              # API documentation
│   ├── DATABASE.md         # Database schema documentation
│   ├── DEPLOYMENT.md       # Deployment guide
│   └── ARCHITECTURE.md     # Architecture overview
│
├── .github/
│   └── workflows/          # GitHub Actions CI/CD
│       ├── ci.yml
│       └── deploy.yml
│
├── docker-compose.yml      # Docker composition
├── Dockerfile              # Docker configuration
├── .gitignore
├── README.md               # This file
├── LICENSE
└── CONTRIBUTING.md
```

---

## 📚 API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and receive JWT token |
| POST | `/auth/logout` | Logout user |
| POST | `/auth/refresh` | Refresh JWT token |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/reset-password` | Reset password with token |

### User Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/profile` | Get current user profile |
| PUT | `/users/profile` | Update user profile |
| GET | `/users/activity` | Get user activity log |
| DELETE | `/users/account` | Delete user account |

### Calculator Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/calculators/retirement` | Calculate retirement savings |
| POST | `/calculators/investment` | Calculate investment returns |
| POST | `/calculators/savings` | Calculate savings growth |
| GET | `/calculators/history` | Get calculation history |
| POST | `/calculators/save` | Save calculation result |

### Dashboard Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/overview` | Get dashboard overview |
| GET | `/dashboard/savings` | Get savings tracking data |
| POST | `/dashboard/goals` | Create financial goal |
| PUT | `/dashboard/goals/:id` | Update financial goal |
| DELETE | `/dashboard/goals/:id` | Delete financial goal |

### Currency Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/currency/rates` | Get current exchange rates |
| POST | `/currency/convert` | Convert between currencies |
| GET | `/currency/historical` | Get historical rates |

For detailed API documentation with request/response examples, see [docs/API.md](docs/API.md)

---

## 🚢 Deployment

### Frontend Deployment (Vercel)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

3. **Configure environment variables** in Vercel dashboard

### Backend Deployment (Railway/Heroku)

#### Using Railway

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and deploy**
   ```bash
   cd backend
   railway login
   railway init
   railway up
   ```

3. **Add PostgreSQL** in Railway dashboard

#### Using Heroku

1. **Install Heroku CLI** ([Download](https://devcenter.heroku.com/articles/heroku-cli))

2. **Deploy**
   ```bash
   cd backend
   heroku create your-app-name
   heroku addons:create heroku-postgresql:hobby-dev
   git push heroku main
   ```

### Database Migration in Production

```bash
# Run migrations
npx prisma migrate deploy

# Verify
npx prisma studio
```

### Docker Deployment

```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

For detailed deployment instructions, see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Write/update tests**
5. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR
- Keep PRs focused on a single feature or fix

### Code Style

```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Reporting Issues

- Use the GitHub issue tracker
- Include detailed description and steps to reproduce
- Add screenshots for UI issues
- Specify your environment (OS, Node version, etc.)

For more details, see [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Financial Advisor Platform

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 Contact

### Project Maintainer
- **Email**: contact@financialadvisor.com
- **GitHub**: [@yourusername](https://github.com/yourusername)
- **Website**: [https://your-domain.com](https://your-domain.com)

### Support
- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/yourusername/financial-advisor/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/financial-advisor/discussions)

### Social Media
- **Twitter**: [@financialadvisor](https://twitter.com/financialadvisor)
- **LinkedIn**: [Financial Advisor Platform](https://linkedin.com/company/financial-advisor-platform)

---

## 🙏 Acknowledgments

- **shadcn/ui** - For the beautiful UI component library
- **Recharts** - For powerful charting capabilities
- **Prisma** - For the excellent database ORM
- **Vercel** - For hosting and deployment platform
- **All contributors** - Thank you for your valuable contributions!

---

## 🗺 Roadmap

### Version 2.0 (Planned)
- [ ] Mobile app (React Native)
- [ ] AI-powered financial recommendations
- [ ] Integration with banking APIs (Plaid)
- [ ] Advanced portfolio analytics
- [ ] Multi-language support
- [ ] Tax planning calculator
- [ ] Estate planning tools

### Version 1.5 (In Progress)
- [x] Complete authentication system
- [x] Dark mode support
- [x] PDF report generation
- [x] Profile management
- [ ] Email notifications
- [ ] Two-factor authentication
- [ ] Social login (Google, Facebook)

### Version 1.0 (Current)
- [x] Core calculators (retirement, investment, savings, currency)
- [x] Dashboard and tracking
- [x] Database integration
- [x] Testing infrastructure
- [x] CI/CD pipeline
- [x] Documentation

---

## 📊 Project Statistics

- **Total Files**: 119
- **Code Coverage**: 85%+
- **Test Suites**: 45+ automated tests
- **Database Tables**: 7 tables with relationships
- **API Endpoints**: 25+ RESTful endpoints
- **UI Components**: 30+ reusable components
- **Lines of Code**: ~15,000+ (excluding dependencies)

---

<div align="center">

**[⬆ Back to Top](#financial-advisor-platform)**

Made with ❤️ by the Financial Advisor Platform Team

</div>
