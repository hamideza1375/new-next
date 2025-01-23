import mongoose from 'mongoose';
import '@/models/UserModel'

const PaymentSchema = new mongoose.Schema({
    representative: { type: mongoose.Schema.Types.ObjectId },
    version: { type: Number, require: true },
    price: { type: Number, require: true },
    title: { type: String, require: true },
    authority: { type: String },
    RefID: { type: String },
    success: { type: Boolean, default: false },
    productId: { type: mongoose.Schema.Types.ObjectId },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem'
    }]
});

export const PaymentsModel = mongoose.models.payment || mongoose.model('payment', PaymentSchema);