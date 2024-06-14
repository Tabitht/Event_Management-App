const ULID = require('ulid');
const database = require('../../config/database');
async function getAllEvents() {
    const collection = await database.connect('Events');

    return await collection.find({}).toArray()
}
async function createEvent(eventData) {
    const collection = await database.connect('Events');

    const results = await collection.insertOne({
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

    return results;
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
