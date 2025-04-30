import mongoose, { Document, Model, Schema } from "mongoose";

// Interface for Category document
export interface ICategory extends Document {
    name: string;
    image?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const categorySchema: Schema<ICategory> = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'لطفا نام دسته‌بندی را وارد کنید'],
        unique: true,
        trim: true
    },
    image: {
        type: String,
        // default: 'default-category.jpg'
    },
    isActive: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });

export const CategoriesModel: Model<ICategory> = mongoose.models?.category || mongoose.model<ICategory>('category', categorySchema);