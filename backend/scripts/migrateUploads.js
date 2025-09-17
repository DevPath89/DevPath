const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const OurTeam = require('../models/OurTeam');
require('dotenv').config(); // read .env

// Cloudinary configuration from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const uploadsDir = path.join(__dirname, '..', 'uploads');
  const files = fs.readdirSync(uploadsDir);

  for (const file of files) {
    const localPath = path.join(uploadsDir, file);

    const res = await cloudinary.uploader.upload(localPath, {
      folder: 'devpath/ourteam'
    });

    // Update DB
    await OurTeam.updateMany(
      { image: file },
      { image: res.secure_url, imagePublicId: res.public_id }
    );

    console.log('Migrated', file);
  }

  console.log('✅ Migration complete!');
  process.exit(0);
})();
