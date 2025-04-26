import mongoose from'mongoose';
import '@/models/UsersModel'


const AnswerTicketSchema = new mongoose.Schema({
	message: { type: String },
	imageUrl: { type: String },
	userId: { type: mongoose.Schema.Types.ObjectId },
	seenDate: { type: Date, default: Date.now() },
	// createdAt: {
	// 	type: Date,
	// 	default: Date.now,
	//  },
	//  updatedAt: {
	// 	type: Date,
	// 	default: Date.now,
	//  }
 },{ timestamps: true })
 

const TicketSchema = new mongoose.Schema({
	title: { type: String, require: true, minlength: 1 },
	message: { type: String,/*  require: true, minlength: 1 */ },
	image: { type: String },
	answer: [AnswerTicketSchema],
	user: { type: mongoose.Schema.Types.ObjectId, ref:'User' },
	userSeen: { type: Number, default: 1 },
	adminSeen: { type: Number, default: 0 },
	category: {
		type: String,
		required: [true, 'لطفا دسته‌بندی تیکت را انتخاب کنید'],
		enum: ['پشتیبانی فنی', 'بازگشت وجه', 'پیشنهادات', 'سایر'],
		default: 'سایر',
	 },
	 status: {
		type: String,
		enum: ['باز', 'در حال بررسی', 'بسته شده'],
		default: 'باز',
	 },
	 priority: {
		type: String,
		enum: ['کم', 'متوسط', 'زیاد'],
		default: 'متوسط',
	 },
	   // تاریخ بسته شدن تیکت
		closedAt: {
			type: Date,
	 },
	//  createdAt: {
	// 	type: Date,
	// 	default: Date.now,
	//  },
	//  // تاریخ به‌روزرسانی تیکت
	//  updatedAt: {
	// 	type: Date,
	// 	default: Date.now,
	//  },
 },{ timestamps: true })
 

export const TicketModel = mongoose.models?.ticket || mongoose.model("ticket",TicketSchema);

 