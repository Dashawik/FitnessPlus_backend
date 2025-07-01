module.exports = (fastify, opts, next) => {
  fastify.put(
    "/:id",
    {
      preValidation: [
        fastify.authorize(["ADMIN"]),
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
                minimum: "ID must be greater than 0"
              }

            }
          },
          required: ["id"]
        },
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
      }
    },
    handler
  );

  next();
};
async function handler(request, reply) {

  const { updateTrainingType, getTrainingTypeById, findbyName } = require("@db/trainingType");
  const { id } = request.params;
  const { name } = request.body;
  const trainingType = await getTrainingTypeById(id);
  if (!trainingType) {
    return reply.status(404).send({ details: ["Training type not found"] });
  }
  const existingType = await findbyName(name);
  if (existingType && existingType.id !== id) {
    return reply.status(400).send({ details: ["Training type with this name already exists"] });
  }
  const updatedType = await updateTrainingType(id, name);
  if (!updatedType) {
    return reply.status(400).send({ details: ["Training type update failed"] });
  }
  return reply.status(200).send({ details: ["Training type updated successfully"] });

}