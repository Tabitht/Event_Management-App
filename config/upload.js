const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;


/*const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const crypto = require('node:crypto');
const path = require('path');
const { MongoClient } = require('mongodb');

const mongoURI = process.env.LOCAL_HOST || process.env.MONGODB_URI;

const storage = new GridFsStorage({
  url: mongoURI,
  file: (request, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (error, buffer) => {
        if (error) {
          console.error("Error generating random bytes:", err);
          return reject(error);
        }
        const filename = buffer.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        console.log('Generated file info:', fileInfo);
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

module.exports = upload;*/
