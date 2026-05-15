const Application = require('../models/Application');
const { ApifyClient } = require('apify-client');

// @desc   Get all applications for user
// @route  GET /api/applications
// @access Private
const getApplications = async (req, res) => {
  try {
    const { status, search, sort = '-appliedDate', page = 1, limit = 50 } = req.query;

    let query = { user: req.user.id };
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { company: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Application.countDocuments(query);
    const applications = await Application.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: applications.length,
      total,
      data: applications
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Create application
// @route  POST /api/applications
// @access Private
const createApplication = async (req, res) => {
  try {
    req.body.user = req.user.id;
    const application = await Application.create(req.body);
    res.status(201).json({ success: true, data: application, message: 'Application added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Update application
// @route  PUT /api/applications/:id
// @access Private
const updateApplication = async (req, res) => {
  try {
    let application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    if (application.user.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: 'Not authorized' });

    application = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: application, message: 'Application updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Delete application
// @route  DELETE /api/applications/:id
// @access Private
const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    if (application.user.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: 'Not authorized' });

    await application.deleteOne();
    res.status(200).json({ success: true, message: 'Application deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get analytics
// @route  GET /api/applications/analytics
// @access Private
const getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    const [statusBreakdown, monthlyTrend, topCompanies, rejectionReasons] = await Promise.all([
      Application.aggregate([
        { $match: { user: require('mongoose').Types.ObjectId.createFromHexString(userId) } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Application.aggregate([
        { $match: { user: require('mongoose').Types.ObjectId.createFromHexString(userId) } },
        {
          $group: {
            _id: {
              year: { $year: '$appliedDate' },
              month: { $month: '$appliedDate' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 12 }
      ]),
      Application.aggregate([
        { $match: { user: require('mongoose').Types.ObjectId.createFromHexString(userId) } },
        { $group: { _id: '$company', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      Application.aggregate([
        { $match: { user: require('mongoose').Types.ObjectId.createFromHexString(userId), status: 'Rejected', rejectionReason: { $ne: '' } } },
        { $group: { _id: '$rejectionReason', count: { $sum: 1 } } }
      ])
    ]);

    const total = await Application.countDocuments({ user: userId });
    const offers = await Application.countDocuments({ user: userId, status: 'Offer' });
    const rejected = await Application.countDocuments({ user: userId, status: 'Rejected' });
    const interviews = await Application.countDocuments({ user: userId, status: 'Interview' });
    const active = await Application.countDocuments({ user: userId, status: { $in: ['Applied', 'OA', 'Interview'] } });

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedTrend = monthlyTrend.map(item => ({
      month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      applications: item.count
    }));

    res.status(200).json({
      success: true,
      data: {
        summary: {
          total,
          active,
          offers,
          rejected,
          interviews,
          responseRate: total > 0 ? Math.round(((total - rejected) / total) * 100) : 0,
          offerRate: total > 0 ? Math.round((offers / total) * 100) : 0,
          rejectionRate: total > 0 ? Math.round((rejected / total) * 100) : 0
        },
        statusBreakdown: statusBreakdown.map(s => ({ name: s._id, value: s.count })),
        monthlyTrend: formattedTrend,
        topCompanies: topCompanies.map(c => ({ company: c._id, count: c.count })),
        rejectionReasons: rejectionReasons.map(r => ({ reason: r._id, count: r.count }))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get heatmap data
// @route  GET /api/applications/heatmap
// @access Private
const getHeatmapData = async (req, res) => {
  try {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const data = await Application.aggregate([
      {
        $match: {
          user: require('mongoose').Types.ObjectId.createFromHexString(req.user.id),
          appliedDate: { $gte: oneYearAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$appliedDate' }
          },
          count: { $sum: 1 }
        }
      }
    ]);

    const heatmapData = data.map(item => ({
      date: item._id,
      count: item.count
    }));

    res.status(200).json({ success: true, data: heatmapData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Import LinkedIn Job
// @route  POST /api/applications/import-linkedin
// @access Private
const importLinkedInJob = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || !url.includes('linkedin.com/jobs')) {
      return res.status(400).json({ success: false, message: 'Please provide a valid LinkedIn Job URL' });
    }

    if (!process.env.APIFY_API_TOKEN || !process.env.APIFY_ACTOR_ID) {
      // Mocked behavior if token is not set
      const mockApp = await Application.create({
        user: req.user.id,
        company: 'LinkedIn Target Company',
        role: 'Imported Role via LinkedIn',
        location: 'Remote',
        status: 'Saved',
        jobLink: url,
        jobDescription: 'This is a dynamically imported job description (Mocked because APIFY token is missing). Requires knowledge in React, Node.js, and strong problem-solving skills.',
        tags: ['LinkedIn Import'],
        appliedDate: new Date()
      });
      return res.status(201).json({ success: true, data: mockApp, message: 'Job imported successfully (Mock)' });
    }

    const client = new ApifyClient({
      token: process.env.APIFY_API_TOKEN,
    });

    const input = {
      startUrls: [{ url }],
      // Common config for standard apify linkedin scraper
    };

    const run = await client.actor(process.env.APIFY_ACTOR_ID).call(input);
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    if (!items || items.length === 0) {
      return res.status(404).json({ success: false, message: 'Could not fetch job data' });
    }

    const job = items[0];

    const application = await Application.create({
      user: req.user.id,
      company: job.companyName || job.company || 'Unknown Company',
      role: job.title || job.position || 'Unknown Role',
      location: job.location || '',
      status: 'Saved',
      jobLink: url,
      jobDescription: job.description || job.text || '',
      tags: ['LinkedIn Import'],
      appliedDate: new Date()
    });

    res.status(201).json({ success: true, data: application, message: 'Job imported successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getApplications, createApplication, updateApplication, deleteApplication, getAnalytics, getHeatmapData, importLinkedInJob };
