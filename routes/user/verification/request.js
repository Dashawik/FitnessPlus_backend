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
    const { sendVerificationEmail } = require("@plugins/mail");


    const { email } = request.query;

    const userData = await user.getUserByEmail(email);
    if (!userData) {
        return reply.status(404).send({ details: ["User not found"] });
    }

    if (userData.verified) {
        return reply.status(400).send({ details: ["User already verified"] });
    }

    const userToken = await getByUserIdAndType(userData.id, "VERIFICATION");

    if (userToken && userToken.createdAt > new Date(Date.now() - 60 * 1000)) {
        return reply.status(400).send({ details: ["Verification request already sent. Please wait 60 seconds before requesting again."] });
    }

    const token = tokenGen(64);

    await upsertToken(userData.id, "VERIFICATION", token);

    const verificationLink = `${process.env.FRONTEND_URL}/verify/${token}`;

    try {
        await sendVerificationEmail(email, verificationLink);
    }
    catch (error) {
        console.error("Error sending verification email:", error);
        return reply.status(500).send({ details: ["Failed to send verification email. Please try again later."] });
    }

    return reply.status(200).send({ details: ["Verification email sent successfully"] });

}
