import { Document, Schema, model, models } from 'mongoose';

// Define the schema for the main entity (e.g., a user)
export interface IUser extends Document {
    clerkId: string;
    name: string;
    username?: string;
    email: string;
    password?: string;
    portfolioLink?: string;
    picture: string;
    location?: string;
    bio?: string;
    reputation?: number;
    saved: Schema.Types.ObjectId[];
    createdAt: Date;
}

// Define the Mongoose schema for the main entity
const UserSchema: Schema = new Schema({
    clerkId: { type: String, required: true },
    name: { type: String, required: true },
    username: { type: String, required: true ,unique:true},
    email: { type: String, required: true,unique:true },
    password: { type: String  },
    portfolioLink: { type: String, default: '' },
    picture: { type: String, default: '' },
    location: { type: String, default: '' },
    bio: { type: String, default: '' },
    reputation: { type: Number, default: 0 },
    saved: [{ type: Schema.Types.ObjectId, ref: 'Question' }], // Assuming 'Question' is the model name for questions
    createdAt: { type: Date, default: Date.now }
});

// Define and export the Mongoose model
const User = models.User || model<IUser>('User', UserSchema);

export default User;
