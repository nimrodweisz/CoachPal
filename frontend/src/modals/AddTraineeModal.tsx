import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import axios from 'axios'
import { useForm, type SubmitHandler } from 'react-hook-form'
import {
  createTrainee,
  type CreateTraineePayload,
  type TraineeResponse,
} from '../utils/apiEndpoints'

type AddTraineeModalProps = {
  onClose: () => void
  onCreated: (trainee: TraineeResponse) => void
  open: boolean
}

function AddTraineeModal({ onClose, onCreated, open }: AddTraineeModalProps) {
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<CreateTraineePayload>({
    defaultValues: {
      email: '',
      birthDate: '',
      gender: 'Male',
      goal: '',
      status: 'Active',
      startDate: new Date().toISOString().slice(0, 10),
      notes: '',
    },
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit: SubmitHandler<CreateTraineePayload> = async (data) => {
    try {
      const trainee = await createTrainee(data)
      onCreated(trainee)
      handleClose()
    } catch (error) {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined

      setError('root', {
        message: message ?? 'Could not create trainee',
      })
    }
  }

  return (
    <Dialog fullWidth maxWidth="sm" onClose={handleClose} open={open}>
      <DialogTitle>Add trainee</DialogTitle>
      <Stack component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2.5}>
            {errors.root?.message ? (
              <Typography color="error" role="alert">
                {errors.root.message}
              </Typography>
            ) : null}

            <TextField
              autoComplete="email"
              error={Boolean(errors.email)}
              fullWidth
              helperText={errors.email?.message}
              label="Trainee email"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter a valid email address',
                },
              })}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                error={Boolean(errors.birthDate)}
                fullWidth
                helperText={errors.birthDate?.message}
                label="Birth date"
                slotProps={{ inputLabel: { shrink: true } }}
                type="date"
                {...register('birthDate', {
                  required: 'Birth date is required',
                })}
              />
              <TextField
                error={Boolean(errors.startDate)}
                fullWidth
                helperText={errors.startDate?.message}
                label="Start date"
                slotProps={{ inputLabel: { shrink: true } }}
                type="date"
                {...register('startDate', {
                  required: 'Start date is required',
                })}
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                error={Boolean(errors.gender)}
                fullWidth
                helperText={errors.gender?.message}
                label="Gender"
                select
                {...register('gender', {
                  required: 'Gender is required',
                })}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
              <TextField
                error={Boolean(errors.status)}
                fullWidth
                helperText={errors.status?.message}
                label="Status"
                select
                {...register('status', {
                  required: 'Status is required',
                })}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </TextField>
            </Stack>

            <TextField
              error={Boolean(errors.goal)}
              fullWidth
              helperText={errors.goal?.message}
              label="Goal"
              {...register('goal', {
                required: 'Goal is required',
              })}
            />

            <TextField
              fullWidth
              label="Notes"
              minRows={3}
              multiline
              {...register('notes')}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button disabled={isSubmitting} type="submit" variant="contained">
            {isSubmitting ? 'Adding...' : 'Add trainee'}
          </Button>
        </DialogActions>
      </Stack>
    </Dialog>
  )
}

export default AddTraineeModal
