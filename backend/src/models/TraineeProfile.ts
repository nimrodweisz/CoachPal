import { Schema, model, type InferSchemaType } from 'mongoose'

const traineeProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    coachId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    birthDate: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true,
    },
    goal: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    collection: 'traineeprofiles',
    timestamps: true,
  },
)

export type TraineeProfile = InferSchemaType<typeof traineeProfileSchema>

export default model<TraineeProfile>('TraineeProfile', traineeProfileSchema)
