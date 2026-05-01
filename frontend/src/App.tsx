import { useEffect } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import TraineeDetails from './components/TraineeDetails'
import { ToastProvider } from './hooks/useToast'

function UnauthorizedRedirectHandler() {
  const navigate = useNavigate()

  useEffect(() => {
    const originalFetch = window.fetch

    window.fetch = async (...args) => {
      const response = await originalFetch(...args)

      if (response.status === 401 && window.location.pathname !== '/login') {
        navigate('/login', { replace: true })
      }

      return response
    }

    return () => {
      window.fetch = originalFetch
    }
  }, [navigate])

  return null
}

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <UnauthorizedRedirectHandler />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/trainee/:id" element={<TraineeDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
