import mongoose, { Schema, Document } from 'mongoose';

// 1. Define the TypeScript Interface (for VS Code autocompletion)
// We extend 'Document' so TypeScript knows this is a Mongoose object
export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string; // We never store raw passwords!
  profilePic?: string; // The '?' means this field is optional
  createdAt: Date;
  updatedAt: Date;
}

// 2. Define the Mongoose Schema (for MongoDB validation rules)
const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,      // Must be provided
      unique: true,        // No two users can have the same username
      trim: true,          // Removes accidental spaces like " Bob " -> "Bob"
      minlength: 3,        // Username must be at least 3 characters
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,     // Automatically converts "Bob@TEST.com" to "bob@test.com"
    },
    passwordHash: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "",         // If no picture is provided, use an empty string
    },
  },
  {
    // 3. Schema Options
    timestamps: true,      // Automatically adds 'createdAt' and 'updatedAt' fields
  }
);

// 4. Create and export the actual Model
// This creates a collection in MongoDB called "users" (Mongoose pluralizes it)
const User = mongoose.model<IUser>('User', userSchema);

export default User;