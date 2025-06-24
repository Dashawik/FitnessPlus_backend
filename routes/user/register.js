module.exports = (fastify, opts, next) => {
  fastify.post(
    "/register",
    {
      schema: {
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
          required: ["firstName", "lastName", "password", "email"],
        },
      },
    },
    handler
  );

  next();
};

async function handler(request, reply) {
  const bcrypt = require("bcrypt");

  const { getUserByEmail, createUser } = require("@db/user");

  const { firstName, lastName, password, email } = request.body;


  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return reply.status(400).send({ details: ["A user with this email already exists"] });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await createUser(email, firstName, lastName, hashedPassword);

  reply.status(201).send({ message: "User registered successfully" });
}
