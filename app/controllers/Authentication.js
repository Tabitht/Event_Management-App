const services = require('./../services/Authentication')

async function register(request, response) {
    try {
        const results = await services.registerUser(request.body)
   
        response.json({ 'data': results })
    } catch (error) {
        console.log(`Error querying database: ${error}`);
    
        response.status(500).json({ 'data': { 'error': 'Error querying database' } });
    }
}
async function login(request, response) {
    try {
        const results = await services.loginUser(request.body.email, request.body.password)
   
        response.json({ 'data': results })
    } catch (error) {
        console.log(`Error querying database: ${error}`);
    
        response.status(500).json({ 'data': { 'error': 'Error querying database' } });
    }
}
module.exports = {
    register,
    login
}