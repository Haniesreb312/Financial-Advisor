import { useState, useRef, useEffect } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Services } from "./components/Services";
import { Dashboard } from "./components/Dashboard";
import { MonthlyBudget } from "./components/MonthlyBudget";
import { SavingsPlanner } from "./components/SavingsPlanner";
import { RetirementPlanner } from "./components/RetirementPlanner";
import { InvestmentPlanner } from "./components/InvestmentPlanner";
import { CurrencyConverter } from "./components/CurrencyConverter";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Profile } from "./components/Profile";
import { Footer } from "./components/Footer";
import { Toaster } from "./components/ui/sonner";
import { toast } from "./components/ui/sonner";

interface User {
  name: string;
  email: string;
}

export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [showAuthPage, setShowAuthPage] = useState<"login" | "register" | null>(null);
  const [currentPage, setCurrentPage] = useState<"main" | "profile">("main");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const homeRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const budgetRef = useRef<HTMLDivElement>(null);
  const calculatorRef = useRef<HTMLDivElement>(null);

  // Check for saved session and dark mode on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("wealthwise_user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem("wealthwise_user");
      }
    }

    const savedDarkMode = localStorage.getItem("wealthwise_darkmode");
    if (savedDarkMode === "true") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const handleNavigate = (section: string) => {
    // Check if trying to access protected sections
    const protectedSections = ["dashboard", "budget", "calculator", "profile"];
    if (protectedSections.includes(section) && !isAuthenticated) {
      toast.error("Please sign in to access this feature");
      setShowAuthPage("login");
      return;
    }

    // Profile is now a separate page
    if (section === "profile") {
      setCurrentPage("profile");
      setActiveSection(section);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Make sure we're on the main page
    setCurrentPage("main");
    setActiveSection(section);
    setShowAuthPage(null);
    
    let targetRef: React.RefObject<HTMLDivElement> | null = null;
    
    switch(section) {
      case "home":
        targetRef = homeRef;
        break;
      case "services":
        targetRef = servicesRef;
        break;
      case "dashboard":
        targetRef = dashboardRef;
        break;
      case "budget":
        targetRef = budgetRef;
        break;
      case "calculator":
        targetRef = calculatorRef;
        break;
      default:
        targetRef = homeRef;
    }
    
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogin = (email: string, password: string) => {
    const newUser = { name: email.split("@")[0], email };
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem("wealthwise_user", JSON.stringify(newUser));
    setShowAuthPage(null);
    setCurrentPage("main");
    setActiveSection("dashboard");
    setTimeout(() => {
      dashboardRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleRegister = (name: string, email: string, password: string) => {
    const newUser = { name, email };
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem("wealthwise_user", JSON.stringify(newUser));
    setShowAuthPage(null);
    setCurrentPage("main");
    setActiveSection("dashboard");
    setTimeout(() => {
      dashboardRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("wealthwise_user");
    setCurrentPage("main");
    setActiveSection("home");
    toast.success("Logged out successfully");
    setTimeout(() => {
      homeRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleShowLogin = () => {
    setShowAuthPage("login");
  };

  const handleUpdateProfile = (name: string, email: string) => {
    const updatedUser = { name, email };
    setUser(updatedUser);
    localStorage.setItem("wealthwise_user", JSON.stringify(updatedUser));
  };

  const handleToggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("wealthwise_darkmode", newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    toast.success(newDarkMode ? "Dark mode enabled" : "Light mode enabled");
  };

  // Show auth pages if requested
  if (showAuthPage === "login") {
    return (
      <>
        <Toaster position="top-right" richColors />
        <Login
          onLogin={handleLogin}
          onSwitchToRegister={() => setShowAuthPage("register")}
        />
      </>
    );
  }

  if (showAuthPage === "register") {
    return (
      <>
        <Toaster position="top-right" richColors />
        <Register
          onRegister={handleRegister}
          onSwitchToLogin={() => setShowAuthPage("login")}
        />
      </>
    );
  }

  // Render Profile Page separately
  if (currentPage === "profile" && isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <Toaster position="top-right" richColors />
        <Header
          onNavigate={handleNavigate}
          isAuthenticated={isAuthenticated}
          userEmail={user?.email}
          onLogout={handleLogout}
          onShowLogin={handleShowLogin}
          isDarkMode={isDarkMode}
        />
        <Profile 
          user={user} 
          onUpdateProfile={handleUpdateProfile}
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
          onBack={() => setCurrentPage("main")}
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Toaster position="top-right" richColors />
      <Header
        onNavigate={handleNavigate}
        isAuthenticated={isAuthenticated}
        userEmail={user?.email}
        onLogout={handleLogout}
        onShowLogin={handleShowLogin}
        isDarkMode={isDarkMode}
      />
      
      {/* Home Section */}
      <div ref={homeRef}>
        <Hero
          onNavigate={handleNavigate}
          isAuthenticated={isAuthenticated}
          onShowRegister={() => setShowAuthPage("register")}
        />
      </div>
      
      {/* Services Section */}
      <div ref={servicesRef}>
        <Services />
      </div>
      
      {/* Protected Sections - Only show if authenticated */}
      {isAuthenticated && (
        <>
          {/* Dashboard Section */}
          <div ref={dashboardRef}>
            <Dashboard userName={user?.name} />
          </div>
          
          {/* Budget Section */}
          <div ref={budgetRef}>
            <MonthlyBudget userName={user?.name} />
          </div>
          
          {/* Calculator Section */}
          <div ref={calculatorRef} className="bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-gray-900 dark:text-white mb-4">Financial Calculators</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Use our comprehensive suite of financial calculators to plan your financial future
              </p>
            </div>
          </div>
        </div>
        
            <InvestmentPlanner userName={user?.name} />
            <SavingsPlanner userName={user?.name} />
            <RetirementPlanner userName={user?.name} />
            <CurrencyConverter />
          </div>
        </>
      )}
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
