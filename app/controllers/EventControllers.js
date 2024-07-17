const services = require('./../services/EventServices');
const { MongoClient, GridFSBucket } = require('mongodb');
const stream = require('stream');
//const uploads = require('../../config/upload');

const mongoURI = process.env.LOCAL_HOST || process.env.MONGODB_URI;


async function getAll(request, response) {
    try {
        const results = await services.getAllEvents()
   
        response.json({ 'data': results })
    } catch (error) {
        console.log(`Error querying database: ${error}`);
    
        response.status(500).json({ 'data': { 'error': 'Error querying database' } });
    }
}
async function create(request, response) {
    const client = new MongoClient(mongoURI);

    try {
        await client.connect();
        const db = client.db('Event_Management-App');
        const bucket = new GridFSBucket(db, { bucketName: 'uploads' });
        console.log(bucket);
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
                    const results = await services.createEvent(request.body, uploadStream.id);
                    response.status(201).json({ message: 'Event Created successfully', results });
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
        const results = await services.updateEvent(request.params.id, request.body)
   
        response.status(201).json({ message: 'Event updated successfully', results})
    } catch (error) {
        console.log(`Error querying database: ${error}`);
    
        response.status(500).json({ 'data': { 'error': 'Error querying database' } });
    }
}
async function get(request, response) {
    try {
        const results = await services.getEvent(request.params.id);

        if (results) {
            response.json({ 'data': results });

        } else{
            response.status(404).json({ message: 'Event not found'});
        }

    }   catch (error) {
        console.log(`Error querying database: ${error}`);
    
        response.status(500).json({ 'data': { 'error': 'Error querying database' } });
    }
}
async function Delete(request, response) {
    try {
        const results = await services.deleteEvent(request.params.id);

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