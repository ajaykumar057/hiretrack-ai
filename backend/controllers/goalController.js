const Goal = require('../models/Goal');

const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id }).sort('-createdAt');
    res.status(200).json({ success: true, data: goals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createGoal = async (req, res) => {
  try {
    req.body.user = req.user.id;
    const goal = await Goal.create(req.body);
    res.status(201).json({ success: true, data: goal, message: 'Goal created' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateGoal = async (req, res) => {
  try {
    let goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ success: false, message: 'Goal not found' });
    if (goal.user.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });

    // Check if goal completed
    if (req.body.current !== undefined && req.body.current >= goal.target) {
      req.body.completed = true;
    }

    goal = await Goal.findByIdAndUpdate(req.params.id, { ...req.body, lastUpdated: Date.now() }, { new: true });
    res.status(200).json({ success: true, data: goal, message: 'Goal updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ success: false, message: 'Goal not found' });
    if (goal.user.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });
    
    await goal.deleteOne();
    res.status(200).json({ success: true, message: 'Goal deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getGoals, createGoal, updateGoal, deleteGoal };
