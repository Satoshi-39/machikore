/**
 * OTPコード認証
 */

import { supabase } from '../client';
import type { Result } from '@/shared/types';

/**
 * OTPコードをメールで送信
 * 6桁の認証コードがメールで届く
 */
export async function sendOtpCode(
  email: string,
  captchaToken: string
): Promise<Result<void>> {
  try {
    const normalizedEmail = email.trim().toLowerCase();

    const { error } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        shouldCreateUser: true,
        captchaToken,
      },
    });

    if (error) {
      return { success: false, error };
    }

    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

/**
 * OTPコードを検証してサインイン
 */
export async function verifyOtpCode(
  email: string,
  token: string
): Promise<Result<{ userId: string }>> {
  try {
    const normalizedEmail = email.trim().toLowerCase();

    const { data, error } = await supabase.auth.verifyOtp({
      email: normalizedEmail,
      token: token.trim(),
      type: 'email',
    });

    if (error) {
      return { success: false, error };
    }

    if (!data.user) {
      return {
        success: false,
        error: new Error('Verification failed'),
      };
    }

    return {
      success: true,
      data: { userId: data.user.id },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}
