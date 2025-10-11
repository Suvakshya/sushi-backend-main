import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { promisify } from 'util';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config(); // Load .env variables

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Ensure uploads directory exists
const ensureUploadsDir = async () => {
  const uploadPath = path.join(__dirname, '../uploads');
  try {
    await promisify(fs.access)(uploadPath);
  } catch {
    await promisify(fs.mkdir)(uploadPath, { recursive: true });
  }
};

// Multer storage config (temporary disk storage)
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    await ensureUploadsDir();
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter for images
const imageFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (JPEG, PNG, GIF, WEBP)'), false);
  }
};

// Multer config
const baseMulterConfig = {
  storage: storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
};

// Upload middleware
export const singleUpload = (fieldName) => {
  return (req, res, next) => {
    const upload = multer(baseMulterConfig).single(fieldName);
    
    upload(req, res, (err) => {
      if (err) {
        console.error('Multer upload error:', err);
        
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({
            success: false,
            message: 'File size too large. Maximum 100MB allowed.'
          });
        }
        
        if (err.message.includes('image files')) {
          return res.status(415).json({
            success: false,
            message: 'Only image files are allowed (JPEG, PNG, GIF, WEBP)'
          });
        }
        
        return res.status(500).json({
          success: false,
          message: 'File upload failed',
          error: err.message
        });
      }
      
      // Log successful file upload
      if (req.file) {
        console.log('Uploaded file:', {
          originalname: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype,
          path: req.file.path
        });
      }
      
      next();
    });
  };
};

export const arrayUpload = (fieldName, maxCount) => multer(baseMulterConfig).array(fieldName, maxCount);

export const fieldsUpload = (fieldsConfig) => {
  return (req, res, next) => {
    const upload = multer(baseMulterConfig).fields(fieldsConfig);
    
    upload(req, res, (err) => {
      if (err) {
        console.error('Multer upload error:', err);
        
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({
            success: false,
            message: 'File size too large. Maximum 100MB allowed.'
          });
        }
        
        if (err.message.includes('image files')) {
          return res.status(415).json({
            success: false,
            message: 'Only image files are allowed (JPEG, PNG, GIF, WEBP)'
          });
        }
        
        return res.status(500).json({
          success: false,
          message: 'File upload failed',
          error: err.message
        });
      }
      
      // Log successful file uploads
      if (req.files) {
        console.log('Uploaded files:', Object.keys(req.files).map(key => ({
          field: key,
          files: req.files[key].map(f => ({
            originalname: f.originalname,
            size: f.size,
            mimetype: f.mimetype,
            path: f.path
          }))
        })));
      }
      
      next();
    });
  };
};

// Upload file to Cloudinary and delete local
export const uploadToCloudinary = async (localFilePath, folder = 'uploads') => {
  try {
    const result = await cloudinary.uploader.upload(localFilePath, { folder });
    fs.unlinkSync(localFilePath); // Delete local after upload
    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    throw new Error('Cloudinary upload failed: ' + error.message);
  }
};

// Delete file from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    throw new Error('Cloudinary delete failed: ' + error.message);
  }
};

// Get local file URL (optional if using local hosting fallback)
export const getFileUrl = (filename) => `/uploads/${filename}`;

// Extract public ID from Cloudinary URL
// export const getPublicIdFromUrl = (url) => {
//   try {
//     // Handle different Cloudinary URL formats:
//     // 1. Standard format: https://res.cloudinary.com/<cloud_name>/<resource_type>/<type>/<version>/<public_id>.<format>
//     // 2. With transformations: https://res.cloudinary.com/<cloud_name>/image/upload/<transformations>/<version>/<public_id>.<format>
//     const matches = url.match(/\/upload\/(?:[^/]+\/)*v\d+\/(.+?)\.\w+$/);
    
//     if (!matches || matches.length < 2) {
//       // Try matching URL without transformations
//       const simpleMatch = url.match(/\/upload\/v\d+\/(.+?)\.\w+$/);
//       if (simpleMatch && simpleMatch.length >= 2) {
//         return simpleMatch[1];
//       }
//       throw new Error('Invalid Cloudinary URL format');
//     }
    
//     return matches[1];
//   } catch (error) {
//     throw new Error('Failed to extract public ID from URL: ' + error.message);
//   }
// };
export const getPublicIdFromUrl = (url) => {
  try {
    if (!url) throw new Error("Empty URL provided");

    const parsed = new URL(url);
    const pathname = parsed.pathname; // e.g., /image/upload/v123456/menuItems/abc123.jpg

    const parts = pathname.split('/');
    const uploadIndex = parts.findIndex(p => p === 'upload');

    if (uploadIndex === -1 || uploadIndex + 1 >= parts.length) {
      throw new Error("Cloudinary 'upload' segment not found");
    }

    // Remove 'upload', transformations (if any), and version (starts with 'v123...')
    let publicIdParts = parts.slice(uploadIndex + 1);
    if (publicIdParts[0].startsWith('v') && !isNaN(publicIdParts[0].slice(1))) {
      publicIdParts = publicIdParts.slice(1);
    } else {
      // If there's a transformation segment, skip until you find 'v...'
      const versionIndex = publicIdParts.findIndex(part => part.startsWith('v') && !isNaN(part.slice(1)));
      if (versionIndex !== -1) {
        publicIdParts = publicIdParts.slice(versionIndex + 1);
      }
    }

    // Join back to path (e.g., 'menuItems/imageName.jpg')
    const publicIdWithExt = publicIdParts.join('/');

    // Strip extension
    const lastDot = publicIdWithExt.lastIndexOf('.');
    if (lastDot === -1) throw new Error("Extension missing in image URL");

    const publicId = publicIdWithExt.slice(0, lastDot);

    return publicId;

  } catch (err) {
    console.error("Error extracting public ID from Cloudinary URL:", url, err.message);
    return undefined; // So controller can safely handle it
  }
};
