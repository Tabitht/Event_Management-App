const joi = require('joi');

function validatecompletePasswordReset(request, response, next) {

    const schema = joi.object({
        token: joi.string().trim().required().min(8).max(8),
        password: joi.string().trim().required().min(6).max(30),
        password_confirm: joi.ref('password')
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
module.exports = validatecompletePasswordReset;