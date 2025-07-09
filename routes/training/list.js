module.exports = (fastify, opts, next) => {
    fastify.get(
        "/",
        {
            preValidation: [fastify.authorize(["USER", "TRAINER", "ADMIN"])],
            schema: {
                querystring: {
                    type: "object",
                    properties: {
                        startTime: {
                            type: "string",
                            format: "date-time",
                            errorMessage: {
                                type: "Start time must be a valid date-time string",
                                format: "Start time must be a valid date-time string",
                            },
                        },
                        endTime: {
                            type: "string",
                            format: "date-time",
                            errorMessage: {
                                type: "End time must be a valid date-time string",
                                format: "End time must be a valid date-time string",
                            },
                        },
                    },
                    required: ["startTime", "endTime"],
                },
            },
        },
        handler
    );

    next();
};

async function handler(request, reply) {
    const { getByDate } = require("@db/training");

    const { getBookedSpots } = require("@db/booking");

    const { startTime, endTime } = request.query;

    if (startTime >= endTime) {
        return reply.status(400).send({
            details: ["Start time must be before end time"],
        });
    }

    let trainings;

    if (request.user.role === "TRAINER") {
        trainings = await getByDate(
            new Date(startTime),
            new Date(endTime),
            request.user.id
        );
    } else {
        trainings = await getByDate(new Date(startTime), new Date(endTime));
    }

    trainings = await Promise.all(
        trainings.map(async (training) => {
            const usedSpots = await getBookedSpots(training.id);
            return {
                ...training,
                usedSpots,
            };
        })
    );

    return reply.send(trainings);
}
