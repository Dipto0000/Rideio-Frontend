"use client"

import { useState, useCallback } from "react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import {
  User,
  Camera,
  X,
  KeyRound,
  Bell,
  Car,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  updateProfile,
  uploadProfilePhoto,
  changePassword,
  setPassword,
} from "@/lib/actions/profile.actions"
import {
  getNotificationSettings,
  updateNotificationSettings,
} from "@/lib/actions/notification.actions"
import type { NotificationSettings } from "@/types"

const NOTIFICATION_LABELS: Record<string, string> = {
  RIDE_ACCEPTED: "Ride Accepted",
  RIDE_CANCELLED: "Ride Cancelled",
  RIDE_CANCELLED_BY_DRIVER: "Ride Cancelled by Driver",
  RIDE_STARTED: "Ride Started",
  RIDE_COMPLETED: "Ride Completed",
  NEW_RIDE_AVAILABLE: "New Ride Available",
  SUBSCRIPTION_EXPIRING: "Subscription Expiring",
  SUBSCRIPTION_EXPIRED: "Subscription Expired",
  NEW_USER_REGISTERED: "New User Registered",
  PAYMENT_RECEIVED: "Payment Received",
  RIDE_REPORTED: "Ride Reported",
  ADMIN_CREATED: "Admin Created",
  USER_DELETED: "User Deleted",
  ACCOUNT_BLOCKED: "Account Blocked",
}

interface ProfileData {
  name: string
  email: string
  phone?: string
  address?: string
  picture?: string
  role: string
  subRole: string
  vehicleType?: string
  numberplate?: string
  licenseNumber?: string
  password?: string
}

interface Props {
  initialProfile: ProfileData
  initialSettings: NotificationSettings | null
}

export function ProfileContent({ initialProfile, initialSettings }: Props) {
  const { data: session, update } = useSession()
  const accessToken = session?.user.accessToken
  const userId = session?.user.id
  const [profile, setProfile] = useState<ProfileData>(initialProfile)
  const [saving, setSaving] = useState(false)
  const [photoUploading, setPhotoUploading] = useState(false)
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | null>(initialSettings)
  const [notifSaving, setNotifSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Form state
  const [name, setName] = useState(initialProfile.name || "")
  const [phone, setPhone] = useState(initialProfile.phone || "")
  const [address, setAddress] = useState(initialProfile.address || "")
  const [vehicleType, setVehicleType] = useState<"bike" | "car" | "">((initialProfile.vehicleType as "bike" | "car") || "")
  const [numberplate, setNumberplate] = useState(initialProfile.numberplate || "")
  const [licenseNumber, setLicenseNumber] = useState(initialProfile.licenseNumber || "")

  // Password state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordSaving, setPasswordSaving] = useState(false)

  const isDriver = profile.subRole === "DRIVER"

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    if (!accessToken || !userId) {
      setMessage({ type: "error", text: "Session not ready. Try refreshing the page." })
      setSaving(false)
      return
    }
    const res = await updateProfile(
      {
        name,
        phone,
        address,
        ...(isDriver
          ? { vehicleType: vehicleType || undefined, numberplate, licenseNumber }
          : {}),
      },
      accessToken,
      userId
    )

    if (res.success) {
      setMessage({ type: "success", text: "Profile updated successfully" })
      update({ name })
    } else {
      setMessage({ type: "error", text: res.message || "Failed to update profile" })
    }
    setSaving(false)
  }

  const uploadPhoto = async (file: File) => {
    setPhotoUploading(true)
    setMessage(null)

    const formData = new FormData()
    formData.append("profilePicture", file)
    if (!accessToken) {
      setMessage({ type: "error", text: "Session not ready. Try refreshing the page." })
      setPhotoUploading(false)
      return
    }
    const res = await uploadProfilePhoto(formData, accessToken)

    if (res.success) {
      setMessage({ type: "success", text: "Profile photo updated" })
      update({})
    } else {
      setMessage({ type: "error", text: res.message || "Failed to upload photo" })
    }
    setPhotoUploading(false)
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" })
      return
    }
    setPasswordSaving(true)
    setMessage(null)

    if (!accessToken) {
      setMessage({ type: "error", text: "Session not ready. Try refreshing the page." })
      setPasswordSaving(false)
      return
    }
    let res
    if (profile.password) {
      res = await changePassword({ currentPassword, newPassword }, accessToken)
    } else {
      res = await setPassword({ password: newPassword }, accessToken)
    }

    if (res.success) {
      setMessage({ type: "success", text: "Password updated successfully" })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } else {
      setMessage({ type: "error", text: res.message || "Failed to update password" })
    }
    setPasswordSaving(false)
  }

  const handleToggleNotification = async (key: string, value: boolean) => {
    if (!notificationSettings) return
    setNotifSaving(true)
    setNotificationSettings((prev) => prev ? { ...prev, [key]: value } : prev)

    if (!accessToken) return
    const res = await updateNotificationSettings({ [key]: value }, accessToken)
    if (!res.success) {
      setNotificationSettings((prev) => prev ? { ...prev, [key]: !value } : prev)
    }
    setNotifSaving(false)
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profile Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your account and preferences</p>
      </div>

      {/* Feedback message */}
      {message && (
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
              : "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{message.text}</span>
          <button className="ml-auto" onClick={() => setMessage(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Profile Photo</CardTitle>
              <CardDescription>Upload a photo to help others recognize you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="relative">
                  {profile.picture ? (
                    <Image
                      src={profile.picture}
                      alt="Profile"
                      width={96}
                      height={96}
                      className="w-24 h-24 rounded-full object-cover border-2 border-border"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-2 border-border">
                      <User className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                  <label
                    htmlFor="photo-upload"
                    className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-primary/90 transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </label>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) uploadPhoto(file)
                    }}
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-medium text-foreground">{profile.name}</p>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                  <div className="flex gap-2 mt-1">
                    {(profile.role === "SUPER_ADMIN" || profile.role === "ADMIN") && (
                      <Badge variant="destructive">
                        {profile.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
                      </Badge>
                    )}
                    <Badge variant="secondary">
                      {profile.subRole === "DRIVER" ? "Driver" : "Rider"}
                    </Badge>
                  </div>
                  {photoUploading && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Uploading...
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Personal Information</CardTitle>
              <CardDescription>Update your profile details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-sm font-medium text-foreground">Name</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Phone</label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Address</label>
                    <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Your address" />
                  </div>
                  {isDriver && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Vehicle Type</label>
                        <select
                          value={vehicleType}
                          onChange={(e) => setVehicleType(e.target.value as "bike" | "car")}
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                          <option value="">Select vehicle</option>
                          <option value="bike">Bike</option>
                          <option value="car">Car</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Number Plate</label>
                        <Input value={numberplate} onChange={(e) => setNumberplate(e.target.value)} placeholder="Vehicle number plate" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">License Number</label>
                        <Input value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} placeholder="Driver's license" />
                      </div>
                    </>
                  )}
                </div>
                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {profile.password ? "Change Password" : "Set Password"}
              </CardTitle>
              <CardDescription>
                {profile.password
                  ? "Update your current password"
                  : "Set a password for your account"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4 max-w-sm">
                {profile.password && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Current Password</label>
                    <Input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Current password"
                      required
                    />
                  </div>
                )}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">New Password</label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    required
                    minLength={6}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Confirm New Password</label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    minLength={6}
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={passwordSaving}>
                    {passwordSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4 mr-1.5" />
                        {profile.password ? "Change Password" : "Set Password"}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Notification Preferences</CardTitle>
                  <CardDescription>Choose which notifications you want to receive</CardDescription>
                </div>
                {notifSaving && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Saving...
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!notificationSettings ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-1">
                  {Object.entries(NOTIFICATION_LABELS).map(([key, label]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <span className="text-sm text-foreground">{label}</span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={(notificationSettings as unknown as Record<string, boolean>)[key] ?? true}
                        onClick={() =>
                          handleToggleNotification(key, !(notificationSettings as unknown as Record<string, boolean>)[key])
                        }
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                          (notificationSettings as unknown as Record<string, boolean>)[key]
                            ? "bg-primary"
                            : "bg-input"
                        }`}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                            (notificationSettings as unknown as Record<string, boolean>)[key]
                              ? "translate-x-[18px]"
                              : "translate-x-[3px]"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
