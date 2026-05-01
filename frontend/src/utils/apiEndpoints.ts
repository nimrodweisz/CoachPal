import axios from 'axios'

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      window.location.pathname !== '/login'
    ) {
      window.location.href = '/login'
    }

    return Promise.reject(error)
  },
)

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
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
  trainees: {
    base: '/api/trainees',
    byId: (id: string) => `/api/trainees/${id}`,
  },
} as const

export type CreateUserPayload = {
  firstName: string
  lastName: string
  email: string
  password: string
  phone: string
  role: 'Coach' | 'Trainee'
}

export type UserResponse = CreateUserPayload & {
  _id: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type LoginPayload = {
  email: string
  password: string
}

export type LoginResponse = {
  token: string
  user: Omit<UserResponse, 'password'>
}

export type CreateCoachProfilePayload = {
  userId: string
  bio: string
}

export type TraineeResponse = {
  _id: string
  traineeEmail: string
  userId?: {
    _id: string
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  coachId: string
  birthDate: string
  gender: 'Male' | 'Female' | 'Other'
  goal: string
  status: 'Active' | 'Inactive'
  startDate: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export type CreateTraineePayload = {
  email: string
  birthDate: string
  gender: 'Male' | 'Female' | 'Other'
  goal: string
  status: 'Active' | 'Inactive'
  startDate: string
  notes?: string
}

export const loginUser = async (payload: LoginPayload) => {
  const response = await apiClient.post<LoginResponse>(
    apiEndpoints.auth.login,
    payload,
  )

  return response.data
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

export const getTrainees = async () => {
  const response = await apiClient.get<TraineeResponse[]>(
    apiEndpoints.trainees.base,
  )

  return response.data
}

export const createTrainee = async (payload: CreateTraineePayload) => {
  const response = await apiClient.post<TraineeResponse>(
    apiEndpoints.trainees.base,
    payload,
  )

  return response.data
}
