
module.exports = (fastify, opts, next) => {
    fastify.get(
        "/getTrainingActivityByDay",
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
    const { getTrainingActivityByDay } = require("@db/report");

    const result = await getTrainingActivityByDay();

    const serializedResult = result.map(item => ({
        day_of_week: item.day_of_week,
        training_count: item.training_count.toString(),
    }));

    reply.send(serializedResult);

}
