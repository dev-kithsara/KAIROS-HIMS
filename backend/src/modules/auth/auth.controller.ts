import { Request, Response } from 'express';
import { authService } from './auth.service';
import { loginSchema } from './auth.validator';
import { catchAsync } from '../../shared/utils/catchAsync';

export const login = catchAsync(async (req: Request, res: Response) => {
    // 1. Validate the Request Body using Zod
    const validatedData = loginSchema.parse({ body: req.body });
    const { email, password } = validatedData.body;

    // 2. Call the Auth Service to perform login
    const result = await authService.login(email, password);

    // 3. Send the successful response with Token and User data
    return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
            user: result.user,
            token: result.token,
        },
    });
});
