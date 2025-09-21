const Target = require('../models/Target');

// Get all targets with advanced filtering and sorting
exports.getAllTargets = async (req, res) => {
  try {
    const {
      search,
      minPrice,
      maxPrice,
      minRating,
      maxRating,
      countries,
      featured,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 50
    } = req.query;

    // Build filter object
    let filter = {};

    // Search filter (title, location, description, country)
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { title: searchRegex },
        { location: searchRegex },
        { description: searchRegex },
        { country: searchRegex }
      ];
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = parseFloat(maxPrice);
    }

    // Rating range filter
    if (minRating !== undefined || maxRating !== undefined) {
      filter.rating = {};
      if (minRating !== undefined) filter.rating.$gte = parseFloat(minRating);
      if (maxRating !== undefined) filter.rating.$lte = parseFloat(maxRating);
    }

    // Countries filter
    if (countries) {
      const countryList = Array.isArray(countries) ? countries : countries.split(',');
      filter.country = { $in: countryList };
    }

    // Featured filter
    if (featured !== undefined) {
      filter.featured = featured === 'true';
    }

    // Build sort object
    let sort = {};
    const validSortFields = ['title', 'price', 'rating', 'location', 'createdAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortDirection = sortOrder === 'asc' ? 1 : -1;
    sort[sortField] = sortDirection;

    // Execute query with pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [targets, total] = await Promise.all([
      Target.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNum),
      Target.countDocuments(filter)
    ]);

    res.json({
      targets,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      hasMore: skip + targets.length < total
    });
  } catch (error) {
    console.error('Error fetching targets:', error);
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