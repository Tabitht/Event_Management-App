const joi = require('joi');

function validateLogin(request, response, next) {

    const schema = joi.object({
        email: joi.string().trim().required().email(),
        password: joi.string().trim().required()
    });

    const { error } = schema.validate(request.body, { abortEarly: false});

    if (error) {
        const errorDetails = error.details.map(function(detail) {
            const message = detail.message.split('"')[2].trim();

            const key = detail.context.key;

            return { [key]: `The ${key} field ${message}` };
        });

        return response.status(422).json({
            'data': {
                'error': {
                    'title': 'validation error',
                    'message': errorDetails
                }
            }
        });
    }
    next();
}
module.exports = validateLogin;