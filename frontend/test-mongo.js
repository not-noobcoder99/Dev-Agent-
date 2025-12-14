// Test MongoDB Connection
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  console.log('🔍 Testing MongoDB connection...');
  console.log('Connection string:', process.env.MONGODB_URI?.replace(/:[^:@]+@/, ':****@'));
  
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ MONGODB_URI not found in environment variables');
    process.exit(1);
  }

  const client = new MongoClient(uri, {
    serverApi: {
      version: '1',
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    console.log('⏳ Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Successfully connected to MongoDB!');
    
    // Test database access
    const db = client.db('devagent');
    const collections = await db.listCollections().toArray();
    console.log('📁 Available collections:', collections.map(c => c.name));
    
    // Test write access
    const testCollection = db.collection('_connection_test');
    await testCollection.insertOne({ test: true, timestamp: new Date() });
    console.log('✅ Write test successful!');
    
    await testCollection.deleteOne({ test: true });
    console.log('✅ Delete test successful!');
    
    console.log('\n🎉 MongoDB connection is working perfectly!');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('Error:', error.message);
    
    if (error.message.includes('SSL') || error.message.includes('TLS')) {
      console.error('\n💡 SSL/TLS Error - Possible fixes:');
      console.error('   1. Check if your IP is whitelisted in MongoDB Atlas Network Access');
      console.error('   2. Verify your database username and password');
      console.error('   3. Make sure the connection string is correct');
    } else if (error.message.includes('authentication')) {
      console.error('\n💡 Authentication Error:');
      console.error('   - Check your database username and password');
      console.error('   - Verify user has proper permissions in Database Access');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('\n💡 DNS Error:');
      console.error('   - Check your internet connection');
      console.error('   - Verify the cluster hostname is correct');
    }
    
    process.exit(1);
  } finally {
    await client.close();
  }
}

testConnection();
