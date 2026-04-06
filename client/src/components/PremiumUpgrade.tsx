import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Crown, BarChart3, Layout, Ban, Sparkles, Check } from "lucide-react";
import { useLanguage } from "../context/LanguageContext"; // ✅ added

interface PremiumUpgradeProps {
  onUpgrade?: () => void;
  inline?: boolean;
}

export function PremiumUpgrade({ onUpgrade, inline = false }: PremiumUpgradeProps) {
  const { t } = useLanguage(); // ✅ added

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
                <h3 className="text-xl">{t.unlockPremium}</h3>
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">PRO</Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t.premiumDescription}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span>{t.analyticsDashboard}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center shrink-0">
                    <Layout className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span>{t.customWidgets}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-950 flex items-center justify-center shrink-0">
                    <Ban className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span>{t.noAds}</span>
                </div>
              </div>
              {onUpgrade && (
                <Button onClick={onUpgrade} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white gap-2">
                  <Sparkles className="w-4 h-4" />
                  {t.upgradeToPremium}
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
        <h2 className="text-3xl mb-2">{t.upgradeToPremium}</h2>
        <p className="text-gray-600 dark:text-gray-400">{t.premiumDescription}</p>
      </div>

      <Card className="border-2 border-amber-200 dark:border-amber-900">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CardTitle className="text-2xl">{t.premiumPlan}</CardTitle>
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">PRO</Badge>
          </div>
          <CardDescription>{t.premiumPlanDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl mb-3">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">{t.analyticsDashboard}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t.analyticsFeature}</p>
            </div>

            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-600 rounded-xl mb-3">
                <Layout className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">{t.customWidgets}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t.widgetsFeature}</p>
            </div>

            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-600 rounded-xl mb-3">
                <Ban className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">{t.noAds}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t.noAdsFeature}</p>
            </div>
          </div>

          <div className="border-t dark:border-gray-800 pt-6">
            <h4 className="font-semibold mb-4 text-center">{t.allPremiumFeatures}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600 shrink-0" />
                <span>{t.advancedAnalytics}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600 shrink-0" />
                <span>{t.customWidgets}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600 shrink-0" />
                <span>{t.noAds}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600 shrink-0" />
                <span>{t.prioritySupport}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600 shrink-0" />
                <span>{t.exportData}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600 shrink-0" />
                <span>{t.unlimitedTasks}</span>
              </div>
            </div>
          </div>

          {onUpgrade && (
            <div className="pt-4">
              <Button onClick={onUpgrade} size="lg" className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white gap-2">
                <Sparkles className="w-5 h-5" />
                {t.upgradeToPremiumNow}
              </Button>
              <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-3">{t.cancelAnytime}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
