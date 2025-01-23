import mongoose from "mongoose";
import crypto from 'crypto';

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
    // passwordConfirm: {
    //     type: String,
    //     required: [true, 'لطفا رمز عبور خود را تایید کنید'],
    //     validate: {
    //         validator: function (el) {
    //             return el === this.password;
    //         },
    //         message: 'رمز عبور و تاییدیه رمز عبور یکسان نیستند'
    //     }
    // },
    isAdmin: { type: Number, required: false, unique: true, sparse: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
    products: { type: Array, default: [] },
    blocked: { type: Number, default: 0 },
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


userSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next();
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.pbkdf2(this.password, salt, 1000, 64, 'sha512', (err, derivedKey) => {
        if (err) return next(err);
        this.password = `${salt}:${derivedKey.toString('hex')}`;
        next();
    });
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    const [salt, key] = this.password.split(':');
    const derivedKey = await new Promise((resolve, reject) => {
        crypto.pbkdf2(candidatePassword, salt, 1000, 64, 'sha512', (err, derivedKey) => {
            if (err) reject(err);
            resolve(derivedKey.toString('hex'));
        });
    });
    if (key !== derivedKey) throw new Error('مشخصات وارد شده اشتباه است');
};

userSchema.post('save', function (error, doc, next) {
    if (error.code === 11000) {
        next(new Error('این ایمیل یا تلفن قبلاً استفاده شده است'));
    } else {
        next(error);
    }
});

const UserModel = mongoose.models?.User || mongoose.model('User', userSchema);

module.exports = UserModel;