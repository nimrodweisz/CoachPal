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
  bodyMeasurements: {
    me: '/api/body-measurements/me',
    byTraineeId: (traineeId: string) =>
      `/api/body-measurements/trainee/${traineeId}`,
  },
  exercises: {
    base: '/api/exercises',
    byId: (id: string) => `/api/exercises/${id}`,
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

export type BodyMeasurementResponse = {
  _id: string
  traineeId: string
  coachId: string
  date: string
  measurementDates?: string[]
  height?: number
  weight?: number[]
  bodyFatPercentage?: number[]
  chest?: number[]
  waist?: number[]
  hip?: number[]
  thigh?: number[]
  arm?: number[]
  notes?: string
  createdAt: string
  updatedAt: string
}

export type MyBodyMeasurementsResponse = {
  traineeProfile: TraineeResponse
  measurements: BodyMeasurementResponse | null
}

export type BodyMeasurementUpdatePayload = {
  date: string
  height?: number
  weight?: number
  bodyFatPercentage?: number
  chest?: number
  waist?: number
  hip?: number
  thigh?: number
  arm?: number
  notes?: string
}

export type ExerciseResponse = {
  _id: string
  name: string
  preview: string
  muscleGroup: string
  createdAt: string
  updatedAt: string
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

export const getTraineeById = async (id: string) => {
  const response = await apiClient.get<TraineeResponse>(
    apiEndpoints.trainees.byId(id),
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

export const getMyBodyMeasurements = async () => {
  const response = await apiClient.get<MyBodyMeasurementsResponse>(
    apiEndpoints.bodyMeasurements.me,
  )

  return response.data
}

export const getBodyMeasurementsByTraineeId = async (traineeId: string) => {
  const response = await apiClient.get<{ measurements: BodyMeasurementResponse | null }>(
    apiEndpoints.bodyMeasurements.byTraineeId(traineeId),
  )

  return response.data
}

export const updateBodyMeasurementsByTraineeId = async (
  traineeId: string,
  payload: BodyMeasurementUpdatePayload,
) => {
  const response = await apiClient.patch<BodyMeasurementResponse>(
    apiEndpoints.bodyMeasurements.byTraineeId(traineeId),
    payload,
  )

  return response.data
}

export const createExercise = async (payload: FormData) => {
  const response = await apiClient.post<ExerciseResponse>(
    apiEndpoints.exercises.base,
    payload,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )

  return response.data
}
