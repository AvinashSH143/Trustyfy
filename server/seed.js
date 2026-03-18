import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Provider from './models/Provider.js';
import connectDB from './config/db.js';

dotenv.config({ path: './backend/.env' });

const seedData = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Provider.deleteMany();
    await Provider.createIndexes();

    console.log('Cleaning existing data...');

    // Create 3 Test Customers + 1 Admin
    const customers = [
      { name: 'Alice Customer', email: 'alice@example.com', password: 'Password123', location: { type: 'Point', coordinates: [-122.4194, 37.7749] } },
      { name: 'Bob Customer', email: 'bob@example.com', password: 'Password123', location: { type: 'Point', coordinates: [-122.4224, 37.7849] } },
      { name: 'Charlie Customer', email: 'charlie@example.com', password: 'Password123', location: { type: 'Point', coordinates: [-122.4094, 37.7649] } },
      { name: 'System Admin', email: 'shrishailp209@gmail.com', password: 'PASSWORD123', role: 'admin', location: { type: 'Point', coordinates: [-122.4194, 37.7749] } }
    ];
    await User.create(customers);
    console.log('Created 3 test customers and 1 admin.');

    // Create 20 Providers
    const serviceTypes = ['Electrician', 'Plumber', 'Mechanic', 'Gardener', 'Carpenter', 'Painter'];
    const names = [
      'Quick Fix Solutions', 'Elite Electric', 'Master Plumbers', 'Green Thumb Gardening',
      'The Wood Artisan', 'Color Splash Painting', 'Precision Mechanics', 'Sparky Joe',
      'Flow State Plumbing', 'Nature\'s Best', 'Hammers & Nails', 'Pure Hue Painting',
      'Torque Specialists', 'Current Connect', 'Drain Doctors', 'Evergreen Care',
      'Crafty Carpentry', 'Vibrant Walls', 'Gearhead Garage', 'Volt Masters'
    ];

    const providers = names.map((name, i) => {
      // Vary coordinates slightly around SF
      const latOffset = (Math.random() - 0.5) * 0.05;
      const lngOffset = (Math.random() - 0.5) * 0.05;

      return {
        name,
        email: `pro${i + 1}@example.com`,
        password: 'Password123', // Matches regex: Min 8 chars, 1 letter, 1 number
        serviceType: serviceTypes[i % serviceTypes.length],
        serviceAreas: ['Downtown', 'Richmond', 'Sunset', 'SoMa'].slice(0, Math.floor(Math.random() * 3) + 1),
        isAvailable: Math.random() > 0.3,
        isApproved: i < 15, // Approve first 15 providers, leave 5 for testing approval
        trustScore: Math.floor(Math.random() * 41) + 60, // 60-100 range
        location: {
          type: 'Point',
          coordinates: [-122.4194 + lngOffset, 37.7749 + latOffset]
        }
      };
    });

    await Provider.create(providers);
    console.log(`Successfully seeded 20 providers (15 approved, 5 pending).`);

    console.log('\n--- SEEDING COMPLETE ---');
    console.log('Admin: shrishailp209@gmail.com / PASSWORD123');
    console.log('Customers: alice@example.com, bob@example.com / Password123');
    console.log('Providers: pro1@example.com / Password123');
    process.exit();
  } catch (error) {
    console.error(`Error seeding data: ${error.message}`);
    process.exit(1);
  }
};

seedData();
