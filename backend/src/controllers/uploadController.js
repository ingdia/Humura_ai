const cloudinary = require('../config/cloudinary');

// @desc    Upload an image
// @route   POST /api/uploads/image
// @access  Private
const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  // Use upload_stream to upload from buffer
  const uploadStream = cloudinary.uploader.upload_stream(
    { folder: 'humura_ai_uploads' },
    (error, result) => {
      if (error) {
        console.error('Error uploading to Cloudinary:', error);
        return res.status(500).json({ error: 'Failed to upload image' });
      }

      res.status(201).json({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }
  );

  // Write buffer to stream
  uploadStream.end(req.file.buffer);
};

module.exports = {
  uploadImage,
};
