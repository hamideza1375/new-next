import mongoose from "mongoose";
import '@/models/UsersModel';
import '@/models/SellerModel';

const PartSchema = new mongoose.Schema({
    chapter: { type: Number, required: true },
    title: { type: String, required: true },
    video: { type: String, required: true },
    source: { type: String },
    description: {
        type: String,
        required: true
    },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
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
    },
    isActive: {
        type: Boolean,
        default: true
    }
},{ timestamps: true });

//////////////////

const AnswerModel = new mongoose.Schema({
    username: { type: String, required: true },
    message: { type: String, required: true },
    to: { type: String, required: true },
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
    }
},{ timestamps: true });

////////////////////

const CommenteSchema = new mongoose.Schema({
    username: { type: String, required: true },
    message: { type: String, required: [true, 'پیام شما نباید خالی باشد'] },
    show: { type: Boolean, default: false },
    rating: {
      type: Number,
      default: 1,
      min: 0,
      max: 5
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    likes: { type: Number, default: 0 }, // تعداد لایک‌ها
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // کاربرانی که لایک کرده‌اند
    answer: [AnswerModel],
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
    }
  }, { timestamps: true });

/////////////////////

const ProductsSchema = new mongoose.Schema({
    times: { type: Number, default: 0 },
    urls: String,
    version: { type: Number, default: 1 },
    progress: { type: Number, default: 0 },
    title: { type: String, required: [true, 'عنوان محصول اجباری است'] },
    info: { type: String, required: [true, 'اطلاعات محصول اجباری است'] },
    price: {
        type: Number,
        min: [1000, 'قیمت نباید کوچکتر از ۱۰۰۰ باشد'],
        cast: 'قیمت را به عدد وارد کنید',
        required: [true, 'قیمت گذاری اجباری است']
    },
    description: { type: String, required: [true, 'توضیحات محصول اجباری است'] },
    image: {
        type: String,
        required: true
    },
    video: String,
    categoryId: { type: mongoose.Schema.Types.ObjectId, required: [true, 'شناسه ی دسته ی محصول را وارد کنید'] },
    popular: { type: Boolean, default: false },
    offer: { type: Object, default: { exp: 0, value: 0 } },

    comments: [CommenteSchema],
    parts: [PartSchema],
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true
    },
    stock: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 1,
        min: 0,
        max: 5
    },
    ratings: {
        type: Number,
        default: 1,
    },
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
    }
}, { timestamps: true });


export const ProductsModel = mongoose.models.product || mongoose.model('product', ProductsSchema);
export const ObjectId = mongoose.Types.ObjectId;
