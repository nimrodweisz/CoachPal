import { useEffect, useState } from 'react'
import { Box, Button, Container, Paper, Stack, Typography } from '@mui/material'
import ProgressCharts from './ProgressCharts'
import {
  getMyBodyMeasurements,
  type BodyMeasurementResponse,
} from '../utils/apiEndpoints'

function TraineeHome() {
  const storedUser = localStorage.getItem('user')
  const user = storedUser ? JSON.parse(storedUser) : null
  const displayName = user ? `${user.firstName} ${user.lastName}` : 'Trainee'
  const [measurements, setMeasurements] = useState<BodyMeasurementResponse | null>(
    null,
  )
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadMeasurements = async () => {
      try {
        const data = await getMyBodyMeasurements()
        setMeasurements(data.measurements)
      } catch {
        setError('Could not load your progress')
      } finally {
        setIsLoading(false)
      }
    }

    void loadMeasurements()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('jwt')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  return (
    <Box component="main" className="home-page">
      <Container maxWidth="lg">
        <Paper elevation={0} className="home-panel">
          <Stack spacing={3}>
            <Box className="home-header">
              <Box>
                <Typography className="brand-label" component="p">
                  CoachPal
                </Typography>
                <Typography variant="h4" component="h1" className="home-title">
                  Progress
                </Typography>
                <Typography className="login-copy">
                  Welcome, {displayName}.
                </Typography>
              </Box>

              <Button onClick={handleLogout} size="large" variant="outlined">
                Log out
              </Button>
            </Box>

            {error ? (
              <Typography color="error" role="alert">
                {error}
              </Typography>
            ) : null}

            {isLoading ? <Typography>Loading progress...</Typography> : null}

            {!isLoading ? (
              <ProgressCharts
                emptyCopy="Your measurements will appear here after your coach adds them."
                measurements={measurements}
              />
            ) : null}
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}

export default TraineeHome
