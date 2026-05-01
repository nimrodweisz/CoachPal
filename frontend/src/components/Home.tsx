import { Box, Button, Container, Paper, Stack, Typography } from '@mui/material'

function Home() {
  const storedUser = localStorage.getItem('coachPalUser')
  const user = storedUser ? JSON.parse(storedUser) : null
  const displayName = user ? `${user.firstName} ${user.lastName}` : 'Coach'

  const handleLogout = () => {
    localStorage.removeItem('coachPalUser')
    window.location.href = '/login'
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
                Home
              </Typography>
              <Typography className="login-copy">
                Welcome, {displayName}.
              </Typography>
            </Box>

            <Button onClick={handleLogout} size="large" variant="contained">
              Log out
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}

export default Home
