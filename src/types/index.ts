export type Role = "USER" | "ADMIN" | "SUPER_ADMIN"
export type SubRole = "RIDER" | "DRIVER"
export type UserStatus = "ACTIVE" | "INACTIVE" | "BLOCKED"
export type VehicleType = "bike" | "car"

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
  rider: Pick<User, "_id" | "name" | "picture" | "phone">
  driver?: Pick<User, "_id" | "name" | "picture" | "phone" | "licenseNumber" | "numberplate" | "vehicleType">
  from: string
  to: string
  fromCoordinates?: [number, number]
  toCoordinates?: [number, number]
  driverArrivalTime?: string
  status: "pending" | "accepted" | "started" | "completed" | "cancelled"
  notes?: string
  createdAt: string
  updatedAt: string
}
