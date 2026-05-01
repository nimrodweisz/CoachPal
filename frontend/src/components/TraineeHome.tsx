import { useEffect, useState } from 'react'
import { Box, Button, Container, Paper, Stack, Typography } from '@mui/material'
import {
  getMyBodyMeasurements,
  type BodyMeasurementResponse,
} from '../utils/apiEndpoints'

type MeasurementMetric = {
  key: keyof Pick<
    BodyMeasurementResponse,
    'weight' | 'bodyFatPercentage' | 'chest' | 'waist' | 'hip' | 'thigh' | 'arm'
  >
  label: string
  unit: string
}

const metrics: MeasurementMetric[] = [
  { key: 'weight', label: 'Weight', unit: 'kg' },
  { key: 'bodyFatPercentage', label: 'Body fat', unit: '%' },
  { key: 'chest', label: 'Chest', unit: 'cm' },
  { key: 'waist', label: 'Waist', unit: 'cm' },
  { key: 'hip', label: 'Hip', unit: 'cm' },
  { key: 'thigh', label: 'Thigh', unit: 'cm' },
  { key: 'arm', label: 'Arm', unit: 'cm' },
]

type ProgressChartProps = {
  label: string
  unit: string
  values: number[]
}

function ProgressChart({ label, unit, values }: ProgressChartProps) {
  const width = 420
  const height = 180
  const padding = 28
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const points = values.map((value, index) => {
    const x =
      values.length === 1
        ? width / 2
        : padding + (index / (values.length - 1)) * (width - padding * 2)
    const y = height - padding - ((value - min) / range) * (height - padding * 2)

    return { value, x, y }
  })
  const path = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ')

  return (
    <Paper elevation={0} className="chart-card">
      <Stack spacing={1.5}>
        <Box>
          <Typography className="chart-title">{label}</Typography>
          <Typography className="chart-value">
            {values.at(-1)} {unit}
          </Typography>
        </Box>

        <svg
          className="progress-chart"
          role="img"
          viewBox={`0 0 ${width} ${height}`}
        >
          <line
            className="chart-axis"
            x1={padding}
            x2={width - padding}
            y1={height - padding}
            y2={height - padding}
          />
          <path className="chart-line" d={path} />
          {points.map((point, index) => (
            <circle
              className="chart-point"
              cx={point.x}
              cy={point.y}
              key={`${label}-${index}`}
              r="4"
            />
          ))}
        </svg>
      </Stack>
    </Paper>
  )
}

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

  const availableMetrics = metrics
    .map((metric) => ({
      ...metric,
      values: measurements?.[metric.key] ?? [],
    }))
    .filter((metric) => metric.values.length > 0)

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

            {!isLoading && availableMetrics.length === 0 ? (
              <Paper elevation={0} className="empty-state">
                <Typography className="chart-title">No progress data yet</Typography>
                <Typography className="login-copy">
                  Your measurements will appear here after your coach adds them.
                </Typography>
              </Paper>
            ) : null}

            {availableMetrics.length > 0 ? (
              <Box className="chart-grid">
                {availableMetrics.map((metric) => (
                  <ProgressChart
                    key={metric.key}
                    label={metric.label}
                    unit={metric.unit}
                    values={metric.values}
                  />
                ))}
              </Box>
            ) : null}
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}

export default TraineeHome
