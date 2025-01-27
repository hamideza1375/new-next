import mongoose from "mongoose";
import '@/models/UserModel';

const PartSchema = new mongoose.Schema({
    chapter: { type: Number, required: true },
    title: { type: String, required: true },
    video: { type: String, required: true },
    source: { type: String },
    description: {
        type: String,
        required: true
    },
    productId: { type: mongoose.Schema.Types.ObjectId },
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

const CommenteSchema = new mongoose.Schema({
    username: { type: String, required: true },
    message: { type: String, required: [true, 'پیام شما نباید خالی باشد'] },
    show: { type: Boolean, default: false },
    star: { type: Number, require: true },
    answer: [AnswerModel],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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
        // validate: {
        //     validator: function (v) {
        //         // بررسی کنید که آیا مقدار رشته می‌تواند به عدد تبدیل شود
        //         return !isNaN(Number(v.replace(/,/g, ''))); // حذف کاماها و بررسی عددی بودن
        //     },
        //     message: props => `${props.value} یک قیمت معتبر نیست!`
        // }
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
        default: 0,
        min: 0,
        max: 5
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

// ProductsSchema.set('strictPopulate', false);

export const ProductsModel = mongoose.models.product || mongoose.model('product', ProductsSchema);
export const ObjectId = mongoose.Types.ObjectId;

// Embedded Document

// Reference: در این روش، به جای قرار دادن یک سند شاخص درون سند دیگر، از مقدار منحصر به فرد یک فیلد در سند دیگر استفاده می‌شود که به یک مدل دیگر اشاره دارد. این روش به منظور کاهش تکرار اطلاعات و افزایش سرعت دسترسی به اطلاعات استفاده می‌شود.
// Populate: وقتی از روش Reference استفاده می‌شود، می‌توان با استفاده از متد populate() اطلاعات مربوط به مدل مرتبط را بازیابی کرد. این کار باعث ایجاد ارتباطات بین مدل‌ها در Mongoose می‌شود.
// Virtuals: این نوع از فیلدها در Mongoose هستند که اطلاعاتی را محاسبه یا تبدیل می‌کنند ولی در ساختار اصلی سند ذخیره نمی‌شوند. این فیلدها می‌توانند بر اساس داده‌های دیگر در سند یا از مدل‌های دیگر محاسبه شوند.
