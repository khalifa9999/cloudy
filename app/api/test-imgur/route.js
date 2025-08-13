import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test Imgur API connectivity
    const response = await fetch('https://api.imgur.com/3/credits', {
      method: 'GET',
      headers: {
        'Authorization': `Client-ID ${process.env.NEXT_PUBLIC_IMGUR_CLIENT_ID || 'e4cb7abdd1617a7'}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({
        success: false,
        error: errorData.data?.error || 'API test failed',
        status: response.status,
        clientId: process.env.NEXT_PUBLIC_IMGUR_CLIENT_ID || 'e4cb7abdd1617a7'
      });
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      credits: data.data,
      clientId: process.env.NEXT_PUBLIC_IMGUR_CLIENT_ID || 'e4cb7abdd1617a7'
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      clientId: process.env.NEXT_PUBLIC_IMGUR_CLIENT_ID || 'e4cb7abdd1617a7'
    });
  }
} 