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
import { useForm, type SubmitHandler } from 'react-hook-form'

type LoginFormValues = {
  email: string
  password: string
}

function Login() {
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

  const onSubmit: SubmitHandler<LoginFormValues> = (data) => {
    console.log(data)
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
