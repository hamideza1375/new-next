// // appmodel
// import mongoose from "mongoose";
// import '@/models/UsersModel'

// const ProfileSchema = new mongoose.Schema({
//     imageUrl: String,
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
// },{timestamps: true});


// export const ProfileModel = mongoose.models?.profile || mongoose.model('profile', ProfileSchema);



import mongoose, { Schema, Model, Document } from "mongoose";
import { IUser } from '@/models/UsersModel'; // Assuming you have this type

// Interface for Profile document
export interface ProfileDocument extends Document {
    imageUrl: string;
    user: mongoose.Types.ObjectId | IUser;
    createdAt: Date;
    updatedAt: Date;
}

// Interface for Profile model
interface ProfileModel extends Model<ProfileDocument> {}

// Schema definition
const ProfileSchema: Schema = new mongoose.Schema({
    imageUrl: { 
        type: String,
        required: true 
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    }
}, { 
    timestamps: true 
});

// Create or retrieve the model
const ProfileModel: ProfileModel = 
    mongoose.models?.profile as ProfileModel || 
    mongoose.model<ProfileDocument>('profile', ProfileSchema);

export default ProfileModel;