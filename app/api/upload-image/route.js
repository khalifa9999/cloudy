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

    console.log('Received image:', {
      name: image.name,
      type: image.type,
      size: image.size
    });

    // Validate file type (WebP should be converted to PNG on client side)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(image.type)) {
      return NextResponse.json({ 
        error: `Unsupported file type: ${image.type}. Supported types: ${allowedTypes.join(', ')}. WebP files will be automatically converted to PNG.` 
      }, { status: 400 });
    }

    // Convert the image to base64
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');

    console.log('Prepared for Imgur:', {
      fileName: image.name,
      fileType: image.type,
      fileSize: image.size,
      base64Length: base64.length,
      base64Start: base64.substring(0, 50) + '...'
    });

    // Try JSON upload with base64
    try {
      console.log('Attempting JSON base64 upload...');
      
      const response = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
          'Authorization': `Client-ID ${process.env.NEXT_PUBLIC_IMGUR_CLIENT_ID || 'e4cb7abdd1617a7'}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64,
          type: 'base64',
          name: image.name,
        }),
      });

      const data = await response.json();
      console.log('JSON upload response:', data);

      if (data.success) {
        console.log('JSON upload successful:', data.data.link);
        return NextResponse.json({ 
          success: true, 
          url: data.data.link 
        });
      } else {
        throw new Error(data.data?.error || 'Upload failed');
      }
    } catch (jsonUploadError) {
      console.log('JSON upload failed, trying FormData...', jsonUploadError.message);
      
      // Fallback to FormData upload
      const imgurFormData = new FormData();
      imgurFormData.append('image', base64);
      imgurFormData.append('type', 'base64');

      const response = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
          Authorization: `Client-ID ${process.env.NEXT_PUBLIC_IMGUR_CLIENT_ID || 'e4cb7abdd1617a7'}`,
        },
        body: imgurFormData,
      });

      const data = await response.json();
      console.log('FormData upload response:', data);

      if (data.success) {
        console.log('FormData upload successful:', data.data.link);
        return NextResponse.json({ 
          success: true, 
          url: data.data.link 
        });
      } else {
        console.error('All upload methods failed');
        return NextResponse.json(
          { error: data.data?.error || 'Upload failed' },
          { status: 400 }
        );
      }
    }
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 