import db from '../../../../lib/db';

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, name, email, username, profile, profession, bio } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), { status: 400 });
    }

    // Check for duplicate email or username before updating
    const checkSql = `
      SELECT idauth FROM auth WHERE (email = ? OR username = ?) AND idauth != ?
    `;
    // console.log('Checking duplicates for user id:', id, 'email:', email, 'username:', username);
    const [existingUsers] = await db.query(checkSql, [email, username, id]);
    // console.log('Duplicate check result:', existingUsers);
    if (existingUsers.length > 0) {
      return new Response(JSON.stringify({ error: 'Email or username already in use by another user' }), { status: 409 });
    }

    const sql = `
      UPDATE auth
      SET name = ?, email = ?, username = ?, profile = ?, profession = ?, bio = ?
      WHERE idauth = ?
    `;

    const values = [name, email, username, profile, profession, bio, id];

    const [result] = await db.query(sql, values);

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ error: 'User not found or no changes made' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'User updated successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
