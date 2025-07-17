import { destroyCookie } from 'nookies';

export default function handler(req, res) {
  destroyCookie({ res }, 'auth_token', { path: '/dashboard/login' });
  res.status(200).json({ message: 'Logged out' });
}
