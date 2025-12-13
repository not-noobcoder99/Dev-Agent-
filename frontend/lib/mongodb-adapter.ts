import clientPromise from './db';
import bcrypt from 'bcryptjs';

export interface User {
  _id?: string;
  email: string;
  name?: string;
  image?: string;
  password?: string;
  apiKeys?: {
    togetherAI?: string;
    codeRabbit?: string;
    oumi?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export class MongoDBAdapter {
  static async getUser(email: string): Promise<User | null> {
    const client = await clientPromise;
    const db = client.db('devagent');
    const user = await db.collection<User>('users').findOne({ email });
    return user;
  }

  static async createUser(userData: Partial<User>): Promise<User> {
    const client = await clientPromise;
    const db = client.db('devagent');
    
    const user: User = {
      email: userData.email!,
      name: userData.name,
      image: userData.image,
      password: userData.password,
      apiKeys: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('users').insertOne(user as any);
    return { ...user, _id: result.insertedId.toString() };
  }

  static async updateUser(email: string, updates: Partial<User>): Promise<User | null> {
    const client = await clientPromise;
    const db = client.db('devagent');
    
    const result = await db.collection<User>('users').findOneAndUpdate(
      { email },
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    return result || null;
  }

  static async updateApiKeys(email: string, apiKeys: User['apiKeys']): Promise<boolean> {
    const client = await clientPromise;
    const db = client.db('devagent');
    
    const result = await db.collection('users').updateOne(
      { email },
      { $set: { apiKeys, updatedAt: new Date() } }
    );

    return result.modifiedCount > 0;
  }

  static async getApiKeys(email: string): Promise<User['apiKeys'] | null> {
    const user = await this.getUser(email);
    return user?.apiKeys || null;
  }

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  // Email verification
  static async setVerificationToken(email: string, token: string): Promise<boolean> {
    const db = (await clientPromise).db()
    const result = await db.collection('users').updateOne(
      { email },
      { 
        $set: { 
          verificationToken: token,
          updatedAt: new Date()
        } 
      }
    )
    return result.modifiedCount > 0
  }

  static async verifyEmail(token: string): Promise<boolean> {
    const db = (await clientPromise).db()
    const result = await db.collection('users').updateOne(
      { verificationToken: token },
      { 
        $set: { 
          emailVerified: true,
          updatedAt: new Date()
        },
        $unset: {
          verificationToken: ''
        }
      }
    )
    return result.modifiedCount > 0
  }

  // Password reset
  static async setResetToken(email: string, token: string, expiry: Date): Promise<boolean> {
    const db = (await clientPromise).db()
    const result = await db.collection('users').updateOne(
      { email },
      { 
        $set: { 
          resetToken: token,
          resetTokenExpiry: expiry,
          updatedAt: new Date()
        } 
      }
    )
    return result.modifiedCount > 0
  }

  static async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const db = (await clientPromise).db()
    const user = await db.collection('users').findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }
    })

    if (!user) return false

    const hashedPassword = await this.hashPassword(newPassword)
    const result = await db.collection('users').updateOne(
      { resetToken: token },
      { 
        $set: { 
          password: hashedPassword,
          updatedAt: new Date()
        },
        $unset: {
          resetToken: '',
          resetTokenExpiry: ''
        }
      }
    )
    return result.modifiedCount > 0
  }

  // User preferences
  static async updatePreferences(email: string, preferences: any): Promise<boolean> {
    const db = (await clientPromise).db()
    const result = await db.collection('users').updateOne(
      { email },
      { 
        $set: { 
          preferences,
          updatedAt: new Date()
        } 
      }
    )
    return result.modifiedCount > 0
  }

  static async getPreferences(email: string): Promise<any> {
    const db = (await clientPromise).db()
    const user = await db.collection('users').findOne(
      { email },
      { projection: { preferences: 1 } }
    )
    return user?.preferences || {}
  }
}
