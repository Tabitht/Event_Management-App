const joi = require('joi');

function validateRequest(request, response, next) {

    const schema = joi.object({
        name: joi.string().trim().required(),
        description: joi.string().trim().optional().allow(''),
        location: joi.string().trim().required(),
        category: joi.string().trim().required(),
        date: joi.string().trim().required(),
        time: joi.string().trim().required(),
        RSVP: joi.string().trim().optional().allow('')
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
module.exports = validateRequest;
