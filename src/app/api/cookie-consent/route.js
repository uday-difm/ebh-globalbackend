// // src/app/api/cookie-consent/route.js

// import { NextResponse } from 'next/server';
// import { query } from '../../../lib/db';

// export async function POST(req) {
//   try {
//     // Only extract the values that are actually sent from the frontend
//     const { consent, userAgent, referrer } = await req.json();
//     const userIp = req.headers.get('x-forwarded-for') || req.ip;

//     const sql = `
//       INSERT INTO cookie_consents (user_ip, consent_status, user_agent, referrer)
//       VALUES (?, ?, ?, ?)
//     `;
//     const values = [userIp, consent, userAgent, referrer];

//     // The number of values now correctly matches the number of placeholders in the SQL query
//     await query(sql, values);

//     return NextResponse.json({ success: true, message: "Consent recorded" }, { status: 200 });
//   } catch (error) {
//     console.error('Database error:', error);
//     return NextResponse.json({ success: false, error: "Failed to record consent" }, { status: 500 });
//   }
// }


import { NextResponse } from 'next/server';
import pool from "../../../lib/db";

// POST /api/cookies
// payload: { consent: true|false, session_id?: string, consent_type?: string, user_id?: number }
export async function POST(request) {
  try {
    const body = await request.json();
    const userIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const consentStatus = body.consent === true ? 'accepted' : 'declined';
    const consentType = body.consent_type || body.type || 'general';
    const sessionId = body.session_id || null;
    const userId = body.user_id || null;

    const sql = `INSERT INTO cookie_consents (ip_address, user_agent, consent_status, consent_type, session_id, user_id)
      VALUES (?, ?, ?, ?, ?, ?)`;

    await pool.execute(sql, [userIp, userAgent, consentStatus, consentType, sessionId, userId]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Cookie consent API error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}