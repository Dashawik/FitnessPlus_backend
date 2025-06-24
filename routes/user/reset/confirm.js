module.exports = (fastify, opts, next) => {
    fastify.post(
        "/confirm",
        {
            schema: {
                body: {
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
                        },
                        password: {
                            type: "string",
                            minLength: 6,
                            maxLength: 64,
                            errorMessage: {
                                type: "Password must be a string",
                                minLength: "Password must be at least 6 characters long",
                                maxLength: "Password must be no more than 64 characters long",
                            },
                        },
                    },
                    required: ["token", "password"],
                },
            }
        },
        handler
    );

    next();
};

async function handler(request, reply) {
    const bcrypt = require("bcrypt");

    const { getTokenInfo, deleteByUserIdAndType } = require("@db/token");
    const { updatePassword } = require("@db/user");

    const { token, password } = request.body;

    const tokenInfo = await getTokenInfo(token);

    if (!tokenInfo) {
        return reply.status(404).send({ details: ["Token not found"] });
    }

    if (tokenInfo.type !== "RESET") {
        return reply.status(400).send({ details: ["Invalid token type"] });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await updatePassword(tokenInfo.userId, hashedPassword);
    await deleteByUserIdAndType(tokenInfo.userId, "RESET");
    return reply.status(200).send({ details: ["Password reset successfully"] });

}
