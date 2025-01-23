import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
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
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    // متادیتا برای SEO
    metaTitle: {
        type: String,
        trim: true
    },
    metaDescription: {
        type: String,
        trim: true
    },
    metaKeywords: {
        type: [String]
    }
},{timeStamp:true});

export const CategoriesModel = mongoose.models.category || mongoose.model('category', categorySchema);
