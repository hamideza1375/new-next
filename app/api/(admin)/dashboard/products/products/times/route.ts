import authAdminRoutes from '@/middleware/authAdminRoutes';
import { ProductsModel } from '@/models/ProductModel';
import dbConnect from '@/utils/dbConnect';
import { NextRequest, NextResponse as res } from 'next/server';

// Define types for product times
interface ProductTimes {
    // Adjust these based on your actual time structure
    preparationTime?: number;
    cookingTime?: number;
    totalTime?: number;
    [key: string]: any; // For additional time properties
}

interface ProductTimesResponse {
    times: ProductTimes;
}

// PUT endpoint for updating product times
export async function PUT(req: NextRequest): Promise<Response> {
    try {
        // Connect to database
        await dbConnect();
        
        // Authenticate admin
        await authAdminRoutes();

        // Get product ID from query params
        const productId = req.nextUrl.searchParams.get('productID');
        if (!productId) {
            return res.json(
                { message: 'شناسه محصول الزامی است' },
                { status: 400 }
            );
        }

        // Parse and validate request body
        const { times }: { times: ProductTimes } = await req.json();
        
        if (!times || typeof times !== 'object') {
            return res.json(
                { message: 'داده‌های زمان‌ها باید به صورت آبجکت ارسال شوند' },
                { status: 400 }
            );
        }

        // Validate individual time values if needed
        if (times.preparationTime && typeof times.preparationTime !== 'number') {
            return res.json(
                { message: 'زمان آماده‌سازی باید عددی باشد' },
                { status: 400 }
            );
        }

        // Update product times
        const updatedProduct = await ProductsModel.findByIdAndUpdate(
            productId,
            { times },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.json(
                { message: 'محصول یافت نشد' },
                { status: 404 }
            );
        }

        // Return success response
        return res.json(
            {
                message: 'زمان‌های محصول با موفقیت به‌روزرسانی شد',
                dt: {
                    id: updatedProduct._id,
                    times: updatedProduct.times
                }
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('Error updating product times:', error);
        return res.json(
            {
                message: error?.message || 'خطا در به‌روزرسانی زمان‌های محصول'
            },
            { status: error?.status || 500 }
        );
    }
}

// GET endpoint for retrieving product times
export async function GET(req: NextRequest): Promise<Response> {
    try {
        // Connect to database
        await dbConnect();
        
        // Authenticate admin
        await authAdminRoutes();

        // Get product ID from query params
        const productId = req.nextUrl.searchParams.get('productID');
        if (!productId) {
            return res.json(
                { message: 'شناسه محصول الزامی است' },
                { status: 400 }
            );
        }

        // Find product and select only times field
        const product = await ProductsModel.findById(productId).select('times');
        
        if (!product) {
            return res.json(
                { message: 'محصول یافت نشد' },
                { status: 404 }
            );
        }

        // Return times with default empty object if undefined
        return res.json({
            times: product.times || {}
        });

    } catch (error: any) {
        return res.json(
            {
                message: error?.message || 'خطا در دریافت زمان‌های محصول'
            },
            { status: error?.status || 500 }
        );
    }
}