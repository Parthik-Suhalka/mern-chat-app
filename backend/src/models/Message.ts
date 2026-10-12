import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMessage extends Document {
  senderId: Types.ObjectId; // Links to the User who sent it
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Tells Mongoose this ID belongs to the 'User' collection
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model<IMessage>('Message', messageSchema);

export default Message;