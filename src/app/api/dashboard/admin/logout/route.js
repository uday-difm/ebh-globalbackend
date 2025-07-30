import { destroyCookie } from 'nookies';

export async function POST(req) {
  const res = new Response();

  destroyCookie({ res }, 'auth_token', { path: '/dashboard/login' });

  return new Response(JSON.stringify({ message: 'Logged out' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

