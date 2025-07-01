module.exports = (fastify, opts, next) => {
  fastify.get(
    "/",
    {
      preValidation: [
        fastify.authorize(["ADMIN"]),
      ],
    },
    handler
  );

  next();
};

async function handler(request, reply) {

  const { getAllTrainingTypes } = require("@db/trainingType");
  const trainingTypes = await getAllTrainingTypes();
  return reply.status(200).send(trainingTypes);

}