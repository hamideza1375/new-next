// appmodel
import mongoose from "mongoose";
import '@/models/UserModel'

const ProfileSchema = new mongoose.Schema({
    imageUrl: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});


export const ProfileModel = mongoose.models?.profile || mongoose.model('profile', ProfileSchema);
