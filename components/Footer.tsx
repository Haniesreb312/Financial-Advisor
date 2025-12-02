import { TrendingUp, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-black text-white py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-6 w-6 text-blue-500" />
              <span className="text-white">WealthWise</span>
            </div>
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              Your trusted partner in financial planning and wealth management.
            </p>
          </div>

          {/* Calculators */}
          <div>
            <h4 className="text-white mb-4">Calculators</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Investment Calculator</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Retirement Planner</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Savings Planner</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Currency Converter</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white mb-4">Contact</h4>
            <div className="space-y-3">
              <a 
                href="mailto:info@wealthwise.com" 
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm group"
              >
                <Mail className="h-4 w-4 group-hover:text-blue-500 transition-colors" />
                info@wealthwise.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 dark:border-gray-900 mt-8 pt-8 text-center">
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            © {currentYear} WealthWise. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
