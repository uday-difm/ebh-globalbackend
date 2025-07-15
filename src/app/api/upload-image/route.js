import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image');

    if (!imageFile || typeof imageFile === 'string') {
      return new Response(JSON.stringify({ error: 'No image file provided' }), { status: 400 });
    }

    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const ext = path.extname(imageFile.name);
    const fileName = uuidv4() + ext;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(uploadDir, fileName);

    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(filePath, buffer);

    const imageUrl = `/uploads/${fileName}`;

    return new Response(JSON.stringify({ imageUrl }), { status: 200 });
  } catch (error) {
    console.error('Error handling upload:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
