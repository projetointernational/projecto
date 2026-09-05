import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

export async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder: string = 'projecto'
): Promise<{ url: string; public_id: string; secure_url: string }> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: `projecto/${folder}`,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error('Cloudinary upload returned no result'));
          } else {
            resolve({
              url: result.url,
              public_id: result.public_id,
              secure_url: result.secure_url,
            });
          }
        }
      )
      .end(fileBuffer);
  });
}
