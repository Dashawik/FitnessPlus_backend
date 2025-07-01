module.exports = (fastify, opts, next) => {
  fastify.post(
    "/",
    {
      preValidation: [
        fastify.authorize(["ADMIN"]),
      ],
      schema: {
        body: {
          type: "object",
          properties: {
            name: {
              type: "string",
              minLength: 2,
              maxLength: 32,
              errorMessage: {
                type: "Training type name must be a string",
                minLength: "Training type name must be at least 2 characters long",
                maxLength: "Training type name must be no more than 32 characters long",
              },
            },
          },
          required: ["name"],
        },
      },
    },
    handler
  );

  next();
};

async function handler(request, reply) {

  const { createTrainingType, findbyName } = require("@db/trainingType");

  const { name } = request.body;
  const existingType = await findbyName(name);
  if (existingType) {
    return reply.status(400).send({ details: ["Training type already exists"] });
  }
  await createTrainingType(name)
  return reply.status(201).send({ details: ["Training type created successfully"] });


}