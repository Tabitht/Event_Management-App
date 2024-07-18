const services = require('./../services/Authentication')

async function register(request, response) {
    try {
        await services.registerUser(request.body)
   
        response.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.log(`Error querying database: ${error}`);
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
        const results = await services.loginUser(request.body, request.body.password)
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
async function passwordReset(request, response) {
    try {
        const results = await services.initiatePasswordReset(request.body.email)
   
        response.json({ 'data': results })
    } catch (error) {
        console.log(`Error querying database: ${error}`);
    
         response.status(500).json({
            status: 'error',
            message: error.message || 'server error',
            statusCode: error.statusCode || 500
        });
    }
}
async function completePasswordReset(request, response) {
    try {
        const results = await services.resetPassword(request.body.token, request.body.password)
   
        response.json({ 'data': results })
    } catch (error) {
        console.log(`Error querying database: ${error}`);
    
        response.status(500).json({
            status: 'error',
            message: error.message || 'server error',
            statusCode: error.statusCode || 500
        });
    }
}
module.exports = {
    register,
    login,
    passwordReset,
    completePasswordReset
}