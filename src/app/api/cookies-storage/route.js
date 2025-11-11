import { NextResponse } from 'next/server';
import pool from "../../../lib/db";

// POST /api/cookies/storage
// payload: { session_id?: string, cookies: [{ name, value, domain?, path?, expires_at?, secure?, http_only?, same_site? }], user_id?: number }
export async function POST(request) {
  try {
    const body = await request.json();
    const items = body.cookies || [];
    const sessionId = body.session_id || null;
    const userId = body.user_id || null;
    const userIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: 'No cookies provided' }, { status: 400 });
    }

    const sql = `INSERT INTO cookie_storage (cookie_name, cookie_value, ip_address, session_id, user_id, domain, path, expires_at, secure, http_only, same_site)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    for (const c of items) {
      const name = c.name || c.key || '';
      const value = c.value || c.val || '';
      const domain = c.domain || body.domain || null;
      const path = c.path || '/';
      const expiresAt = c.expires_at ? new Date(c.expires_at) : null;
      const secure = c.secure ? 1 : 0;
      const httpOnly = c.http_only ? 1 : 0;
      const sameSite = c.same_site || 'Lax';

      await pool.execute(sql, [name, value, userIp, sessionId, userId, domain, path, expiresAt, secure, httpOnly, sameSite]);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Cookie storage API error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}