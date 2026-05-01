import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import BodyMeasurementsModal from '../modals/BodyMeasurementsModal'
import {
  getBodyMeasurementsByTraineeId,
  getTraineeById,
  type BodyMeasurementResponse,
  type TraineeResponse,
} from '../utils/apiEndpoints'

function TraineeDetails() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [trainee, setTrainee] = useState<TraineeResponse | null>(null)
  const [measurements, setMeasurements] =
    useState<BodyMeasurementResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isMeasurementsOpen, setIsMeasurementsOpen] = useState(false)

  useEffect(() => {
    const loadTrainee = async () => {
      if (!id) {
        setError('Missing trainee id')
        setIsLoading(false)
        return
      }

      try {
        const [traineeData, measurementData] = await Promise.all([
          getTraineeById(id),
          getBodyMeasurementsByTraineeId(id),
        ])
        setTrainee(traineeData)
        setMeasurements(measurementData.measurements)
      } catch {
        setError('Could not load trainee')
      } finally {
        setIsLoading(false)
      }
    }

    void loadTrainee()
  }, [id])

  const name = trainee?.userId
    ? `${trainee.userId.firstName} ${trainee.userId.lastName}`
    : 'Pending signup'
  const latestWeight = measurements?.weight?.at(-1)
  const latestBodyFat = measurements?.bodyFatPercentage?.at(-1)

  return (
    <Box component="main" className="home-page">
      <Container maxWidth="md">
        <Paper elevation={0} className="home-panel">
          <Stack spacing={3}>
            <Box className="home-header">
              <Box>
                <Typography className="brand-label" component="p">
                  CoachPal
                </Typography>
                <Typography variant="h4" component="h1" className="home-title">
                  {isLoading ? 'Loading trainee...' : name}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1.5}>
                <Button
                  onClick={() => setIsMeasurementsOpen(true)}
                  variant="contained"
                >
                  Update measurements
                </Button>
                <Button onClick={() => navigate('/home')} variant="outlined">
                  Back
                </Button>
              </Stack>
            </Box>

            {error ? (
              <Typography color="error" role="alert">
                {error}
              </Typography>
            ) : null}

            {trainee ? (
              <Stack spacing={1.5}>
                <Typography>Email: {trainee.userId?.email ?? trainee.traineeEmail}</Typography>
                <Typography>Phone: {trainee.userId?.phone ?? '-'}</Typography>
                <Typography>Goal: {trainee.goal}</Typography>
                <Typography>
                  Start date: {new Date(trainee.startDate).toLocaleDateString()}
                </Typography>
                <Typography>Height: {measurements?.height ?? '-'}</Typography>
                <Typography>Latest weight: {latestWeight ?? '-'}</Typography>
                <Typography>Latest body fat: {latestBodyFat ?? '-'}</Typography>
                <Box>
                  <Chip
                    color={trainee.status === 'Active' ? 'success' : 'default'}
                    label={trainee.status}
                    size="small"
                  />
                </Box>
              </Stack>
            ) : null}
          </Stack>
        </Paper>
      </Container>

      {id ? (
        <BodyMeasurementsModal
          onClose={() => setIsMeasurementsOpen(false)}
          onSaved={setMeasurements}
          open={isMeasurementsOpen}
          traineeId={id}
        />
      ) : null}
    </Box>
  )
}

export default TraineeDetails
