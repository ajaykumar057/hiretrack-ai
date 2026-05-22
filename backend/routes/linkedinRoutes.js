const express = require('express');
const router = express.Router();
const { getContacts, createContact, updateContact, deleteContact, searchLinkedIn } = require('../controllers/linkedinController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.route('/search').get(searchLinkedIn);
router.route('/').get(getContacts).post(createContact);
router.route('/:id').put(updateContact).delete(deleteContact);

module.exports = router;
