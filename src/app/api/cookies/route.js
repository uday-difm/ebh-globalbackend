import { NextResponse } from "next/server";
import db from "../../../lib/db"; // adjust path if needed

export async function POST(request) {
  try {
    const data = await request.json();
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || null;

    // 1️⃣ Case 1: it's a consent payload (has 'consent' or 'session_id')
    if (
      typeof data.consent !== "undefined" ||
      data.session_id ||
      data.user_id
    ) {
      const consentRaw = data.consent;
      const consent =
        consentRaw === true ||
        consentRaw === "true" ||
        consentRaw === "accepted"
          ? "accepted"
          : consentRaw === false ||
            consentRaw === "false" ||
            consentRaw === "declined"
          ? "declined"
          : String(consentRaw || "unknown");

      const sessionId = data.session_id || null;
      const userId = data.user_id || null;
      const consentType = data.consent_type || "general";

      // try to update existing record by user_id or session_id
      if (userId) {
        const [u] = await db.execute(
          `UPDATE cookies 
           SET consent_status=?, consent_type=?, ip_address=?, user_agent=?, updated_at=CURRENT_TIMESTAMP 
           WHERE user_id=?`,
          [consent, consentType, ip, userAgent, userId]
        );
        if (u && u.affectedRows > 0) {
          return NextResponse.json(
            { success: true, message: "Consent updated (user_id)" },
            { status: 200 }
          );
        }
      }

      if (sessionId) {
        const [u] = await db.execute(
          `UPDATE cookies 
           SET consent_status=?, consent_type=?, ip_address=?, user_agent=?, updated_at=CURRENT_TIMESTAMP 
           WHERE session_id=?`,
          [consent, consentType, ip, userAgent, sessionId]
        );
        if (u && u.affectedRows > 0) {
          return NextResponse.json(
            { success: true, message: "Consent updated (session_id)" },
            { status: 200 }
          );
        }
      }

      // insert if not found
      const [insert] = await db.execute(
        `INSERT INTO cookies (ip_address, user_agent, consent_status, consent_type, session_id, user_id, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [ip, userAgent, consent, consentType, sessionId, userId]
      );

      return NextResponse.json(
        { success: true, insertedId: insert.insertId, type: "consent" },
        { status: 200 }
      );
    }

    // 2️⃣ Case 2: it's a single cookie (has 'name' and 'value')
    if (!data.name || !data.value) {
      return NextResponse.json(
        { error: "Missing required fields (name, value or consent)" },
        { status: 400 }
      );
    }

    const expiresDate = data.expires
      ? new Date(data.expires).toISOString().slice(0, 19).replace("T", " ")
      : null;

    const [result] = await db.execute(
      `INSERT INTO cookies (name, value, domain, expires_at, ip_address, user_agent, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [
        data.name,
        data.value,
        data.domain || null,
        expiresDate,
        ip,
        userAgent,
      ]
    );

    // optional: set cookie in response
    let cookieStr = `${data.name}=${data.value}; Path=/;`;
    if (data.domain) cookieStr += ` Domain=${data.domain};`;
    if (expiresDate)
      cookieStr += ` Expires=${new Date(expiresDate).toUTCString()};`;

    return new Response(
      JSON.stringify({ success: true, insertedId: result.insertId, type: "cookie" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": cookieStr,
        },
      }
    );
  } catch (error) {
    console.error("Cookies API DB Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
