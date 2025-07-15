
module.exports = (fastify, opts, next) => {
    fastify.get(
        "/getPopularTrainingTypes",
        {
            preValidation: [
                fastify.authorize(["ADMIN", "TRAINER",]),
            ],

        },
        handler
    );

    next();
};

async function handler(request, reply) {
    const { getPopularTrainingTypes } = require("@db/report");

    const popularTrainingTypes = await getPopularTrainingTypes();

    const serializedResult = popularTrainingTypes.map(item => ({
        training_type: item.training_type,
        booking_count: item.booking_count.toString(),
        percentage: item.percentage
    }));

    return reply.status(200).send(serializedResult);

}
