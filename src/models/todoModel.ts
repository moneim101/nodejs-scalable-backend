import mongoose, { Schema, type InferSchemaType } from "mongoose"
import { Status } from "../types/variables.js";

const todoSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: Status.NOT_STARTED,
      enum: Object.values(Status),
    },
  },
  {
    timestamps: true,
  }
)

// types
export type Todo = InferSchemaType<typeof todoSchema>

const Todo = mongoose.model<Todo>("Todo", todoSchema);

export default Todo
