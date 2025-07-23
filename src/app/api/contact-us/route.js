import { NextResponse } from 'next/server';
import db from '../../../lib/db'; // Using our shared database connection

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, email, phone, subject, textArea } = data;

    // Basic validation
    if (!name || !email || !phone || !subject || !textArea) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }
    

    const sql = "INSERT INTO contact_us (name, email, number, subject, message) VALUES (?, ?, ?, ?, ?)";
    await db.query(sql, [name, email, phone, subject, textArea]);

    return NextResponse.json({ message: "Your message has been saved successfully." }, { status: 200 });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ message: "Internal Server Error." }, { status: 500 });
  }
}