import {
  Box,
  Button,
  Container,
  Link,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import axios from 'axios'
import { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { createCoachProfile, createUser } from '../utils/apiEndpoints'

type SignupFormValues = {
  firstName: string
  lastName: string
  email: string
  password: string
  phone: string
  role: 'Coach' | 'Trainee'
  bio: string
}

function Signup() {
  const [submitError, setSubmitError] = useState('')

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    watch,
  } = useForm<SignupFormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      role: 'Coach',
      bio: '',
    },
  })

  const selectedRole = watch('role')

  const onSubmit: SubmitHandler<SignupFormValues> = async (data) => {
    setSubmitError('')

    try {
      const { bio, ...userPayload } = data
      const user = await createUser(userPayload)

      if (data.role === 'Coach') {
        await createCoachProfile({
          userId: user._id,
          bio,
        })
      }

      window.location.href = '/login'
    } catch (error) {
      if (axios.isAxiosError<{ message?: string }>(error)) {
        console.error(error.response?.data ?? error.message)
        setSubmitError(
          error.response?.data?.message ?? 'Could not create your account',
        )
        return
      }

      console.error(error)
      setSubmitError('Could not create your account')
    }
  }

  return (
    <Box component="main" className="login-page">
      <Container maxWidth="sm">
        <Paper elevation={0} className="login-card">
          <Stack spacing={3}>
            <Box>
              <Typography className="brand-label" component="p">
                CoachPal
              </Typography>
              <Typography variant="h3" component="h1" className="login-title">
                Create account
              </Typography>
              <Typography className="login-copy">
                Set up your coach profile and start managing your clients.
              </Typography>
            </Box>

            <Stack component="form" spacing={2.5} onSubmit={handleSubmit(onSubmit)}>
              {submitError ? (
                <Typography color="error" role="alert">
                  {submitError}
                </Typography>
              ) : null}

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  autoComplete="given-name"
                  error={Boolean(errors.firstName)}
                  fullWidth
                  helperText={errors.firstName?.message}
                  label="First name"
                  {...register('firstName', {
                    required: 'First name is required',
                  })}
                />
                <TextField
                  autoComplete="family-name"
                  error={Boolean(errors.lastName)}
                  fullWidth
                  helperText={errors.lastName?.message}
                  label="Last name"
                  {...register('lastName', {
                    required: 'Last name is required',
                  })}
                />
              </Stack>

              <TextField
                autoComplete="email"
                error={Boolean(errors.email)}
                fullWidth
                helperText={errors.email?.message}
                label="Email"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email address',
                  },
                })}
              />

              <TextField
                autoComplete="tel"
                error={Boolean(errors.phone)}
                fullWidth
                helperText={errors.phone?.message}
                label="Phone"
                {...register('phone', {
                  required: 'Phone is required',
                })}
              />

              <TextField
                fullWidth
                label="Role"
                select
                {...register('role', {
                  required: 'Role is required',
                })}
              >
                <MenuItem value="Coach">Coach</MenuItem>
                <MenuItem value="Trainee">Trainee</MenuItem>
              </TextField>

              {selectedRole === 'Coach' ? (
                <TextField
                  error={Boolean(errors.bio)}
                  fullWidth
                  helperText={errors.bio?.message}
                  label="Bio"
                  minRows={3}
                  multiline
                  {...register('bio', {
                    maxLength: {
                      value: 500,
                      message: 'Bio must be 500 characters or less',
                    },
                  })}
                />
              ) : null}

              <TextField
                autoComplete="new-password"
                error={Boolean(errors.password)}
                fullWidth
                helperText={errors.password?.message}
                label="Password"
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />

              <Button
                disabled={isSubmitting}
                size="large"
                type="submit"
                variant="contained"
              >
                {isSubmitting ? 'Creating account...' : 'Create account'}
              </Button>
            </Stack>

            <Typography className="signup-copy">
              Already have an account?{' '}
              <Link href="/login" underline="hover">
                Sign in
              </Link>
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}

export default Signup
