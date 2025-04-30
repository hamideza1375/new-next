import authAdminRoutes from '@/middleware/authAdminRoutes';
import { ProductsModel } from '@/models/ProductModel';
import dbConnect from '@/utils/dbConnect';
import { NextRequest, NextResponse as res } from 'next/server';

interface ProgressRequest {
    progress: number;
}

interface ProductProgress {
    progress?: number;
}

// PUT endpoint for updating product progress
export async function PUT(req: NextRequest): Promise<Response> {
    try {
        // Connect to database
        await dbConnect();
        
        // Authenticate admin
        await authAdminRoutes();

        // Get product ID from query params
        const productId = req.nextUrl.searchParams.get('productID');
        if (!productId) {
            return res.json({ message: 'شناسه محصول الزامی است' }, { status: 400 });
        }

        // Parse request body
        const { progress }: ProgressRequest = await req.json();
        
        // Validate progress value
        if (progress === undefined || progress === null) {
            return res.json({ message: 'مقدار پیشرفت الزامی است' }, { status: 400 });
        }

        if (typeof progress !== 'number' || progress < 0 || progress > 100) {
            return res.json({ message: 'مقدار پیشرفت باید بین 0 تا 100 باشد' }, { status: 400 });
        }

        // Find and update product
        const product = await ProductsModel.findByIdAndUpdate(
            productId,
            { progress },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.json({ message: 'محصول یافت نشد' }, { status: 404 });
        }

        // Return success response
        return res.json(
            { 
                message: 'پیشرفت محصول با موفقیت به‌روزرسانی شد',
                dt: {
                    id: product._id,
                    progress: product.progress
                }
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('Error updating product progress:', error);
        return res.json(
            { 
                message: error?.message || 'خطا در به‌روزرسانی پیشرفت محصول' 
            },
            { status: error?.status || 500 }
        );
    }
}

// GET endpoint for retrieving product progress
export async function GET(req: NextRequest): Promise<Response> {
    try {
        // Connect to database
        await dbConnect();
        
        // Authenticate admin
        await authAdminRoutes();

        // Get product ID from query params
        const productId = req.nextUrl.searchParams.get('productID');
        if (!productId) {
            return res.json({ message: 'شناسه محصول الزامی است' }, { status: 400 });
        }

        // Find product and select only progress field
        const product = await ProductsModel.findById(productId).select('progress');
        
        if (!product) {
            return res.json({ message: 'محصول یافت نشد' }, { status: 404 });
        }

        // Return progress status
        return res.json({ 
            progress: product.progress || 0 
        });

    } catch (error: any) {
        return res.json(
            { 
                message: error?.message || 'خطا در دریافت وضعیت پیشرفت محصول' 
            },
            { status: error?.status || 500 }
        );
    }
}