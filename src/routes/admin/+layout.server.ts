import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { PRIVATE_ADMIN_PASSWORD } from '$env/static/private';

// Simple base64 encoding for password storage in cookies (Node.js environment)
function encodePassword(password: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(password + '-admin-stcollection').toString('base64');
  }
  // Fallback for non-Node environments
  return btoa(password + '-admin-stcollection');
}

function decodePassword(encoded: string): string | null {
  try {
    let decoded: string;
    if (typeof Buffer !== 'undefined') {
      decoded = Buffer.from(encoded, 'base64').toString('utf8');
    } else {
      decoded = atob(encoded);
    }
    
    if (decoded.endsWith('-admin-stcollection')) {
      return decoded.replace('-admin-stcollection', '');
    }
    return null;
  } catch (error) {
    return null;
  }
}

export const load: LayoutServerLoad = async ({ cookies, url }) => {
  // Skip auth check for login page
  if (url.pathname === '/admin/login') {
    return {};
  }

  const encryptedPassword = cookies.get('admin-auth');
  
  if (!encryptedPassword) {
    throw redirect(302, '/admin/login');
  }

  const decryptedPassword = decodePassword(encryptedPassword);
  
  if (decryptedPassword !== PRIVATE_ADMIN_PASSWORD) {
    cookies.delete('admin-auth', { path: '/' });
    throw redirect(302, '/admin/login?error=invalid');
  }

  return {
    isAuthenticated: true
  };
};
