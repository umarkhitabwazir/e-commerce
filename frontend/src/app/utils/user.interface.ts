export type UserInterface = {
  _id?: string
  username?: string
  phone?: number
  email?: string
  role?: string
  password?: string
  isVerified?: boolean
  status?:string,
  createdAt?: string
  updatedAt?: string
} | null
