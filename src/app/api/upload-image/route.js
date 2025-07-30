import { v4 as uuidv4 } from 'uuid';
import { uploadToS3 } from '../../../../utils/s3Utility';

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

    // Prepare file object for s3Utility
    const ext = imageFile.name ? imageFile.name.split('.').pop() : 'jpg';
    const fileName = uuidv4() + '.' + ext;
    const file = {
      originalname: fileName,
      buffer: buffer,
      mimetype: imageFile.type || 'image/jpeg',
    };
    // Upload to S3 and get public URL
    const imageUrl = await uploadToS3('profile', file);

    return new Response(JSON.stringify({ imageUrl }), { status: 200 });
  } catch (error) {
    console.error('Error handling upload:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
