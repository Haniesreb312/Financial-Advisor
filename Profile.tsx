import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { User, Mail, Calendar, Shield, Edit2, Save, X, Moon, Sun, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "./ui/sonner";

interface ProfileProps {
  user: {
    name: string;
    email: string;
  };
  onUpdateProfile: (name: string, email: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onBack?: () => void;
}

export function Profile({ user, onUpdateProfile, isDarkMode, onToggleDarkMode, onBack }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const handleSave = () => {
    if (!name || !email) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    onUpdateProfile(name, email);
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleCancel = () => {
    setName(user.name);
    setEmail(user.email);
    setIsEditing(false);
  };

  const joinDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 min-h-screen transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          {onBack && (
            <Button
              onClick={onBack}
              variant="ghost"
              className="gap-2 mb-4 hover:bg-blue-100 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          )}
          <h2 className="text-gray-900 dark:text-white mb-2">My Profile</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your account information and preferences</p>
        </div>

        <div className="grid gap-6">
          {/* Profile Information Card */}
          <Card className="p-8 shadow-lg dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-4 rounded-full">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-gray-900 dark:text-white">Personal Information</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Update your personal details</p>
                </div>
              </div>
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </Button>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="name" className="flex items-center gap-2 mb-2 dark:text-gray-300">
                  <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing}
                  className="h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <Label htmlFor="email" className="flex items-center gap-2 mb-2 dark:text-gray-300">
                  <Mail className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing}
                  className="h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-2 dark:text-gray-300">
                  <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  Member Since
                </Label>
                <Input
                  type="text"
                  value={joinDate}
                  disabled
                  className="h-12 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400"
                />
              </div>

              {isEditing && (
                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={handleSave}
                    className="flex-1 gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="flex-1 gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Account Statistics Card */}
          <Card className="p-8 shadow-lg dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-br from-green-600 to-teal-600 p-4 rounded-full">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-gray-900 dark:text-white">Account Activity</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Your WealthWise journey</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Investments</div>
                <div className="text-gray-900 dark:text-white">$0.00</div>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Plans</div>
                <div className="text-gray-900 dark:text-white">0</div>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Calculators Used</div>
                <div className="text-gray-900 dark:text-white">0</div>
              </div>
            </div>
          </Card>

          {/* Preferences & Security Card */}
          <Card className="p-8 shadow-lg dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-br from-red-600 to-orange-600 p-4 rounded-full">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-gray-900 dark:text-white">Preferences & Security</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage your account preferences and security</p>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-between gap-2 h-12 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                onClick={onToggleDarkMode}
              >
                <span className="flex items-center gap-2">
                  {isDarkMode ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                  {isDarkMode ? "Light Mode" : "Dark Mode"}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {isDarkMode ? "Switch to light theme" : "Switch to dark theme"}
                </span>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 h-12 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                onClick={() => toast.info("Password change - Feature coming soon")}
              >
                Change Password
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 h-12 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                onClick={() => toast.info("Two-factor authentication - Feature coming soon")}
              >
                Enable Two-Factor Authentication
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 h-12 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                onClick={() => toast.error("Account deletion - Please contact support")}
              >
                Delete Account
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
