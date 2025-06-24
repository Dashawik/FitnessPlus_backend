module.exports = (fastify, opts, next) => {
    fastify.get(
        "/refresh",
        {
            preValidation: fastify.authenticateRefresh,
            schema: {
                headers: {
                    type: "object",
                    properties: {
                        authorization: {
                            type: "string",
                        },
                    },
                    required: ["authorization"],
                },
            },
        },
        handler(fastify)
    );

    next();
};

function handler(fastify) {
    return async function (request, reply) {
        const jwt = require("@db/jwt");
        const findedToken = await jwt.getJWTByUserId(request.user.id);
        if (!findedToken) {
            return reply.status(404).send({ message: "Token not found." });
        }
        if (findedToken.token != request.token) {
            return reply.status(401).send({ message: "Auth error." });
        }
        const { accessToken, data } = await fastify.generateAccess(
            request.user.id
        );

        return reply
            .status(200)
            .send({ ...data, accessToken: `Bearer ${accessToken}` });
    };
}
