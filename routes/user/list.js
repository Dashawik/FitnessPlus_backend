module.exports = (fastify, opts, next) => {
    fastify.get(
        "/",
        {
            preValidation: [fastify.authorize(["ADMIN"])],
            schema: {
                querystring: {
                    type: "object",
                    properties: {
                        filter: {
                            type: "string",
                            minLength: 2,
                            maxLength: 32,
                            errorMessage: {
                                type: "Filter must be a string",
                                minLength: "Filter must be at least 2 characters long",
                                maxLength: "Filter must be no more than 32 characters long",
                            },
                        },
                    },
                },
            },
        },
        handler
    );

    next();
};

async function handler(request, reply) {
    const { getAllUsers, getTrainerUsers } = require("@db/user");

    const { filter } = request.query;

    let users;

    if (filter == "TRAINER") users = await getTrainerUsers();
    else users = await getAllUsers();

    return reply.status(200).send(users);
}
