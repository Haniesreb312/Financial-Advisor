import { ArrowRight, Shield, TrendingUp, Users } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface HeroProps {
  onNavigate: (section: string) => void;
  isAuthenticated?: boolean;
  onShowRegister?: () => void;
}

export function Hero({ onNavigate, isAuthenticated, onShowRegister }: HeroProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-gray-900 dark:text-white mb-6">
              Your Financial Future Starts Here
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
              Expert financial advice, investment planning, and retirement strategies tailored to your goals. 
              Start building your wealth with confidence today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {isAuthenticated ? (
                <>
                  <button 
                    onClick={() => onNavigate("dashboard")}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 hover:scale-105 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group"
                  >
                    View Dashboard
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button 
                    onClick={() => onNavigate("calculator")}
                    className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 hover:scale-105 hover:shadow-lg transition-all duration-300 border-2 border-blue-600"
                  >
                    Explore Calculator
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={onShowRegister}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 hover:scale-105 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group"
                  >
                    Get Started Free
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button 
                    onClick={() => onNavigate("services")}
                    className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 hover:scale-105 hover:shadow-lg transition-all duration-300 border-2 border-blue-600"
                  >
                    Learn More
                  </button>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12">
              <div>
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <Users className="h-5 w-5" />
                </div>
                <div className="text-gray-900">10,000+</div>
                <div className="text-gray-600 text-sm">Clients Served</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div className="text-gray-900">$2.5B+</div>
                <div className="text-gray-600 text-sm">Assets Managed</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <Shield className="h-5 w-5" />
                </div>
                <div className="text-gray-900">25 Years</div>
                <div className="text-gray-600 text-sm">Experience</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1762831063004-bbd3ea38ba3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBwbGFubmluZyUyMG9mZmljZXxlbnwxfHx8fDE3NjMzNjc2Njh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Financial Planning"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
