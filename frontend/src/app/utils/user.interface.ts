type UserInterface = {
  id: string
  username: string
  phone:number | null
  email: string
  role: string
  password: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
} | null

export type { UserInterface }
