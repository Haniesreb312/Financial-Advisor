#!/bin/bash

# Test Runner Script for WealthWise Backend

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   WealthWise Backend Test Runner      ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo ""

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Must run from backend directory${NC}"
    exit 1
fi

# Function to run tests
run_test() {
    local test_name=$1
    local test_command=$2
    
    echo -e "${BLUE}▶ Running $test_name...${NC}"
    echo ""
    
    if eval "$test_command"; then
        echo ""
        echo -e "${GREEN}✅ $test_name passed!${NC}"
        echo ""
        return 0
    else
        echo ""
        echo -e "${RED}❌ $test_name failed!${NC}"
        echo ""
        return 1
    fi
}

# Parse command line arguments
case "${1:-all}" in
    "unit")
        echo -e "${YELLOW}Running Unit Tests Only${NC}"
        echo ""
        run_test "Unit Tests" "npm run test:unit"
        ;;
    
    "integration")
        echo -e "${YELLOW}Running Integration Tests Only${NC}"
        echo ""
        run_test "Integration Tests" "npm run test:integration"
        ;;
    
    "coverage")
        echo -e "${YELLOW}Running All Tests with Coverage${NC}"
        echo ""
        run_test "Tests with Coverage" "npm test -- --coverage"
        
        if [ $? -eq 0 ]; then
            echo -e "${BLUE}📊 Opening coverage report...${NC}"
            
            # Open coverage report based on OS
            if [[ "$OSTYPE" == "darwin"* ]]; then
                open coverage/lcov-report/index.html
            elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
                xdg-open coverage/lcov-report/index.html 2>/dev/null || echo "Open coverage/lcov-report/index.html in your browser"
            else
                echo "Open coverage/lcov-report/index.html in your browser"
            fi
        fi
        ;;
    
    "watch")
        echo -e "${YELLOW}Running Tests in Watch Mode${NC}"
        echo -e "${BLUE}Press 'q' to quit watch mode${NC}"
        echo ""
        npm run test:watch
        ;;
    
    "quick")
        echo -e "${YELLOW}Running Quick Test (No Coverage)${NC}"
        echo ""
        run_test "Quick Tests" "npm test -- --maxWorkers=4"
        ;;
    
    "all"|"")
        echo -e "${YELLOW}Running All Tests${NC}"
        echo ""
        
        # Run unit tests
        run_test "Unit Tests" "npm run test:unit"
        unit_result=$?
        
        # Run integration tests
        run_test "Integration Tests" "npm run test:integration"
        integration_result=$?
        
        # Summary
        echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
        echo -e "${BLUE}║           Test Summary                 ║${NC}"
        echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
        
        if [ $unit_result -eq 0 ]; then
            echo -e "${GREEN}✅ Unit Tests: PASSED${NC}"
        else
            echo -e "${RED}❌ Unit Tests: FAILED${NC}"
        fi
        
        if [ $integration_result -eq 0 ]; then
            echo -e "${GREEN}✅ Integration Tests: PASSED${NC}"
        else
            echo -e "${RED}❌ Integration Tests: FAILED${NC}"
        fi
        
        echo ""
        
        if [ $unit_result -eq 0 ] && [ $integration_result -eq 0 ]; then
            echo -e "${GREEN}🎉 All tests passed!${NC}"
            exit 0
        else
            echo -e "${RED}❌ Some tests failed${NC}"
            exit 1
        fi
        ;;
    
    "help"|"-h"|"--help")
        echo "Usage: ./test.sh [option]"
        echo ""
        echo "Options:"
        echo "  all          Run all tests (default)"
        echo "  unit         Run unit tests only"
        echo "  integration  Run integration tests only"
        echo "  coverage     Run all tests with coverage report"
        echo "  watch        Run tests in watch mode"
        echo "  quick        Run tests without coverage (faster)"
        echo "  help         Show this help message"
        echo ""
        echo "Examples:"
        echo "  ./test.sh              # Run all tests"
        echo "  ./test.sh unit         # Run unit tests"
        echo "  ./test.sh coverage     # Run with coverage"
        echo "  ./test.sh watch        # Watch mode"
        ;;
    
    *)
        echo -e "${RED}❌ Unknown option: $1${NC}"
        echo "Run './test.sh help' for usage information"
        exit 1
        ;;
esac
