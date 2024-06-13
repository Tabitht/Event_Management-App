const services = require('./../services/EventServices')

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
    try {
        const results = await services.createEvent(request.body)
   
        response.status(201).json({ message: 'Event Created successfully', results})
    } catch (error) {
        console.log(`Error querying database: ${error}`);
    
        response.status(500).json({ 'data': { 'error': 'Error querying database' } });
    }
}
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

module.exports = {
    getAll,
    create,
    update,
    get,
    Delete
}