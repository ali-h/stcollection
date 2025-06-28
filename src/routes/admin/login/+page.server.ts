import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { PRIVATE_ADMIN_PASSWORD } from '$env/static/private';

// Simple base64 encoding for password storage in cookies (Node.js environment)
function encodePassword(password: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(password + '-admin-stcollection').toString('base64');
  }
  // Fallback for non-Node environments
  return btoa(password + '-admin-stcollection');
}

export const actions: Actions = {
  login: async ({ request, cookies, url }) => {
    const formData = await request.formData();
    const password = formData.get('password') as string;

    if (!password) {
      return fail(400, { 
        error: 'Password is required',
        password: ''
      });
    }

    if (password !== PRIVATE_ADMIN_PASSWORD) {
      return fail(401, { 
        error: 'Invalid password',
        password: ''
      });
    }

    // Set encrypted password in cookie
    const encodedPassword = encodePassword(password);
    cookies.set('admin-auth', encodedPassword, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      sameSite: 'strict'
    });

    throw redirect(302, '/admin');
  }
};
