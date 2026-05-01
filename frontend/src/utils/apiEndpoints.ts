import axios from 'axios'

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const apiEndpoints = {
  auth: {
    login: '/api/auth/login',
    signup: '/api/auth/signup',
  },
  users: {
    base: '/api/users',
    byId: (id: string) => `/api/users/${id}`,
  },
  coachProfiles: {
    base: '/api/coach-profiles',
    byId: (id: string) => `/api/coach-profiles/${id}`,
  },
} as const

export type CreateUserPayload = {
  firstName: string
  lastName: string
  email: string
  password: string
  phone: string
  role: 'Coach'
}

export type UserResponse = CreateUserPayload & {
  _id: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type CreateCoachProfilePayload = {
  userId: string
  bio: string
}

export const createUser = async (payload: CreateUserPayload) => {
  const response = await apiClient.post<UserResponse>(
    apiEndpoints.users.base,
    payload,
  )

  return response.data
}

export const createCoachProfile = async (
  payload: CreateCoachProfilePayload,
) => {
  const response = await apiClient.post(
    apiEndpoints.coachProfiles.base,
    payload,
  )

  return response.data
}
