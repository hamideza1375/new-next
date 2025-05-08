import mongoose, { Mongoose } from 'mongoose';

// تعریف نوع برای کش اتصال
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// خواندن آدرس اتصال از متغیر محیطی
const MONGODB_URI = process.env.MONGODB_URI as string;

// بررسی وجود آدرس اتصال
if (!MONGODB_URI) {
  throw new Error('لطفاً متغیر محیط MONGODB_URI را در داخل .env.local تعریف کنید');
}

// بررسی و مقداردهی اولیه کش جهانی
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}

let cached: MongooseCache = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * تابع اتصال به پایگاه داده MongoDB با قابلیت کش کردن اتصال
 * @returns {Promise<Mongoose>} شیء اتصال Mongoose
 * @throws {Error} در صورت عدم موفقیت در اتصال
 */
async function dbConnect(): Promise<Mongoose> {
  // اگر اتصال از قبل وجود داشت، همان را برگردان
  if (cached.conn) {
    return cached.conn;
  }

  // اگر promise اتصال وجود نداشت، یک اتصال جدید ایجاد کن
  if (!cached.promise) {
    mongoose.set('strictQuery', true);
    
    cached.promise = mongoose.connect(MONGODB_URI).then((mongooseInstance: Mongoose) => {
      return mongooseInstance;
    });
  }

  try {
    // منتظر بمان تا اتصال کامل شود
    cached.conn = await cached.promise;
  } catch (e) {
    // در صورت خطا، promise را ریست کرده و خطا را پرتاب کن
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;