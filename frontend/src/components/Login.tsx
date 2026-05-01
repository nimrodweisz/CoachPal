import {
  Box,
  Button,
  Container,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { useToast } from '../hooks/useToast'
import { loginUser } from '../utils/apiEndpoints'

type LoginFormValues = {
  email: string
  password: string
}

function Login() {
  const { showError, showSuccess } = useToast()

  useEffect(() => {
    localStorage.clear()
  }, [])
  const [submitError, setSubmitError] = useState('')

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setSubmitError('')

    try {
      const response = await loginUser(data)
      localStorage.setItem('jwt', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      showSuccess('Signed in successfully')
      window.location.href = '/home'
    } catch (error) {
      if (axios.isAxiosError<{ message?: string }>(error)) {
        const message = error.response?.data?.message ?? 'Could not sign in'
        setSubmitError(message)
        showError(message)
        return
      }

      setSubmitError('Could not sign in')
      showError('Could not sign in')
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
                Welcome back
              </Typography>
              <Typography className="login-copy">
                Sign in to manage your coaching sessions, clients, and progress.
              </Typography>
            </Box>

            <Stack component="form" spacing={2.5} onSubmit={handleSubmit(onSubmit)}>
              {submitError ? (
                <Typography color="error" role="alert">
                  {submitError}
                </Typography>
              ) : null}

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
                autoComplete="current-password"
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

              <Box className="login-options">
                <Link href="#" underline="hover">
                  Forgot password?
                </Link>
              </Box>

              <Button
                disabled={isSubmitting}
                size="large"
                type="submit"
                variant="contained"
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </Button>
            </Stack>

            <Typography className="signup-copy">
              New to CoachPal?{' '}
              <Link href="/signup" underline="hover">
                Create an account
              </Link>
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}

export default Login
