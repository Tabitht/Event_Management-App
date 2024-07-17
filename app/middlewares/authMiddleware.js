const jwt = require('jsonwebtoken');
const database = require('../../config/database')

async function authenticateuser(request, response, next) {
    const authorizationHeader = request.headers.authorization;

    if (! authorizationHeader) {
        return response.status(401).json({
            'data': {
                'error': {
                    'title': 'Authentication error',
                    'message': 'Authenticate to continue'
                }
            }
        });
    }
    const collection = await database.connect('Users');

    try{
        const token = authorizationHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.APP_KEY);

        const User = await collection.findOne({ id: decoded.user_id });

        if (!User) {
            console.error('User not found for ID:', decoded.user_id);
            return response.status(401).json({
                status: 'fail',
                message: 'Unauthorized: user not found',
                statusCode: 401,
      });
    }

    request.User = User;
    next();
    } catch (error) {
     response.status(401).json({
      status: 'fail',
      message: 'Unauthorized: invalid token',
      statusCode: 401,
    });
    }
    //const token = authorizationHeader.split(' ')[1];

    /**try{
        jwt.verify(token, process.env.APP_KEY);
    } catch(error) {
        return response.status(401).json({
            'data': {
                'error': {
                    'title': 'Authentication error',
                    'message': 'Authenticate to continue'
                }
            }
        });
    }
    next();*/
}
module.exports = authenticateuser;