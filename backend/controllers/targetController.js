const Target = require('../models/Target');

// Get all targets
exports.getAllTargets = async (req, res) => {
  try {
    const targets = await Target.find().sort({ createdAt: -1 });
    res.json(targets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching targets', error: error.message });
  }
};

// Get target by ID
exports.getTargetById = async (req, res) => {
  try {
    const target = await Target.findById(req.params.id);
    if (!target) {
      return res.status(404).json({ message: 'Target not found' });
    }
    res.json(target);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching target', error: error.message });
  }
};

// Create new target
exports.createTarget = async (req, res) => {
  try {
    const { title, description, price, image, location, rating, amenities, duration } = req.body;
    
    const newTarget = new Target({
      title,
      description,
      price,
      image,
      location,
      rating,
      amenities: amenities || ['Wi-Fi', 'Breakfast', 'Parking'],
      duration: duration || '7 days'
    });

    const savedTarget = await newTarget.save();
    res.status(201).json(savedTarget);
  } catch (error) {
    res.status(400).json({ message: 'Error creating target', error: error.message });
  }
};

// Update target
exports.updateTarget = async (req, res) => {
  try {
    const updatedTarget = await Target.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedTarget) {
      return res.status(404).json({ message: 'Target not found' });
    }

    res.json(updatedTarget);
  } catch (error) {
    res.status(400).json({ message: 'Error updating target', error: error.message });
  }
};

// Delete target
exports.deleteTarget = async (req, res) => {
  try {
    const deletedTarget = await Target.findByIdAndDelete(req.params.id);
    
    if (!deletedTarget) {
      return res.status(404).json({ message: 'Target not found' });
    }

    res.json({ message: 'Target deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting target', error: error.message });
  }
};