import { PiggyBank, TrendingUp, Home, Building2, GraduationCap, Heart } from "lucide-react";
import { Card } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Services() {
  const services = [
    {
      icon: TrendingUp,
      title: "Investment Management",
      description: "Diversified portfolio strategies designed to maximize returns while managing risk effectively.",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: PiggyBank,
      title: "Retirement Planning",
      description: "Comprehensive retirement strategies to ensure financial security in your golden years.",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Building2,
      title: "Wealth Management",
      description: "Holistic wealth planning services for high-net-worth individuals and families.",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: Home,
      title: "Estate Planning",
      description: "Protect your legacy with strategic estate planning and asset protection solutions.",
      color: "bg-orange-100 text-orange-600",
    },
    {
      icon: GraduationCap,
      title: "Education Funding",
      description: "Smart savings plans to fund your children's education without compromising your retirement.",
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      icon: Heart,
      title: "Insurance Planning",
      description: "Comprehensive insurance solutions to protect you and your loved ones from life's uncertainties.",
      color: "bg-pink-100 text-pink-600",
    },
  ];

  return (
    <div className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-gray-900 dark:text-white mb-4">Our Services</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Comprehensive financial solutions tailored to your unique needs and goals
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <Card key={index} className="p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group border-2 hover:border-blue-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-blue-600">
              <div className={`${service.color} dark:opacity-90 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                <service.icon className="h-6 w-6 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{service.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">{service.description}</p>
            </Card>
          ))}
        </div>

        {/* Why Choose Us Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mt-20">
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1758519289559-f4d0ead39634?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGludmVzdG1lbnQlMjBtZWV0aW5nfGVufDF8fHx8MTc2MzQ2Nzg2Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Investment Meeting"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-gray-900 dark:text-white mb-6">Why Choose WealthWise?</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-gray-900 dark:text-white mb-2">Personalized Strategies</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Every client receives a customized financial plan based on their unique goals and circumstances.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-gray-900 dark:text-white mb-2">Expert Team</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Our certified financial planners bring decades of combined experience to help you succeed.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-gray-900 dark:text-white mb-2">Transparent Approach</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    No hidden fees or surprises. We believe in complete transparency in all our dealings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
