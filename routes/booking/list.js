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
    const { getBookingByUserId, getAllBookings } = require("@db/booking");

    const userId = request.user.id;

    const userRole = request.user.role;

    let bookings

    if (userRole === "ADMIN") {
        bookings = await getAllBookings();
    } else if (userRole === "USER") {
        bookings = await getBookingByUserId(userId);
    }



    return reply.send(bookings);
}
