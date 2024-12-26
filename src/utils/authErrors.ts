import { AuthError } from '@supabase/supabase-js';

export function handleAuthError(error: unknown): Error {
  if (error instanceof AuthError) {
    switch (error.status) {
      case 400:
        if (error.message.includes('Invalid login credentials')) {
          return new Error('Invalid email or password. Please try again.');
        }
        if (error.message.includes('Email not confirmed')) {
          return new Error('Please verify your email address before signing in.');
        }
        return new Error('Invalid credentials. Please check your email and password.');
      case 422:
        return new Error('Invalid email format. Please enter a valid email address.');
      case 429:
        return new Error('Too many attempts. Please try again later.');
      default:
        return new Error('An error occurred during authentication. Please try again.');
    }
  }
  
  return error instanceof Error ? error : new Error('An unexpected error occurred');
}