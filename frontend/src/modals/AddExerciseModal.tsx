import {
  Box,
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
import { useEffect, useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { useToast } from '../hooks/useToast'
import { createExercise } from '../utils/apiEndpoints'

type AddExerciseModalProps = {
  onClose: () => void
  open: boolean
}

type AddExerciseFormValues = {
  muscleGroup: string
  name: string
  preview: FileList
}

function AddExerciseModal({ onClose, open }: AddExerciseModalProps) {
  const { showError, showSuccess } = useToast()
  const [previewUrl, setPreviewUrl] = useState('')
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setError,
    watch,
  } = useForm<AddExerciseFormValues>({
    defaultValues: {
      muscleGroup: '',
      name: '',
    },
  })
  const selectedPreview = watch('preview')

  useEffect(() => {
    const file = selectedPreview?.[0]

    if (!file) {
      setPreviewUrl('')
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [selectedPreview])

  const handleClose = () => {
    reset()
    setPreviewUrl('')
    onClose()
  }

  const onSubmit: SubmitHandler<AddExerciseFormValues> = async (data) => {
    const preview = data.preview?.[0]

    if (!preview) {
      setError('preview', { message: 'Preview image is required' })
      showError('Preview image is required')
      return
    }

    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('muscleGroup', data.muscleGroup)
    formData.append('preview', preview)

    try {
      await createExercise(formData)
      showSuccess('Exercise added to storage')
      handleClose()
    } catch (error) {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined

      setError('root', {
        message: message ?? 'Could not add exercise',
      })
      showError(message ?? 'Could not add exercise')
    }
  }

  return (
    <Dialog fullWidth maxWidth="sm" onClose={handleClose} open={open}>
      <DialogTitle>Add exercise to storage</DialogTitle>
      <Stack component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2.5}>
            {errors.root?.message ? (
              <Typography color="error" role="alert">
                {errors.root.message}
              </Typography>
            ) : null}

            <TextField
              error={Boolean(errors.name)}
              fullWidth
              helperText={errors.name?.message}
              label="Exercise name"
              {...register('name', {
                required: 'Exercise name is required',
              })}
            />

            <TextField
              error={Boolean(errors.muscleGroup)}
              fullWidth
              helperText={errors.muscleGroup?.message}
              label="Muscle group"
              {...register('muscleGroup', {
                required: 'Muscle group is required',
              })}
            />

            <Button component="label" variant="outlined">
              Choose preview image
              <input
                accept="image/*"
                hidden
                type="file"
                {...register('preview', {
                  required: 'Preview image is required',
                })}
              />
            </Button>
            {errors.preview?.message ? (
              <Typography color="error" variant="body2">
                {errors.preview.message}
              </Typography>
            ) : null}

            {previewUrl ? (
              <Box className="image-preview-frame">
                <img alt="Exercise preview" src={previewUrl} />
              </Box>
            ) : null}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button disabled={isSubmitting} type="submit" variant="contained">
            {isSubmitting ? 'Adding...' : 'Add exercise'}
          </Button>
        </DialogActions>
      </Stack>
    </Dialog>
  )
}

export default AddExerciseModal
