// src/app/api/cookie-consent/route.js

import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';

export async function POST(req) {
  try {
    // Only extract the values that are actually sent from the frontend
    const { consent, userAgent, referrer } = await req.json();
    const userIp = req.headers.get('x-forwarded-for') || req.ip;

    const sql = `
      INSERT INTO cookie_consents (user_ip, consent_status, user_agent, referrer)
      VALUES (?, ?, ?, ?)
    `;
    const values = [userIp, consent, userAgent, referrer];

    // The number of values now correctly matches the number of placeholders in the SQL query
    await query(sql, values);

    return NextResponse.json({ success: true, message: "Consent recorded" }, { status: 200 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ success: false, error: "Failed to record consent" }, { status: 500 });
  }
}