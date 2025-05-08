import authAdminRoutes from '@/middleware/authAdminRoutes';
import { ProductsModel } from '@/models/ProductModel';
import dbConnect from '@/utils/dbConnect';
import { NextRequest, NextResponse as res } from 'next/server';



// PUT endpoint for toggling product popularity
export async function PUT(req: NextRequest): Promise<Response> {
    try {
        // Connect to database
        await dbConnect();
        
        // Authenticate admin
        await authAdminRoutes();

        // Get product ID from query params
        const productId = req.nextUrl.searchParams.get('productID');
        if (!productId) {
            return res.json('شناسه محصول مورد نیاز است', { status: 400 });
        }

        // Find product by ID
        const product = await ProductsModel.findById(productId);
        if (!product) {
            return res.json('محصول یافت نشد', { status: 404 });
        }

        // Toggle popularity status
        product.popular = !product.popular;
        
        // Save changes
        await product.save();

        // Return success response
        return res.json(
            { 
                message: 'وضعیت محبوبیت محصول با موفقیت تغییر کرد', 
                dt: { 
                    id: product._id,
                    popular: product.popular 
                } 
            }, 
            { status: 200 }
        );

    } catch (error: any) {
        console.error('Error toggling product popularity:', error);
        return res.json(
            error?.message || 'خطای سرور در تغییر وضعیت محبوبیت', 
            { status: error?.status || 500 }
        );
    }
}

// GET endpoint for retrieving product popularity status
export async function GET(req: NextRequest): Promise<Response> {
    try {
        // Connect to database
        await dbConnect();
        
        // Authenticate admin
        await authAdminRoutes();

        // Get product ID from query params
        const productId = req.nextUrl.searchParams.get('productID');
        if (!productId) {
            return res.json('شناسه محصول مورد نیاز است', { status: 400 });
        }

        // Find product and select only popularity field
        const product = await ProductsModel.findById(productId).select('popular');
        if (!product) {
            return res.json('محصول یافت نشد', { status: 404 });
        }

        // Return popularity status
        return res.json({ 
            popular: product.popular 
        });

    } catch (error: any) {
        return res.json(
            error?.message || 'خطای سرور در دریافت وضعیت محبوبیت', 
            { status: error?.status || 500 }
        );
    }
}