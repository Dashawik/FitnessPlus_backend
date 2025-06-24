module.exports = (fastify, opts, next) => {
    fastify.get(
        "/request",
        {
            schema: {
                querystring: {
                    type: "object",
                    properties: {
                        email: {
                            type: "string",
                            format: "email",
                            errorMessage: {
                                type: "Email must be a string",
                                format: "Email must be a valid email address"
                            }
                        }
                    },
                    required: ["email"],
                },
            }
        },
        handler
    );

    next();
};

async function handler(request, reply) {
    const { upsertToken, getByUserIdAndType } = require("@db/token");
    const user = require("@db/user");
    const tokenGen = require("@utils/tokenGen");
    const { sendResetPasswordEmail } = require("@plugins/mail");


    const { email } = request.query;

    const userData = await user.getUserByEmail(email);
    if (!userData) {
        return reply.status(404).send({ details: ["User not found"] });
    }


    const userToken = await getByUserIdAndType(userData.id, "RESET");

    if (userToken && userToken.createdAt > new Date(Date.now() - 60 * 1000)) {
        return reply.status(400).send({ details: ["Reset request already sent. Please wait 60 seconds before requesting again."] });
    }

    const token = tokenGen(64);

    await upsertToken(userData.id, "RESET", token);

    const verificationLink = `${process.env.FRONTEND_URL}/resetPassword/${token}`;

    try {
        await sendResetPasswordEmail(email, verificationLink);
    } catch (error) {
        console.error("Error sending reset password email:", error);
        return reply.status(500).send({ details: ["Failed to send reset password email. Please try again later."] });
    }

    return reply.status(200).send({ details: ["Reset password email sent successfully."] });

}
