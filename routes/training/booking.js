module.exports = (fastify, opts, next) => {
    fastify.get(
        "/booking/:id",
        {
            preValidation: [
                fastify.authorize(["ADMIN", "TRAINER"]),
            ],
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

    const { getBookingByTrainingId } = require("@db/booking");

    const { id } = request.params;

    console.log("Fetching bookings for training ID:", id);


    const bookings = await getBookingByTrainingId(id);


    return reply.send(bookings);
}
