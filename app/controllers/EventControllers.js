const services = require('./../services/EventServices');
const { MongoClient, GridFSBucket } = require('mongodb');
const stream = require('stream');
//const uploads = require('../../config/upload');

const mongoURI = process.env.LOCAL_HOST || process.env.MONGODB_URI;


async function getAll(request, response) {
    try {
        const results = await services.getAllEvents(request.User)
   
        response.status(200).json({ results })
    } catch (error) {
        console.log(`Error querying database: ${error}`);
    
        
    }
}
async function create(request, response) {
    const client = new MongoClient(mongoURI);

    try {
        await client.connect();
        const db = client.db('Event_Management-App');
        const bucket = new GridFSBucket(db, { bucketName: 'uploads' });
        if (!request.file) {
            return response.status(400).json({ 'data': { 'error': 'File is required' } });
        }

        const readableStream = new stream.PassThrough();
        readableStream.end(request.file.buffer);

        const uploadStream = bucket.openUploadStream(request.file.originalname, {
            contentType: request.file.mimetype
        });

        readableStream.pipe(uploadStream)
            .on('error', (error) => {
                console.error('Error uploading file:', error);
                response.status(500).json({ 'data': { 'error': 'Error uploading file' } });
            })
            .on('finish', async () => {
                try {
                    await services.createEvent(request.body, uploadStream.id, request.User);
                    response.status(201).json({ message: 'Event Created successfully' });
                } catch (error) {
                    console.error(`Error querying database: ${error}`);
                    response.status(500).json({ 'data': { 'error': 'Error querying database' } });
                } finally {
                    client.close();
                }
            });

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        response.status(500).json({ 'data': { 'error': 'Error connecting to MongoDB' } });
    }

    /*try {
        if (!request.file) {
            return response.status(400).json({ 'data': { 'error': 'File is required' } });
        }
        const results = await services.createEvent(request.body, request.file)
        console.log(request.file);
        response.status(201).json({ message: 'Event Created successfully', results})
    } catch (error) {
        console.log(`Error querying database: ${error}`);
    
        response.status(500).json({ 'data': { 'error': 'Error querying database' } });
    }*/
};
async function update(request, response) {
    try {
        await services.updateEvent(request.params.id, request.body, request.User)
   
        response.status(201).json({ message: 'Event updated successfully'})
    } catch (error) {
        console.log(`Error querying database: ${error}`);
    
       response.status(500).json({
            status: 'error',
            message: error.message || 'server error',
            statusCode: error.statusCode || 500
        });
    }
}
async function get(request, response) {
    try {
        const results = await services.getEvent(request.params.id, request.User);

        response.status(201).json(results);

    }   catch (error) {
        console.log(`Error querying database: ${error}`);
    
        response.status(500).json({
            status: 'error',
            message: error.message || 'server error',
            statusCode: error.statusCode || 500
        });
    }
}
async function Delete(request, response) {
    try {
        const results = await services.deleteEvent(request.params.id, request.User);

        if (results) {
            response.json({ message: 'Event deleted successfully' });

        } else{
            response.status(404).json({ message: 'Event not found'});
        }
    }   catch (error) {
        console.log(`Error querying database: ${error}`);
    
        response.status(500).json({ 'data': { 'error': 'Error querying database' } });
    }
}

async function getImage(request, response) {
    const client = new MongoClient(mongoURI);

    try {
        await client.connect();
        const db = client.db('Event_Management-App');
        const bucket = new GridFSBucket(db, { bucketName: 'uploads' });

        const fileId = request.params.id;

        const downloadStream = bucket.openDownloadStream(fileId);

        downloadStream.on('error', (error) => {
            console.error('Error downloading file:', error);
            response.status(500).json({ 'data': { 'error': 'Error downloading file' } });
        });

        downloadStream.pipe(response).on('finish', () => {
            console.log('File successfully sent to client');
        });

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        response.status(500).json({ 'data': { 'error': 'Error connecting to MongoDB' } });
    } finally {
        client.close();
    }
}
module.exports = {
    getAll,
    create,
    update,
    get,
    Delete,
    getImage
}