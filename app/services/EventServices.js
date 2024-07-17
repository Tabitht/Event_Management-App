const ULID = require('ulid');
const database = require('../../config/database');
//const uploads = require('../../config/multer-gridFs')

//const multer = require('../../config/multer-gridFs');

async function getAllEvents() {
    const collection = await database.connect('Events');

    return await collection.find({}).toArray()
}
async function createEvent(eventData, file_id) {
    const collection = await database.connect('Events');
    const results = await collection.insertOne({
        image_id: file_id, //file ? file.filename : null,
        id: ULID.ulid(),
        name: eventData.name,
        description: eventData.description,
        category: eventData.category,
        location: eventData.location,
        date: eventData.date,
        time: eventData.time,
        status: 'upcoming',
        RSVP: eventData.RSVP
    });
    console.log(results);
    return ({ image_id: file_id });
}
async function getEvent(eventId) {
    const collection = await database.connect('Events');

    const result = await collection.findOne({ 'id': eventId });

    return result;
}
async function updateEvent(eventId, eventData){
    const collection = await database.connect('Events');

    const results = await collection.updateOne( {'id': eventId}, {$set: eventData} )

    return results
}
async function  deleteEvent(eventId){
    const collection = await database.connect('Events');

    const results = await collection.deleteOne({ 'id': eventId })

    return results
}
module.exports = {
    getAllEvents,
    createEvent,
    getEvent,
    updateEvent,
    deleteEvent
}
