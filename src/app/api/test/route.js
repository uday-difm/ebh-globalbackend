// src/app/api/test/route.js
import { NextResponse } from 'next/server';
import db from '../../../lib/db'; // Import the database connection pool

/**
 * Handles GET requests to /api/test
 * This endpoint will now check the database connection and return a greeting.
 */
export async function GET() {
  try {
    // Attempt a simple query to verify the database connection
    const [rows] = await db.query('SELECT 1');
    // console.log('✅ Database connected from API route:', rows); // This will show in your terminal

    // Return a simple greeting message along with a confirmation of database connection
    return NextResponse.json({
      message: 'Hello Altaf Raza Siddique',
      databaseStatus: 'Connected',
      status: 200,
    });

  } catch (error) {
    // Log the error for debugging purposes
    console.error('❌ API Test Error: Database connection failed or query error:', error.message);

    // Return an error response if the database connection fails
    return NextResponse.json({
      message: 'Hello Altaf Raza Siddique, but database connection failed.',
      databaseStatus: 'Disconnected',
      error: error.message,
      status: 500,
    }, { status: 500 }); // Set the HTTP status code for the response
  }
}

// You can also define other HTTP methods if needed, e.g., POST, PUT, DELETE
// export async function POST(request) {
//   // Handle POST requests
// }
