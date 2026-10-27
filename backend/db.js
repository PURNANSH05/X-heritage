import mongoose from 'mongoose';
import { sites } from './data/sites.js';
import Site from './models/Site.js';

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is missing. Copy .env.example to .env and set your MongoDB connection string.');
  }

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000
  });
  console.log(`MongoDB connected: ${mongoose.connection.name}`);

  // Add the bundled catalog only when a site is not already in MongoDB.
  // This makes the initial setup useful while preserving later database edits.
  await Site.bulkWrite(
    sites.map((site) => ({
      updateOne: {
        filter: { id: site.id },
        update: { $setOnInsert: site },
        upsert: true
      }
    })),
    { ordered: false }
  );

  console.log(`Heritage catalog ready (${sites.length} bundled records checked)`);
}
