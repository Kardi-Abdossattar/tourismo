const mongoose = require('mongoose');
const Target = require('./backend/models/Target');

// High-quality image URLs for each destination (2 per location)
const imageUpdates = {
  'Jemaa el-Fnaa': {
    image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?q=80&w=2070&auto=format&fit=crop',
    smallImage: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?q=80&w=800&auto=format&fit=crop'
  },
  'Chefchaouen': {
    image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?q=80&w=2070&auto=format&fit=crop',
    smallImage: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?q=80&w=800&auto=format&fit=crop'
  },
  'Sahara Desert': {
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=2069&auto=format&fit=crop',
    smallImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=800&auto=format&fit=crop'
  },
  'Eiffel Tower': {
    image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=80&w=2070&auto=format&fit=crop',
    smallImage: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=80&w=800&auto=format&fit=crop'
  },
  'Taj Mahal': {
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2071&auto=format&fit=crop',
    smallImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=800&auto=format&fit=crop'
  },
  'Statue of Liberty': {
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop',
    smallImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=800&auto=format&fit=crop'
  },
  'Sydney Opera House': {
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop',
    smallImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop'
  },
  'Angkor Wat': {
    image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=2070&auto=format&fit=crop',
    smallImage: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=800&auto=format&fit=crop'
  },
  'Acropolis of Athens': {
    image: 'https://images.unsplash.com/photo-1555993539-1732b0258235?q=80&w=2070&auto=format&fit=crop',
    smallImage: 'https://images.unsplash.com/photo-1555993539-1732b0258235?q=80&w=800&auto=format&fit=crop'
  },
  'Colosseum': {
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=2096&auto=format&fit=crop',
    smallImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800&auto=format&fit=crop'
  },
  'Christ the Redeemer': {
    image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=2070&auto=format&fit=crop',
    smallImage: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=800&auto=format&fit=crop'
  },
  'Stonehenge': {
    image: 'https://images.unsplash.com/photo-1599833975787-5c143f373c30?q=80&w=2070&auto=format&fit=crop',
    smallImage: 'https://images.unsplash.com/photo-1599833975787-5c143f373c30?q=80&w=800&auto=format&fit=crop'
  },
  'Great Wall of China': {
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=2070&auto=format&fit=crop',
    smallImage: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=800&auto=format&fit=crop'
  },
  'Sagrada Familia': {
    image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=2070&auto=format&fit=crop',
    smallImage: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=800&auto=format&fit=crop'
  },
  'Machu Picchu': {
    image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=2076&auto=format&fit=crop',
    smallImage: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=800&auto=format&fit=crop'
  },
  'Pyramids of Giza': {
    image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?q=80&w=2070&auto=format&fit=crop',
    smallImage: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?q=80&w=800&auto=format&fit=crop'
  },
  'Grand Canyon': {
    image: 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?q=80&w=2070&auto=format&fit=crop',
    smallImage: 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?q=80&w=800&auto=format&fit=crop'
  },
  'Petra': {
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop',
    smallImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=800&auto=format&fit=crop'
  }
};

// Better curated high-quality images
const betterImages = {
  'Jemaa el-Fnaa': {
    image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    smallImage: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3'
  },
  'Chefchaouen': {
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    smallImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3'
  },
  'Sahara Desert': {
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3',
    smallImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3'
  },
  'Eiffel Tower': {
    image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    smallImage: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3'
  },
  'Taj Mahal': {
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3',
    smallImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3'
  },
  'Statue of Liberty': {
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    smallImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3'
  },
  'Sydney Opera House': {
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    smallImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3'
  },
  'Angkor Wat': {
    image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    smallImage: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3'
  },
  'Acropolis of Athens': {
    image: 'https://images.unsplash.com/photo-1555993539-1732b0258235?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    smallImage: 'https://images.unsplash.com/photo-1555993539-1732b0258235?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3'
  },
  'Colosseum': {
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=2096&auto=format&fit=crop&ixlib=rb-4.0.3',
    smallImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3'
  },
  'Christ the Redeemer': {
    image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    smallImage: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3'
  },
  'Stonehenge': {
    image: 'https://images.unsplash.com/photo-1599833975787-5c143f373c30?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    smallImage: 'https://images.unsplash.com/photo-1599833975787-5c143f373c30?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3'
  },
  'Great Wall of China': {
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    smallImage: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3'
  },
  'Sagrada Familia': {
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    smallImage: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3'
  },
  'Machu Picchu': {
    image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.0.3',
    smallImage: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3'
  },
  'Pyramids of Giza': {
    image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    smallImage: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3'
  },
  'Grand Canyon': {
    image: 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    smallImage: 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3'
  },
  'Petra': {
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    smallImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3'
  }
};

async function updateTargetImages() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/tourismo', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Get all targets
    const targets = await Target.find({});
    console.log(`Found ${targets.length} targets`);

    let updatedCount = 0;

    // Update each target with new images
    for (const target of targets) {
      const imageData = betterImages[target.title];
      
      if (imageData) {
        await Target.findByIdAndUpdate(target._id, {
          image: imageData.image,
          smallImage: imageData.smallImage
        });
        
        console.log(`Updated images for: ${target.title}`);
        updatedCount++;
      } else {
        console.log(`No image data found for: ${target.title}`);
      }
    }

    console.log(`\nUpdate complete! Updated ${updatedCount} targets with new images.`);
    
  } catch (error) {
    console.error('Error updating images:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the update
updateTargetImages();
