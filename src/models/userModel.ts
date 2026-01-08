import mongoose, { Model, Schema, type HydratedDocument, type InferSchemaType } from "mongoose";
import bcrypt from "bcryptjs";

interface UserMethods {
  matchPassword(enteredPassword: string): Promise<boolean> 
}

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
)

// methods
userSchema.methods.matchPassword = async function (this: UserDocument, enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre<UserDocument>("save", async function (next) {

  if (!this.isModified("password")) {
    return next()
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
})

// types
export type User = InferSchemaType<typeof userSchema>
export type UserDocument = HydratedDocument<User>

const User = mongoose.model<User, Model<User, {}, UserMethods>>("User", userSchema)

export default User
