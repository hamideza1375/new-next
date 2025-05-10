'use client'
import _Footer from '@/components/product/_Footer';
import Comments from '@/components/product/comments';
import ProductInfo from '@/components/product/ProductInfo';

export default function Product() {
    return (
        <div dir="rtl" className="w-full flex flex-col flex-1">
            <ProductInfo />

            <Comments />

            <_Footer />
        </div>
    );
}


