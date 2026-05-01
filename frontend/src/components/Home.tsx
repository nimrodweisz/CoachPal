import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import AddTraineeModal from '../modals/AddTraineeModal'
import { getTrainees, type TraineeResponse } from '../utils/apiEndpoints'

function Home() {
  const storedUser = localStorage.getItem('user')
  const user = storedUser ? JSON.parse(storedUser) : null
  const displayName = user ? `${user.firstName} ${user.lastName}` : 'Coach'
  const [trainees, setTrainees] = useState<TraineeResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const loadTrainees = async () => {
    try {
      const data = await getTrainees()
      setTrainees(data)
    } catch {
      setError('Could not load trainees')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadTrainees()
  }, [])

  const handleOpenCreate = () => {
    setIsCreateOpen(true)
  }

  const handleCloseCreate = () => {
    setIsCreateOpen(false)
  }

  const handleTraineeCreated = (trainee: TraineeResponse) => {
    setTrainees((currentTrainees) => [trainee, ...currentTrainees])
  }

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
                  Trainees
                </Typography>
                <Typography className="login-copy">
                  Welcome, {displayName}.
                </Typography>
              </Box>

              <Stack direction="row" spacing={1.5}>
                <Button onClick={handleOpenCreate} size="large" variant="contained">
                  Add trainee
                </Button>
                <Button onClick={handleLogout} size="large" variant="outlined">
                  Log out
                </Button>
              </Stack>
            </Box>

            {error ? (
              <Typography color="error" role="alert">
                {error}
              </Typography>
            ) : null}

            <TableContainer>
              <Table aria-label="trainees table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Goal</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Start date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6}>Loading trainees...</TableCell>
                    </TableRow>
                  ) : null}

                  {!isLoading && trainees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6}>No trainees yet.</TableCell>
                    </TableRow>
                  ) : null}

                  {trainees.map((trainee) => (
                    <TableRow hover key={trainee._id}>
                      <TableCell>
                        {trainee.userId
                          ? `${trainee.userId.firstName} ${trainee.userId.lastName}`
                          : 'Pending signup'}
                      </TableCell>
                      <TableCell>
                        {trainee.userId?.email ?? trainee.traineeEmail}
                      </TableCell>
                      <TableCell>{trainee.userId?.phone ?? '-'}</TableCell>
                      <TableCell>{trainee.goal}</TableCell>
                      <TableCell>
                        <Chip
                          color={
                            trainee.status === 'Active' ? 'success' : 'default'
                          }
                          label={trainee.status}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(trainee.startDate).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </Paper>
      </Container>

      <AddTraineeModal
        onClose={handleCloseCreate}
        onCreated={handleTraineeCreated}
        open={isCreateOpen}
      />
    </Box>
  )
}

export default Home
