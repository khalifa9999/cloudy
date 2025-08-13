// Image conversion utilities for WebP support

export const convertWebPToPNG = (file) => {
  return new Promise((resolve, reject) => {
    if (file.type !== 'image/webp') {
      resolve(file); // Return original file if not WebP
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Set canvas dimensions
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image on canvas
      ctx.drawImage(img, 0, 0);

      // Convert to PNG blob
      canvas.toBlob((blob) => {
        // Create a new file with PNG extension
        const pngFile = new File([blob], file.name.replace(/\.webp$/i, '.png'), {
          type: 'image/png',
          lastModified: Date.now(),
        });
        resolve(pngFile);
      }, 'image/png');
    };

    img.onerror = () => {
      reject(new Error('Failed to load WebP image'));
    };

    // Load the WebP image
    img.src = URL.createObjectURL(file);
  });
};

export const convertImageToSupportedFormat = async (file) => {
  const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  
  console.log('Converting image:', {
    name: file.name,
    type: file.type,
    size: file.size
  });
  
  if (supportedTypes.includes(file.type)) {
    console.log('File already in supported format');
    return file; // Already supported
  }

  if (file.type === 'image/webp') {
    try {
      console.log('Converting WebP to PNG...');
      const convertedFile = await convertWebPToPNG(file);
      console.log('WebP conversion successful:', {
        originalName: file.name,
        convertedName: convertedFile.name,
        originalType: file.type,
        convertedType: convertedFile.type,
        originalSize: file.size,
        convertedSize: convertedFile.size
      });
      return convertedFile;
    } catch (error) {
      console.error('WebP conversion failed:', error);
      throw new Error('Failed to convert WebP image to supported format');
    }
  }

  throw new Error(`Unsupported file type: ${file.type}`);
}; 