module.exports = (fastify, opts, next) => {
    fastify.get(
        "/confirm",
        {
            schema: {
                querystring: {
                    type: "object",
                    properties: {
                        token: {
                            type: "string",
                            minLength: 64,
                            maxLength: 128,
                            errorMessage: {
                                type: "Token must be a string",
                                minLength: "Token must be at least 64 characters long",
                                maxLength: "Token must be no more than 128 characters long"
                            }
                        }
                    },
                    required: ["token"],
                },
            }
        },
        handler
    );

    next();
};

async function handler(request, reply) {
    const { getTokenInfo, deleteByUserIdAndType } = require("@db/token");
    const { updateVerification } = require("@db/user");

    const { token } = request.query;

    const tokenInfo = await getTokenInfo(token);

    if (!tokenInfo) {
        return reply.status(404).send({ details: ["Token not found"] });
    }

    if (tokenInfo.type !== "VERIFICATION") {
        return reply.status(400).send({ details: ["Invalid token type"] });
    }

    await updateVerification(tokenInfo.userId, true);
    await deleteByUserIdAndType(tokenInfo.userId, "VERIFICATION");
    return reply.status(200).send({ details: ["User verified successfully"] });
}
