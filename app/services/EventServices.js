const ULID = require('ulid');
const database = require('../../config/database');
//const uploads = require('../../config/multer-gridFs')

//const multer = require('../../config/multer-gridFs');

async function getAllEvents(user_Id) {
    const collection = await database.connect('Events');
    const event = await collection.find({ user_id: user_Id.id }).toArray();

    return event;
}
async function createEvent(eventData, file_id, user_Id) {
    const collection = await database.connect('Events');
    const results = await collection.insertOne({
        image_id: file ? file_id : null,
        event_id: ULID.ulid(),
        user_id: user_Id.id,
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
    return ({ 
        image_id: file_id || null,
        user_id: user_Id.id });
}
async function getEvent(eventId, user_Id) {
    const collection = await database.connect('Events');

    const result = await collection.findOne({ 'event_id': eventId, user_id: user_Id.id });

    if (!result) {
       const error = new Error('No event found for this Id');
       error.statusCode = 404;
       throw error;
    }

    return result;
}
async function updateEvent(eventId, eventData, user_Id){
    const collection = await database.connect('Events');
    const event = await collection.findOne({event_id: eventId, user_id: user_Id.id});

    if (!event) {
        const error = new Error('No events found for this id');
        error.statusCode = 404;
        throw error;
    }
    const updatedEvent = { $set: {} };

        if (eventData.name !== undefined) updatedEvent.$set.name = eventData.name;
        if (eventData.description !== undefined) updatedEvent.$set.description = eventData.description;
        if (eventData.category !== undefined) updatedEvent.$set.category = eventData.category;
        if (eventData.location !== undefined) updatedEvent.$set.location = eventData.location;
        if (eventData.date !== undefined) updatedEvent.$set.date = eventData.date;
        if (eventData.time !== undefined) updatedEvent.$set.time = eventData.time;
        if (eventData.RSVP !== undefined) updatedEvent.$set.RSVP = eventData.RSVP;
        if (eventData.status !== undefined) updatedEvent.$set.status = eventData.status;

    const results = await collection.updateOne( {'event_id': eventId}, updatedEvent )

    return results
}
async function  deleteEvent(eventId, user_Id){
    const collection = await database.connect('Events');

    const results = await collection.deleteOne({ 'event_id': eventId, user_id: user_Id.id })

    return results
}
module.exports = {
    getAllEvents,
    createEvent,
    getEvent,
    updateEvent,
    deleteEvent
}
