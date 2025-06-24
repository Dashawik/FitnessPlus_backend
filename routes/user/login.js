const token = require("../../db/token");


module.exports = (fastify, opts, next) => {
  fastify.post(
    "/login",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            password: {
              type: "string", minLength: 6, maxLength: 64,
              errorMessage: {
                type: "Password must be a string",
                minLength: "Password must be at least 6 characters long",
                maxLength: "Password must be no more than 64 characters long",
              },
            },
            email: {
              type: "string", format: "email", errorMessage: {
                type: "Email must be a string",
                format: "Email must be in a valid email format",
              }
            },
          },
          required: ["password", "email"],
        },
      },
    },
    handler.bind(null, fastify)
  );

  next();
};

async function handler(fastify, request, reply) {
  const { upsertJWT } = require("@db/jwt");
  const { getUserByEmail } = require("@db/user");

  const { password, email } = request.body;

  const user = await getUserByEmail(email);
  if (!user) {
    return reply.status(404).send({ details: ["User not found"] });
  }
  const bcrypt = require("bcrypt");
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return reply.status(401).send({ details: ["Invalid password"] });
  }

  if (!user.emailVerified) {
    return reply.status(403).send({ details: ["Email not verified"] });
  }

  const data = await fastify.generateAccess(user.id);
  const refreshToken = await fastify.generateRefresh(user.id);
  await upsertJWT(user.id, refreshToken);
  return reply.status(200).send({
    user: data.data,
    tokens: {
      access: `Bearer ${data.accessToken}`,
      refresh: `Bearer ${refreshToken}`
    }
  })
}
