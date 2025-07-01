

module.exports = (fastify, opts, next) => {
    fastify.put(
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
                body: {
                    type: "object",
                    properties: {
                        firstName: {
                            type: "string",
                            minLength: 2,
                            maxLength: 32,
                            errorMessage: {
                                type: "First name must be a string",
                                minLength: "First name must be at least 2 characters long",
                                maxLength: "First name must be no more than 32 characters long",
                            },
                        },
                        lastName: {
                            type: "string",
                            minLength: 2,
                            maxLength: 32,
                            errorMessage: {
                                type: "Last name must be a string",
                                minLength: "Last name must be at least 2 characters long",
                                maxLength: "Last name must be no more than 32 characters long",
                            },
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
                        email: {
                            type: "string",
                            format: "email",
                            errorMessage: {
                                type: "Email must be a string",
                                format: "Email must be in a valid email format",
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
    const { getUserByEmail, getUserById, updateUser } = require("@db/user");

    const userId = request.params.id;

    if ((request.user.role == "USER" || request.user.role == "TRAINER") && (userId != request.user.id)) {
        return reply.status(403).send({ details: ["You can only update your own user data"] });
    }

    const user = await getUserById(userId);
    if (!user) {
        return reply.status(404).send({ details: ["User not found"] });
    }

    const { firstName, lastName, email, password } = request.body;

    const existingUser = await getUserByEmail(email);
    if (existingUser && existingUser.id !== userId) {
        return reply.status(400).send({ details: ["Email already in use"] });
    }

    if (password) {
        const bcrypt = require("bcrypt");
        const salt = await bcrypt.genSalt(10);
        request.body.password = await bcrypt.hash(password, salt);
    }


    if (request.user.role == "ADMIN") {
        const { role } = request.body;
        if (role && !["ADMIN", "TRAINER", "USER"].includes(role)) {
            return reply.status(400).send({ details: ["Invalid role specified"] });
        }
        await updateUser(userId, firstName, lastName, email, password, role);
    } else {
        await updateUser(userId, firstName, lastName, email, password);
    }

    return reply.status(200).send({
        details: ["User updated successfully"]
    });
}
