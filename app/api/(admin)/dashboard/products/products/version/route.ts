import authAdminRoutes from '@/middleware/authAdminRoutes';
import { ProductsModel } from '@/models/ProductModel';
import dbConnect from '@/utils/dbConnect';
import { NextRequest, NextResponse as res } from 'next/server';

// Type definitions
interface VersionUpdateRequest {
    version: string;
}

interface ProductVersionResponse {
    version: string;
}

// PUT endpoint for updating product version
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
        const { version }: VersionUpdateRequest = await req.json();
        
        if (!version || typeof version !== 'string') {
            return res.json(
                { message: 'ورژن محصول باید به صورت رشته ارسال شود' },
                { status: 400 }
            );
        }

        // Validate version format (semantic versioning example)
        if (!/^[\d.]+$/.test(version)) {
            return res.json(
                { message: 'فرمت ورژن نامعتبر است. از فرمت x.y.z استفاده کنید' },
                { status: 400 }
            );
        }

        // Update product version
        const updatedProduct = await ProductsModel.findByIdAndUpdate(
            productId,
            { version },
            { 
                new: true,
                runValidators: true 
            }
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
                message: 'ورژن محصول با موفقیت به‌روزرسانی شد',
                dt: {
                    id: updatedProduct._id,
                    version: updatedProduct.version
                }
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('Error updating product version:', error);
        return res.json(
            {
                message: error?.message || 'خطا در به‌روزرسانی ورژن محصول'
            },
            { status: error?.status || 500 }
        );
    }
}

// GET endpoint for retrieving product version
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

        // Find product and select only version field
        const product = await ProductsModel.findById(productId).select('version');
        
        if (!product) {
            return res.json(
                { message: 'محصول یافت نشد' },
                { status: 404 }
            );
        }

        // Return version with default if undefined
        return res.json({
            version: product.version || '1.0.0' // Default version
        });

    } catch (error: any) {
        return res.json(
            {
                message: error?.message || 'خطا در دریافت ورژن محصول'
            },
            { status: error?.status || 500 }
        );
    }
}