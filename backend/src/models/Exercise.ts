import { Schema, model, type InferSchemaType } from 'mongoose'

const exerciseSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    preview: {
      type: String,
      required: true,
      trim: true,
    },
    muscleGroup: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    collection: 'exercises',
    timestamps: true,
  },
)

export type Exercise = InferSchemaType<typeof exerciseSchema>

export default model<Exercise>('Exercise', exerciseSchema)
