import { Schema, model, type InferSchemaType } from 'mongoose'

const numberProgressionField = {
  type: [Number],
  default: undefined,
}

const bodyMeasurementSchema = new Schema(
  {
    traineeId: {
      type: Schema.Types.ObjectId,
      ref: 'TraineeProfile',
      required: true,
    },
    coachId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    height: {
      type: Number,
    },
    weight: numberProgressionField,
    bodyFatPercentage: numberProgressionField,
    chest: numberProgressionField,
    waist: numberProgressionField,
    hip: numberProgressionField,
    thigh: numberProgressionField,
    arm: numberProgressionField,
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    collection: 'bodymeasurements',
    timestamps: true,
  },
)

export type BodyMeasurement = InferSchemaType<typeof bodyMeasurementSchema>

export default model<BodyMeasurement>('BodyMeasurement', bodyMeasurementSchema)
