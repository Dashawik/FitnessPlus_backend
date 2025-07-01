

module.exports = (fastify, opts, next) => {
    fastify.delete(
        "/:id",
        {
            preValidation: [
                fastify.authorize(["ADMIN"]),
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
    const { getUserById, deleteUserJWT } = require("@db/user");

    const userId = request.params.id;


    const user = await getUserById(userId);
    if (!user) {
        return reply.status(404).send({ details: ["User not found"] });
    }
    await deleteUserJWT(userId);
    return reply.status(200).send({
        details: ["User token deleted successfully"]
    });
}
