const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('✅ MongoDB Connected');

    // Clear existing users (optional)
    // await User.deleteMany({});

    // Create test users
    const testUsers = [
      {
        username: 'testuser',
        email: 'test@example.com',
        password: 'test123',
        role: 'user'
      },
      {
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
      }
    ];

    for (const userData of testUsers) {
      const existing = await User.findOne({ username: userData.username });
      if (!existing) {
        const user = new User(userData);
        await user.save();
        console.log(`✅ Created user: ${userData.username}`);
      } else {
        console.log(`⚠️  User already exists: ${userData.username}`);
      }
    }

    // List all users
    const allUsers = await User.find({}, { password: 0 });
    console.log('\n📋 All users in database:');
    allUsers.forEach(user => {
      console.log(`  - ${user.username} (${user.email}) - Role: ${user.role}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
}

seedDatabase();
