const Resume = require('../models/Resume');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// @desc    Get all resumes for user
// @route   GET /api/resumes
// @access  Private
const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id }).sort('-createdAt');
    res.status(200).json({ success: true, data: resumes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload new resume
// @route   POST /api/resumes
// @access  Private
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const { targetRole, notes } = req.body;

    // Upload to Cloudinary using a stream
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'raw', folder: 'hiretrack_resumes' },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ success: false, message: 'Cloudinary upload failed' });
        }

        // Create resume in DB
        const resume = await Resume.create({
          user: req.user.id,
          name: req.file.originalname,
          url: result.secure_url,
          publicId: result.public_id,
          fileSize: req.file.size,
          targetRole: targetRole || 'Unspecified',
          notes: notes || '',
          isDefault: (await Resume.countDocuments({ user: req.user.id })) === 0 // Make default if first one
        });

        res.status(201).json({ success: true, data: resume });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a resume
// @route   DELETE /api/resumes/:id
// @access  Private
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    if (resume.user.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });

    if (resume.publicId) {
      await cloudinary.uploader.destroy(resume.publicId, { resource_type: 'raw' });
    }

    await resume.deleteOne();
    res.status(200).json({ success: true, message: 'Resume deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Set resume as default
// @route   PUT /api/resumes/:id/default
// @access  Private
const setDefaultResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    if (resume.user.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });

    // Unset current default
    await Resume.updateMany({ user: req.user.id }, { isDefault: false });
    
    // Set new default
    resume.isDefault = true;
    await resume.save();

    res.status(200).json({ success: true, data: resume });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getResumes, uploadResume, deleteResume, setDefaultResume };
