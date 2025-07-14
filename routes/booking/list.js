module.exports = (fastify, opts, next) => {
    fastify.get(
        "/",
        {
            preValidation: [fastify.authorize(["USER"])],

        },
        handler
    );

    next();
};

async function handler(request, reply) {
    const { getBookingByUserId } = require("@db/booking");

    const userId = request.user.id;

    const bookings = await getBookingByUserId(userId);


    return reply.send(bookings);
}
