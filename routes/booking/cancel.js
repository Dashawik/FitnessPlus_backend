module.exports = (fastify, opts, next) => {
    fastify.put(
        "/cancel/:id",
        {
            preValidation: [fastify.authorize(["USER"])],

            schema: {
                params: {
                    type: "object",
                    properties: {
                        id: {
                            type: "number",
                            minimum: 1,
                            errorMessage: {
                                type: "ID must be a number",
                                minimum: "ID must be at least 1",
                            }
                        },
                    },
                    required: ["id"],
                },
            },
        },
        handler
    );

    next();
};

async function handler(request, reply) {
    const { cancelBooking, getBookingById } = require("@db/booking");

    const { incrementSessions } = require("@db/subscription");

    const bookingId = request.params.id;
    const userId = request.user.id;

    const booking = await getBookingById(bookingId);

    if (!booking) {
        return reply.status(404).send({ details: "Booking not found" });
    }

    if (booking.userId !== userId) {
        return reply.status(403).send({ details: "You are not authorized to cancel this booking" });
    }

    await cancelBooking(bookingId);

    const now = new Date();
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    if (new Date(booking.training.startTime) > twoHoursLater) {
        await incrementSessions(bookingId);
        return reply.status(200).send({ details: "Booking cancelled and sessions incremented" });
    }

    return reply.status(200).send({ details: "Booking cancelled" });

}
