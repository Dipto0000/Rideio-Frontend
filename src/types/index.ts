export type Role = "USER" | "ADMIN" | "SUPER_ADMIN"
export type SubRole = "RIDER" | "DRIVER"
export type UserStatus = "ACTIVE" | "INACTIVE" | "BLOCKED"
export type VehicleType = "BIKE" | "CAR"
export type RideStatus = "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"

export type NotificationType =
  | "RIDE_ACCEPTED"
  | "RIDE_CANCELLED"
  | "RIDE_CANCELLED_BY_DRIVER"
  | "RIDE_STARTED"
  | "RIDE_COMPLETED"
  | "NEW_RIDE_AVAILABLE"
  | "SUBSCRIPTION_EXPIRING"
  | "SUBSCRIPTION_EXPIRED"
  | "NEW_USER_REGISTERED"
  | "PAYMENT_RECEIVED"
  | "RIDE_REPORTED"
  | "ADMIN_CREATED"
  | "USER_DELETED"
  | "ACCOUNT_BLOCKED"

export interface AppNotification {
  _id: string
  message: string
  rideId?: string
  type: NotificationType
  isRead: boolean
  createdAt: string
}

export interface NotificationSettings {
  RIDE_ACCEPTED: boolean
  RIDE_CANCELLED: boolean
  RIDE_CANCELLED_BY_DRIVER: boolean
  RIDE_STARTED: boolean
  RIDE_COMPLETED: boolean
  NEW_RIDE_AVAILABLE: boolean
  SUBSCRIPTION_EXPIRING: boolean
  SUBSCRIPTION_EXPIRED: boolean
  NEW_USER_REGISTERED: boolean
  PAYMENT_RECEIVED: boolean
  RIDE_REPORTED: boolean
  ADMIN_CREATED: boolean
  USER_DELETED: boolean
  ACCOUNT_BLOCKED: boolean
}

export interface ILocation {
  address: string
  lat: number
  lng: number
}

export interface User {
  _id: string
  name: string
  email: string
  picture?: string
  phone?: string
  address?: string
  role: Role
  subRole: SubRole
  status: UserStatus
  isVerified: boolean
  isSubscribed: boolean
  subscription?: {
    isSubscribed: boolean
    expiryDate?: string
  }
  licenseNumber?: string
  numberplate?: string
  vehicleType?: VehicleType
  dob?: string
  averageRating?: number
  totalReviews?: number
}

export interface Ride {
  _id: string
  riderId: Pick<User, "_id" | "name" | "picture" | "phone">
  driverId?: Pick<User, "_id" | "name" | "picture" | "phone" | "numberplate" | "vehicleType">
  from: ILocation
  to: ILocation
  arrivalTime: string
  vehicleType: VehicleType
  status: RideStatus
  systemSuggestedFare: number
  distanceInKm?: number
  createdAt: string
  updatedAt: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPage: number
}

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED" | "REFUNDED"
export type PlanType = "MONTHLY"

export interface PaymentRecord {
  _id: string
  userId: string
  paymentId: string
  planType: PlanType
  amount: number
  currency: string
  status: PaymentStatus
  sslcommerzTxnNo?: string
  method: string
  startDate: string
  endDate: string
  createdAt: string
}

export interface SubscriptionStatus {
  isSubscribed: boolean
  expiryDate?: string
  latestPayment: PaymentRecord | null
}

export interface InitPaymentResult {
  gatewayUrl: string
  paymentId: string
  amount: number
  currency: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  message?: string
  data?: T
  meta?: PaginationMeta
}
