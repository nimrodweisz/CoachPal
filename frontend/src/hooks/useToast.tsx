import {
  Alert,
  Snackbar,
  type AlertColor,
} from '@mui/material'
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type ToastState = {
  message: string
  severity: AlertColor
}

type ToastContextValue = {
  showError: (message: string) => void
  showSuccess: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null)

  const value = useMemo<ToastContextValue>(
    () => ({
      showError: (message) => {
        setToast({ message, severity: 'error' })
      },
      showSuccess: (message) => {
        setToast({ message, severity: 'success' })
      },
    }),
    [],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Snackbar
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        autoHideDuration={4000}
        onClose={() => setToast(null)}
        open={Boolean(toast)}
      >
        <Alert
          onClose={() => setToast(null)}
          severity={toast?.severity ?? 'success'}
          variant="filled"
        >
          {toast?.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used inside ToastProvider')
  }

  return context
}
