export type Role = "USER" | "ADMIN" | "SUPER_ADMIN"
export type SubRole = "RIDER" | "DRIVER"
export type UserStatus = "ACTIVE" | "INACTIVE" | "BLOCKED"
export type VehicleType = "BIKE" | "CAR"
export type RideStatus = "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"

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
  riderId: Pick<User, "_id" | "name" | "picture">
  driverId?: Pick<User, "_id" | "name" | "picture" | "phone">
  from: ILocation
  to: ILocation
  arrivalTime: string
  vehicleType: VehicleType
  status: RideStatus
  proposedFare: number
  systemSuggestedFare?: number
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

export interface ApiResponse<T = unknown> {
  success: boolean
  message?: string
  data?: T
  meta?: PaginationMeta
}
