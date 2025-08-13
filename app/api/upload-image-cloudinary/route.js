import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const image = formData.get('image');

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    console.log('Received image for Cloudinary:', {
      name: image.name,
      type: image.type,
      size: image.size
    });

    // Convert the image to base64
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${image.type};base64,${base64}`;

    // Upload to Cloudinary (free tier, no API key required for basic uploads)
    const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/demo/image/upload';
    
    const response = await fetch(cloudinaryUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file: dataUrl,
        upload_preset: 'ml_default', // This is a demo preset
      }),
    });

    const data = await response.json();
    console.log('Cloudinary response:', data);

    if (data.secure_url) {
      console.log('Cloudinary upload successful:', data.secure_url);
      return NextResponse.json({ 
        success: true, 
        url: data.secure_url 
      });
    } else {
      console.error('Cloudinary upload failed:', data);
      return NextResponse.json(
        { error: data.error?.message || 'Upload failed' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Cloudinary server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 