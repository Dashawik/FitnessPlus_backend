module.exports = (fastify, opts, next) => {
  fastify.delete(
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
        }
      }
    },
    handler
  );

  next();
};

async function handler(request, reply) {

  const { deleteTrainingType, getTrainingTypeById } = require("@db/trainingType");
  const { id } = request.params;
  const trainingType = await getTrainingTypeById(id);
  if (!trainingType) {
    return reply.status(404).send({ details: ["Training type not found"] });
  }
  await deleteTrainingType(id);
  return reply.status(200).send({ details: ["Training type deleted successfully"] });

}