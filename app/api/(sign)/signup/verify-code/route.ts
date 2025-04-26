import errorHandling from '@/middleware/errorHandling';
import { checkCode } from '@/middleware/sendCode';
import { UsersModel } from '@/models/UsersModel';
import { SignUpValidator } from '@/validator/SignValidator';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

interface RequestBody {
  username: string;
  password: string;
  code: number;
}

interface Products {
  productId: string;
  version: number;
}

interface UserToken {
  sellerId?: string;
  userId?: string;
  username?: string;
  email: string;
  products?: Products[];
}


export async function POST(req: NextRequest): Promise<NextResponse> {
  return errorHandling(async (): Promise<NextResponse> => {
    const cookieStore = await cookies();

    // Check if user is already logged in
    if (cookieStore.get('token') || cookieStore.get('httpToken')) {
      return NextResponse.json(
        { message: 'شما در حال حاضر یک حساب فعال دارید' },
        { status: 429 }
      );
    }

    // Parse request body
    const body: RequestBody = await req.json();
    const { username, password, code } = body;

    // Get email from cookie
    const email = cookieStore.get('email')?.value;

    // Check if email exists
    if (!email) {
      return NextResponse.json(
        { message: 'لطفاً ابتدا کد تأیید را دریافت کنید' },
        { status: 400 }
      );
    }

    // Verify the code
    await checkCode(email, code);

    // Validate input data
    SignUpValidator.validateSync({ ...body, email });
    await UsersModel.validate({ ...body, email });

    // Check number of existing users
    const userLength = await UsersModel.countDocuments();

    // Create new user
    const user = new UsersModel({
      username,
      password,
      email
    });

    // Set first user as admin
    if (userLength === 0) {
      user.isAdmin = 1;
    }
    await user.save();

    // Create JWT tokens
    const forToken: UserToken = {
      ...(user.seller && { sellerId: user.seller.toString() }),
      userId: user._id?.toString(),
      username: user.username,
      email: user.email,
      products: user.products
  };

    const token = (secret: string): string => jwt.sign(forToken, secret);
    
    // Create response
    const response = NextResponse.json(
      { 
        dt: token('token'), 
        message: 'ثبت نام با موفقیت انجام شد' 
      },
      { status: 201 }
    );

    // Set cookies
    response.cookies.set('httpToken', token('httpToken'), {
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true
    });
    response.cookies.set('token', token('token'), {
      maxAge: 60 * 60 * 24 * 30
    });

    // Clean up cookies
    cookieStore.delete('ResendTime');
    cookieStore.delete('email');

    return response;
  });
}