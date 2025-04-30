import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { IUser } from "@/models/UsersModel";
import { boolean } from "yup";

export interface IAnswerTicket extends Document {
    message?: string;
    imageUrl?: string;
    userId?: Types.ObjectId;
    seenDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

const AnswerTicketSchema: Schema<IAnswerTicket> = new mongoose.Schema({
    message: { type: String },
    imageUrl: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId },
    seenDate: { type: Date, default: Date.now() },
}, { timestamps: true });

export type TicketCategory = 'Technical' | 'Reversal' | 'Other';
export type TicketStatus = 'Open' | 'examination' | 'Closed';
export type TicketPriority = 'Low' | 'Medium' | 'high ';

export interface ITicket extends Document {
    title: string;
    message?: string;
    image?: string;
    answer?: Types.DocumentArray<IAnswerTicket>;
    user: Types.ObjectId | IUser;
    userSeen: boolean;
    adminSeen: boolean;
    category: TicketCategory;
    status: TicketStatus;
    priority: TicketPriority;
    closedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const TicketSchema: Schema<ITicket> = new mongoose.Schema({
    title: { 
        type: String, 
        required: true, 
        minlength: 1 
    },
    message: { 
        type: String,
        // required: true, 
        // minlength: 1 
    },
    image: { 
        type: String 
    },
    answer: { 
        type: [AnswerTicketSchema],
        default: [] 
      },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    userSeen: { 
        type: Boolean, 
        default: false
    },
    adminSeen: { 
        type: Boolean, 
        default: false
    },
    category: {
        type: String,
        required: [true, 'لطفا دسته‌بندی تیکت را انتخاب کنید'],
        enum: ['Technical' , 'Reversal' , 'Other'],
        default: 'Other',
    },
    status: {
        type: String,
        enum: ['Open', 'examination', 'Closed'],
        default: 'Open',
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'high'],
        default: 'Medium',
    },
    closedAt: {
        type: Date,
    },
}, { timestamps: true });

export const TicketModel: Model<ITicket> = mongoose.models?.ticket || mongoose.model<ITicket>("ticket", TicketSchema);