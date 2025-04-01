// appmodel
import mongoose from "mongoose";
import '@/models/UsersModel'

const ProfileSchema = new mongoose.Schema({
    imageUrl: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});


export const ProfileModel = mongoose.models?.profile || mongoose.model('profile', ProfileSchema);
