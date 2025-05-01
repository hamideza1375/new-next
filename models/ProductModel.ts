import mongoose, { Document, Model, Schema, Types } from "mongoose";
import '@/models/UsersModel';
import '@/models/SellerModel';
import { IUser } from "@/models/UsersModel";


export interface IPart extends Document {
    chapter: number;
    title: string;
    video: string;
    product: Types.ObjectId;
    description: string;
    source?: string;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
    isActive?: boolean;
}

const PartSchema: Schema<IPart> = new mongoose.Schema({
    chapter: { type: Number, required: true },
    title: { type: String, required: true },
    video: { type: String, required: true },
    source: { type: String },
    description: {
        type: String,
        required: true
    },
    product: { type: mongoose.Schema.Types.ObjectId },
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
}, { timestamps: true });

//////////////////

export interface IAnswer extends Document {
    username: string;
    message: string;
    to: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const AnswerSchema: Schema<IAnswer> = new mongoose.Schema({
    username: { type: String, required: true },
    message: { type: String, required: true },
    to: { type: String, required: true },
    isActive: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });

////////////////////

export interface IComment extends Document {
    username: string;
    message: string;
    show?: boolean;
    rating: number;
    user: Types.ObjectId | IUser;
    likes: Types.ObjectId[];
    likeCount: number;
    answer?: IAnswer[];
    isActive?: boolean;
}

const CommentSchema: Schema<IComment> = new mongoose.Schema({
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
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likeCount: { type: Number, default: 0 },
    answer: [AnswerSchema],
    isActive: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });

/////////////////////

export interface IProduct extends Document {
    times: number;
    urls?: string;
    version: number;
    progress: number;
    title: string;
    info: string;
    price: number;
    description: string;
    image: string;
    video?: string;
    categoryId: Types.ObjectId;
    popular: boolean;
    offer: {
        exp: number;
        value: number;
    };
    comments: Types.DocumentArray<IComment>;
    parts: Types.DocumentArray<IPart>;
    seller: Types.ObjectId;
    stock: number;
    rating: number;
    ratings: number;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
    isActive: boolean;
    free: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema: Schema<IProduct> = new mongoose.Schema({
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
    comments: [CommentSchema],
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
    free: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

export const ProductsModel: Model<IProduct> = mongoose.models?.product || mongoose.model<IProduct>('product', ProductSchema);