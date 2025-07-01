

module.exports = (fastify, opts, next) => {
    fastify.get(
        "/",
        {
            preValidation: [
                fastify.authorize(["ADMIN"]),
            ],
        },
        handler
    );

    next();
};

async function handler(request, reply) {
    const { getAllUsers } = require("@db/user");

    const users = await getAllUsers();

    return reply.status(200).send(users);
}
