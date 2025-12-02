#!/bin/bash

echo "🚀 WealthWise Advisors - Full Stack Setup"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node --version) detected${NC}"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${RED}⚠️  PostgreSQL is not installed${NC}"
    echo "Please install PostgreSQL first:"
    echo "  macOS: brew install postgresql"
    echo "  Ubuntu: sudo apt install postgresql"
    echo "  Windows: Download from postgresql.org"
    read -p "Press enter once PostgreSQL is installed..."
fi

echo ""
echo -e "${BLUE}📦 Installing Backend Dependencies...${NC}"
cd backend
npm install

echo ""
echo -e "${BLUE}⚙️  Setting up Backend Environment...${NC}"
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✅ Created .env file${NC}"
    echo -e "${RED}⚠️  IMPORTANT: Edit backend/.env with your database credentials${NC}"
    read -p "Press enter once you've configured backend/.env..."
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi

echo ""
echo -e "${BLUE}🗄️  Setting up Database...${NC}"
echo "Generating Prisma Client..."
npx prisma generate

echo "Running database migrations..."
npx prisma migrate dev --name init

echo ""
echo -e "${GREEN}✅ Backend setup complete!${NC}"

cd ..

echo ""
echo -e "${BLUE}📦 Installing Frontend Dependencies...${NC}"
cd frontend
npm install

echo ""
echo -e "${BLUE}⚙️  Setting up Frontend Environment...${NC}"
if [ ! -f .env ]; then
    echo "VITE_API_URL=http://localhost:5000/api" > .env
    echo -e "${GREEN}✅ Created .env file${NC}"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi

cd ..

echo ""
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo ""
echo "To start the application:"
echo ""
echo "  Terminal 1 (Backend):"
echo -e "    ${BLUE}cd backend${NC}"
echo -e "    ${BLUE}npm run dev${NC}"
echo ""
echo "  Terminal 2 (Frontend):"
echo -e "    ${BLUE}cd frontend${NC}"
echo -e "    ${BLUE}npm run dev${NC}"
echo ""
echo "Then open http://localhost:3000 in your browser"
echo ""
echo "📚 Documentation:"
echo "  - README.md - Main documentation"
echo "  - database/README.md - Database guide"
echo "  - MIGRATION_GUIDE.md - Migration from old structure"
