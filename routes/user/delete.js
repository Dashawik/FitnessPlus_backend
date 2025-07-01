

module.exports = (fastify, opts, next) => {
    fastify.delete(
        "/:id",
        {
            preValidation: [
                fastify.authorize(["ADMIN", "TRAINER", "USER"]),
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
    const { getUserById, deleteUser } = require("@db/user");

    const userId = request.params.id;


    if ((request.user.role == "USER" || request.user.role == "TRAINER") && (userId != request.user.id)) {
        return reply.status(403).send({ details: ["You can only delete your own user data"] });
    }

    const user = await getUserById(userId);
    if (!user) {
        return reply.status(404).send({ details: ["User not found"] });
    }

    await deleteUser(userId);

    return reply.status(200).send({
        details: ["User deleted successfully"]
    });

}
