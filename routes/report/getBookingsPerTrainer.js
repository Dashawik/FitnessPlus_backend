
module.exports = (fastify, opts, next) => {
    fastify.get(
        "/getBookingsPerTrainer",
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
    const { getBookingsPerTrainer } = require("@db/report");

    const result = await getBookingsPerTrainer();

    const serializedResult = result.map(item => ({
        firstName: item.firstName,
        lastName: item.lastName,
        booking_count: item.booking_count.toString(),
    }));

    reply.send(serializedResult);

}
