import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Crown, Check, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext"; // ✅ added

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileDialog({ open, onOpenChange }: Props) {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const { t } = useLanguage(); // ✅ added

  const [name, setName]                       = useState(user?.name ?? "");
  const [isSavingProfile, setSavingProfile]   = useState(false);
  const [isChangingPassword, setChangingPw]   = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => { if (user) setName(user.name); }, [user]);

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSavingProfile(true);
      await updateProfile({ name });
      toast.success(t.profileUpdated);
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t.profileUpdated);
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) { toast.error(t.passwordsDoNotMatch); return; }
    if (newPassword.length < 8) { toast.error(t.passwordTooShort); return; }
    try {
      setChangingPw(true);
      await changePassword(currentPassword, newPassword);
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      toast.success(t.passwordChanged);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t.passwordChanged);
    } finally {
      setChangingPw(false);
    }
  }

  function handleTogglePremium() {
    updateProfile({ isPremium: !user?.isPremium });
    toast.success(user?.isPremium ? t.premiumDeactivated : t.upgradedToPremium);
  }

  const handleLogout = () => {
    logout();
    onOpenChange(false);
    toast.success(t.loggedOut);
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t.manageAccount}</DialogTitle>
          <DialogDescription>{t.manageAccountDescription}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Premium card */}
          <Card className={user.isPremium
            ? "border-2 border-amber-200 dark:border-amber-900 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20"
            : "border-dashed"}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${user.isPremium ? "bg-gradient-to-br from-amber-500 to-orange-500" : "bg-gray-200 dark:bg-gray-700"}`}>
                    <Crown className={`w-6 h-6 ${user.isPremium ? "text-white" : "text-gray-400"}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{user.isPremium ? t.premiumAccount : t.freeAccount}</h3>
                      {user.isPremium && <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-xs">PRO</Badge>}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user.isPremium ? t.enjoyingPremium : t.upgradeToUnlock}
                    </p>
                  </div>
                </div>
                <Button onClick={handleTogglePremium} variant={user.isPremium ? "outline" : "default"}
                  className={user.isPremium ? "" : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"}>
                  {user.isPremium ? t.downgrade : t.upgrade}
                </Button>
              </div>
              {user.isPremium && (
                <div className="grid grid-cols-2 gap-2 pt-4 border-t dark:border-amber-800">
                  {[t.analytics, t.widgets, t.noAds, t.prioritySupport].map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600" /><span>{f}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Profile form */}
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profile-name">{t.fullName}</Label>
              <Input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-email">{t.email}</Label>
              <Input id="profile-email" type="email" value={user.email} disabled />
            </div>
            <Button type="submit" className="w-full" disabled={isSavingProfile}>
              {isSavingProfile ? "..." : t.updateProfile}
            </Button>
          </form>

          {/* Password form */}
          <div className="border-t pt-4">
            <h3 className="mb-4 font-medium">{t.changePassword}</h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">{t.currentPassword}</Label>
                <Input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">{t.newPassword}</Label>
                <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">{t.confirmPassword}</Label>
                <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>
              <Button type="submit" variant="outline" className="w-full" disabled={isChangingPassword}>
                {isChangingPassword ? "..." : t.changePassword}
              </Button>
            </form>
          </div>

          {/* Logout */}
          <div className="border-t pt-6">
            <Button type="button" variant="destructive" className="w-full gap-2" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              {t.logout}
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>{t.close}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}