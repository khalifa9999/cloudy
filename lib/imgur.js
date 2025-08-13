import { convertImageToSupportedFormat } from './imageConverter.js';

const uploadToImgur = async (file) => {
  try {
    // Convert WebP to PNG if needed
    const convertedFile = await convertImageToSupportedFormat(file);
    
    console.log('Uploading converted file:', {
      name: convertedFile.name,
      type: convertedFile.type,
      size: convertedFile.size
    });
    
    const formData = new FormData();
    formData.append('image', convertedFile);

    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData, // Don't set Content-Type header, let browser set it
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upload failed with response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success) {
      return data.url;
    } else {
      throw new Error(data.error || 'Upload failed');
    }
  } catch (error) {
    console.error('Image upload error:', error);
    throw error;
  }
};

export { uploadToImgur }; 