module.exports = (fastify, opts, next) => {
    fastify.put(
        "/:id",
        {
            preValidation: [fastify.authorize(["TRAINER", "ADMIN"])],
            schema: {
                params: {
                    type: "object",
                    properties: {
                        id: {
                            type: "number",
                            minimum: 1,
                            errorMessage: {
                                type: "ID must be a number",
                                minimum: "ID must be greater than 0",
                            },
                        },
                    },
                    required: ["id"],
                },
                body: {
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
                        typeId: {
                            type: "number",
                            minimum: 1,
                            errorMessage: {
                                type: "Type ID must be a valid number",
                                minimum: "Type ID must be a positive number",
                            },
                        },
                        trainerId: {
                            type: "number",
                            minimum: 1,
                            errorMessage: {
                                type: "Trainer ID must be a valid number",
                                minimum: "Trainer ID must be a positive number",
                            },
                        },
                        availableSpots: {
                            type: "number",
                            minimum: 1,
                            errorMessage: {
                                type: "Available spots must be a valid integer",
                                minimum: "Available spots must be at least 1",
                            },
                        },
                    },
                    required: [
                        "startTime",
                        "endTime",
                        "typeId",
                        "trainerId",
                        "availableSpots",
                    ],
                },
            },
        },
        handler
    );

    next();
};

async function handler(request, reply) {
    const { getTrainingById, updateTraining } = require("@db/training");

    const { id } = request.params;

    const { startTime, endTime, typeId, trainerId, availableSpots } =
        request.body;

    const training = await getTrainingById(id);
    if (!training) {
        return reply.status(404).send({ details: ["Training not found"] });
    }

    if ((request.user.role == "TRAINER") && (training.trainerId !== request.user.id)) {
        return reply
            .status(403)
            .send({ details: ["You are not authorized to update this training"] });
    }

    if (new Date(startTime) >= new Date(endTime)) {
        return reply
            .status(400)
            .send({ details: ["Start time must be before end time"] });
    }
    const updatedTraining = await updateTraining(
        id,
        startTime,
        endTime,
        typeId,
        trainerId,
        availableSpots
    );
    if (!updatedTraining) {
        return reply.status(500).send({ details: ["Failed to update training"] });
    }
    return reply.status(200).send({
        details: ["Training updated successfully"],
    });
}
