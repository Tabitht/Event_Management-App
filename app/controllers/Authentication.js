const services = require('./../services/Authentication')

async function register(request, response) {
    try {
        const results = await services.registerUser(request.body)
   
        response.json({ 'data': results })
    } catch (error) {
        if (error.message === 'User already exists') {
            response.status(400).json({ 'error': 'User already exists' });
        } else {
            console.error(`Error registering user: ${error.message}`);
            response.status(500).json({ 'error': 'Failed to register user' });
        }
    }
}
async function login(request, response) {
    try {
        const results = await services.loginUser(request.body.email, request.body.password)
   
        response.json({ 'data': results })
    } catch (error) {
        console.log(`Error querying database: ${error}`);
    
        if (error.message === 'User credentials do not match our records') {
        
            response.status(401).json({ error: 'User credentials do not match our records' });
        } else {
            
            response.status(500).json({ error: 'Error querying database' });
        }
    }
}
module.exports = {
    register,
    login
}
