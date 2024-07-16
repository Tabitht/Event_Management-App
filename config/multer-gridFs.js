const connectDB = require('./database');
const { GridFsBucket } = require('mongodb');
const fs = require('fs');
const path = require('path');

/**const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const { MongoClient } = require('mongodb');
//const path = require('path');*/

const uploads = async (filePath, filename) => {
  const db = await connectDB.connect();
  const bucket = new  GridFsBucket(db, { bucketName: 'eventPictures' });

  return new Promise((resolve, reject) => {
    const readableStream = fs.createReadStream(filePath);
    const uploadStream = bucket.openUploadStream(filename);

    readableStream.pipe(uploadStream);

    uploadStream.on('finish', () => {
      resolve(uploadStream.id);
    });
    uploadStream.on('error', (error) => {
      reject(error);
    });
  });
};

/**const mongoURI = process.env.LOCAL_HOST || process.env.MONGODB_URI;

const storage = new GridFsStorage({
  url: mongoURI,
  file: (request, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (error, buffer) => {
        if (error) {
          return reject(error);
        }
        const filename = buffer.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});*/

//const uploads = multer({ storage });

module.exports = uploads;
