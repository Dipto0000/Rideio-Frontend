import { z } from "zod"

// Shared
const bdPhoneRegex = /^(?:\+8801|01)[3-9]\d{8}$/
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]).{6,}$/

const phoneOptional = z
  .string()
  .regex(bdPhoneRegex, "Enter a valid Bangladeshi phone number (e.g. 01712345678)")
  .optional()
  .or(z.literal(""))

const phoneRequired = z
  .string()
  .min(1, "Phone number is required")
  .regex(bdPhoneRegex, "Enter a valid Bangladeshi phone number (e.g. 01712345678)")

const password = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .regex(passwordRegex, "Password must contain at least one letter and one special character")

// Login
export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
})
export type LoginInput = z.infer<typeof loginSchema>

// Rider Signup
export const riderSignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  password,
  phone: phoneOptional,
  address: z.string().optional(),
})
export type RiderSignupInput = z.infer<typeof riderSignupSchema>

// Driver Signup
export const driverSignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  password,
  phone: phoneRequired,
  address: z.string().min(1, "Address is required"),
  licenseNumber: z.string().min(1, "Driving license number is required"),
  numberplate: z.string().min(1, "Vehicle number plate is required"),
  vehicleType: z.enum(["bike", "car"], { required_error: "Please select a vehicle type", invalid_type_error: "Please select a vehicle type" }),
  dob: z.string().min(1, "Date of birth is required"),
})
export type DriverSignupInput = z.infer<typeof driverSignupSchema>

// Forgot Password
export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
})
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>

// Reset Password
export const resetPasswordSchema = z
  .object({
    password,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>

// Complete Profile
export const completeProfileSchema = z.object({
  phone: phoneOptional,
  address: z.string().optional(),
})
export type CompleteProfileInput = z.infer<typeof completeProfileSchema>

// Create Ride
export const createRideSchema = z.object({
  from: z.object(
    { lat: z.number(), lng: z.number(), address: z.string().min(1, "Pickup location is required") },
    { required_error: "Please select a pickup location" }
  ),
  to: z.object(
    { lat: z.number(), lng: z.number(), address: z.string().min(1, "Drop-off location is required") },
    { required_error: "Please select a drop-off location" }
  ),
  arrivalTime: z.string().min(1, "Arrival time is required").refine(
    (val) => new Date(val) > new Date(),
    "Arrival time must be in the future"
  ),
  vehicleType: z.enum(["BIKE", "CAR"], { required_error: "Please select a vehicle type" }),
  phone: z.string().optional(),
})
export type CreateRideInput = z.infer<typeof createRideSchema>
