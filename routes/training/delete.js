module.exports = (fastify, opts, next) => {
    fastify.delete(
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
            },
        },
        handler
    );

    next();
};

async function handler(request, reply) {
    const { getTrainingById, deleteTraining } = require("@db/training");

    const { id } = request.params;

    const training = await getTrainingById(id);
    if (!training) {
        return reply.status(404).send({ details: "Training not found" });
    }

    if ((request.user.role == "TRAINER") && (training.trainerId !== request.user.id)) {
        return reply
            .status(403)
            .send({ details: "You are not authorized to update this training" });
    }

    await deleteTraining(id);
    return reply.status(200).send({ details: "Training deleted successfully" });
}
