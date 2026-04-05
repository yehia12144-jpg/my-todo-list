import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Crown, Check, LogOut } from "lucide-react"; // Added LogOut icon
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileDialog({ open, onOpenChange }: Props) {
  // Destructured logout from useAuth
  const { user, updateProfile, changePassword, logout } = useAuth();

  const [name, setName]                   = useState(user?.name ?? "");
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
      toast.success("Profile updated successfully");
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update profile.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) { toast.error("Passwords do not match"); return; }
    if (newPassword.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    try {
      setChangingPw(true);
      await changePassword(currentPassword, newPassword);
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      toast.success("Password changed successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not change password.");
    } finally {
      setChangingPw(false);
    }
  }

  function handleTogglePremium() {
    updateProfile({ isPremium: !user?.isPremium });
    toast.success(user?.isPremium ? "Premium deactivated" : "Upgraded to Premium!");
  }

  // Handle Logout action
  const handleLogout = () => {
    logout();
    onOpenChange(false);
    toast.success("Logged out successfully");
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Account</DialogTitle>
          <DialogDescription>Update your personal information and subscription.</DialogDescription>
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
                      <h3 className="font-semibold">{user.isPremium ? "Premium Account" : "Free Account"}</h3>
                      {user.isPremium && <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-xs">PRO</Badge>}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user.isPremium ? "Enjoying all premium features" : "Upgrade to unlock premium features"}
                    </p>
                  </div>
                </div>
                <Button onClick={handleTogglePremium} variant={user.isPremium ? "outline" : "default"}
                  className={user.isPremium ? "" : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"}>
                  {user.isPremium ? "Downgrade" : "Upgrade"}
                </Button>
              </div>
              {user.isPremium && (
                <div className="grid grid-cols-2 gap-2 pt-4 border-t dark:border-amber-800">
                  {["Analytics", "Widgets", "No Ads", "Priority Support"].map((f) => (
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
              <Label htmlFor="profile-name">Full Name</Label>
              <Input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-email">Email</Label>
              <Input id="profile-email" type="email" value={user.email} disabled />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Email updates are not enabled.</p>
            <Button type="submit" className="w-full" disabled={isSavingProfile}>
              {isSavingProfile ? "Saving..." : "Update Profile"}
            </Button>
          </form>

          {/* Password form */}
          <div className="border-t pt-4">
            <h3 className="mb-4 font-medium">Change Password</h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>
              <Button type="submit" variant="outline" className="w-full" disabled={isChangingPassword}>
                {isChangingPassword ? "Updating Password..." : "Change Password"}
              </Button>
            </form>
          </div>

          {/* Logout Section */}
          <div className="border-t pt-6">
            <Button 
              type="button" 
              variant="destructive" 
              className="w-full gap-2" 
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}