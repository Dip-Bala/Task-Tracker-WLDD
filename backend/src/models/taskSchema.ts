import { Schema, model } from "mongoose";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.index({ owner: 1, status: 1 });

const Task = model("task", taskSchema);
export default Task;
