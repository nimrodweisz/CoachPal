import { Schema, model, type InferSchemaType } from 'mongoose'

const coachProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    bio: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    collection: 'coachprofiles',
    timestamps: true,
  },
)

export type CoachProfile = InferSchemaType<typeof coachProfileSchema>

export default model<CoachProfile>('CoachProfile', coachProfileSchema)
