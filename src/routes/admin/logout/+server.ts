import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
  cookies.delete('admin-auth', { path: '/' });
  throw redirect(302, '/admin/login');
};
