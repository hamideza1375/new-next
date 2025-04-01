import '@/models/SellerModel';
import { CustomError } from '@/utils/CustomError';
import crypto from 'crypto';
import mongoose from "mongoose";
import { getScryptParams } from '@/utils/getScryptParams';

const userSchema = new mongoose.Schema({
    username: { type: String, minlength: 3 },
    email: {
        type: String,
        required: true,
        unique: [true, 'حسابی با این مشخصات از قبل موجود هست'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'لطفا یک ایمیل معتبر وارد کنید']
    },
    phone: {
        type: String,
        required: false,
        unique: true,
        sparse: true,
        validate: {
            validator: function (v) {
                return /\d{11}/.test(v);
            },
            message: 'شماره تلفن باید ۱۱ رقم باشد',
        }
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'رمز عبور باید حداقل ۶ کاراکتر باشد'],
        select: false
    },
    isAdmin: { type: Number, required: false, /* unique: true, */ sparse: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
    products: { type: Array, default: [] },
    blocked: { type: Number, default: 0 },
    address: {
        type: String,
    },
    city: {
        type: String,
    },
    postalCode: {
        type: String,
        minlength: 10,
        maxlength: 10
    },
    latlng: { type: Object },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    lastLogin: Date,
    passwordChangedAt: Date,
}, { timestamps: true });


const { N, r, p } = getScryptParams();
const keyLength = 64; // طول کلید هش شده (بر حسب بایت)

// pre-save hook برای هش کردن رمز عبور
userSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next();
    const salt = crypto.randomBytes(16).toString('hex'); // سالت تصادفی
    crypto.scrypt(this.password, salt, keyLength, { N, r, p }, (err, derivedKey) => {
        if (err) return next(err);

        // ذخیره هش به همراه نمک
        this.password = `${salt}:${derivedKey.toString('hex')}`;
        next();
    });
});


userSchema.methods.comparePassword = async function (candidatePassword) {
    const [salt, hashedPassword] = this.password.split(':'); // جدا کردن سالت و هش ذخیره شده
    try {
        const derivedKey = await new Promise((resolve, reject) => {
            crypto.scrypt(candidatePassword, salt, keyLength, { N, r, p }, (err, derivedKey) => {
                if (err) reject(err);
                resolve(derivedKey.toString('hex'));
            });
        });

        // مقایسه هش‌ها
        if (hashedPassword !== derivedKey) {
            throw new CustomError({message:'مشخصات وارد شده اشتباه است', status: 400}); // استفاده از کلاس خطای سفارشی
        }
    } catch (err) {
        throw new CustomError({message:'خطا در بررسی رمز عبور', status: 500}); // استفاده از کلاس خطای سفارشی
    }
};


userSchema.post('save', function (error, doc, next) {
    if (error.code === 11000) {
        next(new CustomError({message:'این ایمیل یا تلفن قبلاً استفاده شده است', status: 409}));
    } else {
        next(error);
    }
});

export const UsersModel = mongoose.models?.User || mongoose.model('User', userSchema);
