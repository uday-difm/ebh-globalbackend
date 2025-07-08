import { NextResponse } from 'next/server';
import db from '../../../../../lib/db.js';

export async function GET(request, { params }) {
    const { id } = params;

    const sql = 
      "SELECT " +
      "magazine_id, " +
      "magazine_title, " +
      "magazine_description, " +
      "magazine_tags, " +
      "magazine_cover_image, " +
      "magazine_link, " +
      "DATE_FORMAT(magazine_date, '%Y-%m-%d') AS formatted_date, " +
      "magazine_category, " +
      "MagCloudLink " +
      "FROM magazines " +
      "WHERE magazine_id = ?";

    return new Promise((resolve) => {
        db.query(sql, [id], (err, results) => {
            if (err) {
                resolve(
                    NextResponse.json({ error: 'internal server error' }, { status: 500 })
                );
            } else if (results.length > 0) {
                resolve(NextResponse.json(results, { status: 200 }));
            } else {
                resolve(
                    NextResponse.json({ error: 'Magazine Not Found' }, { status: 404 })
                );
            }
        });
    });
}
