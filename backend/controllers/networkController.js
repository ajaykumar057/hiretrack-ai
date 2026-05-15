const Network = require('../models/Network');

const getContacts = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = { user: req.user.id };
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }
    const contacts = await Network.find(query).sort('-createdAt');
    res.status(200).json({ success: true, count: contacts.length, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createContact = async (req, res) => {
  try {
    req.body.user = req.user.id;
    const contact = await Network.create(req.body);
    res.status(201).json({ success: true, data: contact, message: 'Contact added' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateContact = async (req, res) => {
  try {
    let contact = await Network.findById(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
    if (contact.user.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });
    
    contact = await Network.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: contact, message: 'Contact updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteContact = async (req, res) => {
  try {
    const contact = await Network.findById(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
    if (contact.user.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });
    
    await contact.deleteOne();
    res.status(200).json({ success: true, message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getContacts, createContact, updateContact, deleteContact };
