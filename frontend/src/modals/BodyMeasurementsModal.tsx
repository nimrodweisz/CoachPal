import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import axios from 'axios'
import { useForm, type SubmitHandler } from 'react-hook-form'
import {
  updateBodyMeasurementsByTraineeId,
  type BodyMeasurementResponse,
  type BodyMeasurementUpdatePayload,
} from '../utils/apiEndpoints'
import { useToast } from '../hooks/useToast'

type BodyMeasurementsModalProps = {
  onClose: () => void
  onSaved: (measurements: BodyMeasurementResponse) => void
  open: boolean
  traineeId: string
}

type BodyMeasurementsFormValues = {
  date: string
  height: string
  weight: string
  bodyFatPercentage: string
  chest: string
  waist: string
  hip: string
  thigh: string
  arm: string
  notes: string
}

const toOptionalNumber = (value: string) =>
  value.trim() === '' ? undefined : Number(value)

function BodyMeasurementsModal({
  onClose,
  onSaved,
  open,
  traineeId,
}: BodyMeasurementsModalProps) {
  const { showError, showSuccess } = useToast()
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<BodyMeasurementsFormValues>({
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      height: '',
      weight: '',
      bodyFatPercentage: '',
      chest: '',
      waist: '',
      hip: '',
      thigh: '',
      arm: '',
      notes: '',
    },
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit: SubmitHandler<BodyMeasurementsFormValues> = async (data) => {
    const payload: BodyMeasurementUpdatePayload = {
      date: data.date,
      height: toOptionalNumber(data.height),
      weight: toOptionalNumber(data.weight),
      bodyFatPercentage: toOptionalNumber(data.bodyFatPercentage),
      chest: toOptionalNumber(data.chest),
      waist: toOptionalNumber(data.waist),
      hip: toOptionalNumber(data.hip),
      thigh: toOptionalNumber(data.thigh),
      arm: toOptionalNumber(data.arm),
      notes: data.notes,
    }

    try {
      const measurements = await updateBodyMeasurementsByTraineeId(
        traineeId,
        payload,
      )
      onSaved(measurements)
      showSuccess('Measurements saved')
      handleClose()
    } catch (error) {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined

      setError('root', {
        message: message ?? 'Could not save measurements',
      })
      showError(message ?? 'Could not save measurements')
    }
  }

  return (
    <Dialog fullWidth maxWidth="sm" onClose={handleClose} open={open}>
      <DialogTitle>Update body measurements</DialogTitle>
      <Stack component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2.5}>
            {errors.root?.message ? (
              <Typography color="error" role="alert">
                {errors.root.message}
              </Typography>
            ) : null}

            <TextField
              error={Boolean(errors.date)}
              fullWidth
              helperText={errors.date?.message}
              label="Date"
              slotProps={{ inputLabel: { shrink: true } }}
              type="date"
              {...register('date', {
                required: 'Date is required',
              })}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField fullWidth label="Height" type="number" {...register('height')} />
              <TextField fullWidth label="Weight" type="number" {...register('weight')} />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="Body fat %"
                type="number"
                {...register('bodyFatPercentage')}
              />
              <TextField fullWidth label="Chest" type="number" {...register('chest')} />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField fullWidth label="Waist" type="number" {...register('waist')} />
              <TextField fullWidth label="Hip" type="number" {...register('hip')} />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField fullWidth label="Thigh" type="number" {...register('thigh')} />
              <TextField fullWidth label="Arm" type="number" {...register('arm')} />
            </Stack>

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
            {isSubmitting ? 'Saving...' : 'Save measurements'}
          </Button>
        </DialogActions>
      </Stack>
    </Dialog>
  )
}

export default BodyMeasurementsModal
