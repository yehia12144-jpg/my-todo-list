import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Crown, BarChart3, Layout, Ban, Sparkles, Check } from "lucide-react";

interface PremiumUpgradeProps {
  onUpgrade?: () => void;
  inline?: boolean;
}

export function PremiumUpgrade({ onUpgrade, inline = false }: PremiumUpgradeProps) {
  if (inline) {
    return (
      <Card className="border-2 border-amber-200 dark:border-amber-900 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shrink-0">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl">Unlock Premium Features</h3>
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                  PRO
                </Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Get access to advanced analytics, customizable widgets, and an ad-free experience.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span>Analytics Dashboard</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center shrink-0">
                    <Layout className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span>Custom Widgets</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-950 flex items-center justify-center shrink-0">
                    <Ban className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span>No Ads</span>
                </div>
              </div>
              {onUpgrade && (
                <Button
                  onClick={onUpgrade}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Upgrade to Premium
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl mb-4">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl mb-2">Upgrade to Premium</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Unlock powerful features to supercharge your productivity
        </p>
      </div>

      <Card className="border-2 border-amber-200 dark:border-amber-900">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CardTitle className="text-2xl">Premium Plan</CardTitle>
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
              PRO
            </Badge>
          </div>
          <CardDescription>Everything you need for advanced task management</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl mb-3">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Analytics Dashboard</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Track your productivity with detailed charts, completion rates, and insights
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-600 rounded-xl mb-3">
                <Layout className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Customizable Widgets</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Create personalized dashboard widgets to monitor what matters most
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-600 rounded-xl mb-3">
                <Ban className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Ad-Free Experience</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enjoy a clean, distraction-free interface without any advertisements
              </p>
            </div>
          </div>

          <div className="border-t dark:border-gray-800 pt-6">
            <h4 className="font-semibold mb-4 text-center">All Premium Features</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600 shrink-0" />
                <span>Advanced analytics and reporting</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600 shrink-0" />
                <span>Customizable dashboard widgets</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600 shrink-0" />
                <span>Ad-free experience</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600 shrink-0" />
                <span>Priority support</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600 shrink-0" />
                <span>Export data to CSV</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600 shrink-0" />
                <span>Unlimited tasks and categories</span>
              </div>
            </div>
          </div>

          {onUpgrade && (
            <div className="pt-4">
              <Button
                onClick={onUpgrade}
                size="lg"
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Upgrade to Premium Now
              </Button>
              <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-3">
                Cancel anytime • No commitment required
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
