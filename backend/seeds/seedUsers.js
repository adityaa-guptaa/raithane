import User from '../models/User.js';
import bcrypt from 'bcryptjs';

/**
 * Seed initial admin user
 * Creates a default admin account if none exists
 * 
 * Default credentials (CHANGE IN PRODUCTION):
 * Email: admin@raithane.com
 * Password: Admin@123
 */
export const seedAdmin = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ role: 'admin' });

    if (adminExists) {
      console.log('✅ Admin user already exists');
      return;
    }

    // Create default admin
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@raithane.com',
      password: 'Admin@123',
      role: 'admin',
      phone: '9999999999',
      isActive: true,
    });

    console.log('✅ Default admin user created');
    console.log('📧 Email: admin@raithane.com');
    console.log('🔑 Password: Admin@123');
    console.log('⚠️  CHANGE PASSWORD IMMEDIATELY IN PRODUCTION!');

  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
  }
};

/**
 * Seed sample delivery person
 * Creates a default delivery account for testing
 */
export const seedDeliveryPerson = async () => {
  try {
    const deliveryExists = await User.findOne({ 
      role: 'delivery',
      email: 'delivery@raithane.com' 
    });

    if (deliveryExists) {
      console.log('✅ Delivery user already exists');
      return;
    }

    const delivery = await User.create({
      name: 'Delivery Person',
      email: 'delivery@raithane.com',
      password: 'Delivery@123',
      role: 'delivery',
      phone: '8888888888',
      isActive: true,
    });

    console.log('✅ Default delivery user created');
    console.log('📧 Email: delivery@raithane.com');
    console.log('🔑 Password: Delivery@123');

  } catch (error) {
    console.error('❌ Error seeding delivery person:', error.message);
  }
};
