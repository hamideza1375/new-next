import mongoose from'mongoose';
import '@/models/UsersModel'
import '@/models/ProductModel';


const sellerSchema = mongoose.Schema({
	brand: {
		 type: String,
		 required: true,
		 minlength: 2
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
		//  default: 'default-logo-url.png'
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
// 	createdAt: {
// 		type: Date,
// 		default: Date.now
//   },
//   updatedAt: {
// 		type: Date,
// 		default: Date.now
//   },
});

export const SellerModel = mongoose.models?.Seller || mongoose.model('Seller', sellerSchema);
