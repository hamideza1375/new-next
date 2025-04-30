import mongoose, { Schema, Model, Document, Types } from 'mongoose';
import { IUser } from '@/models/UsersModel';

interface OrderItem {
  // Define your OrderItem properties here
  _id: Types.ObjectId;
  // ... other fields
}

// Interface for Payment Document
export interface PaymentDocument extends Document {
  representative?: Types.ObjectId;
  version: number;
  price: number;
  title: string;
  authority?: string;
  RefID?: string;
  success: boolean;
  user: Types.ObjectId | IUser;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  product: Types.ObjectId[] | OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}


const PaymentSchema: Schema<PaymentDocument> = new mongoose.Schema({
    representative: { type: mongoose.Schema.Types.ObjectId },
    version: { type: Number, required: true },
    price: { type: Number, required: true },
    title: { type: String, required: true },
    authority: { type: String },
    RefID: { type: String },
    success: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: [{ type: mongoose.Schema.Types.ObjectId, ref: 'product'}],
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    }
}, { timestamps: true });

// Create or retrieve the model
export const PaymentsModel: Model<PaymentDocument> = mongoose.models?.payment || mongoose.model<PaymentDocument>('payment', PaymentSchema);