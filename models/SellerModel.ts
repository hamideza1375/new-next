import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { IUser } from "@/models/UsersModel";
import { IProduct } from "@/models/ProductModel";

export interface ISeller extends Document {
    brand: string;
	user: Types.ObjectId | IUser;
    phone: string;
    isActive: boolean;
    password: string;
    address: string;
    city: string;
    postalCode: string;
    creditCard: number;
    description?: string;
    logo?: string;
    products: Types.ObjectId[] | IProduct[];
    rating: number;
    salesCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const sellerSchema: Schema<ISeller> = new mongoose.Schema({
    brand: {
        type: String,
        required: true,
        minlength: 2
    },
	 	 user: { 
				type: mongoose.Schema.Types.ObjectId, 
				ref: 'User' 
		  },
    phone: {
        type: String,
        required: true,
        minlength: 11,
        maxlength: 11,
        unique: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 10
    },
    creditCard: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    description: {
        type: String,
        maxlength: 500
    },
    logo: {
        type: String, // URL لوگو
        // default: 'default-logo-url.png'
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    salesCount: {
        type: Number,
        default: 0
    },
}, { timestamps: true });

export const SellerModel: Model<ISeller> = mongoose.models?.Seller || mongoose.model<ISeller>('Seller', sellerSchema);