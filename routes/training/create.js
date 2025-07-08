module.exports = (fastify, opts, next) => {
  fastify.post(
    "/",
    {
      preValidation: [
        fastify.authorize(["ADMIN", "TRAINER"]),
      ],
      schema: {
        body: {
          type: "object",
          properties: {
            startTime: {
              type: "string",
              format: "date-time",
              errorMessage: {
                type: "Start time must be a valid date-time string",
                format: "Start time must be a valid date-time string",

              }
            },
            endTime: {
              type: "string",
              format: "date-time",
              errorMessage: {
                type: "End time must be a valid date-time string",
                format: "End time must be a valid date-time string",
              }
            },
            typeId: {
              type: "number",
              minimum: 1,
              errorMessage: {
                type: "Type ID must be a valid number",
                minimum: "Type ID must be a positive number",


              },
            },
            trainerId: {
              type: "number",
              minimum: 1,
              errorMessage: {
                type: "Trainer ID must be a valid number",
                minimum: "Trainer ID must be a positive number",
              },
            },
            availableSpots: {
              type: "number",
              minimum: 1,
              errorMessage: {
                type: "Available spots must be a valid integer",
                minimum: "Available spots must be at least 1",
              },
            },
          },
          required: ["startTime", "endTime", "typeId", "trainerId", "availableSpots"],
        },
      },
    },
    handler
  );

  next();
};

async function handler(request, reply) {

  const { hasConflict, createTraining } = require("@db/training");

  const { startTime, endTime, typeId, trainerId, availableSpots } = request.body;


  if (new Date(startTime) >= new Date(endTime)) {
    return reply.status(400).send({ details: "Start time must be before end time" });
  }

  const conflict = await hasConflict(trainerId, endTime, startTime);
  if (conflict) {
    return reply.status(400).send({ details: "Training time conflicts with an existing training" });
  }

  await createTraining(startTime, endTime, typeId, trainerId, availableSpots);
  reply.code(201).send({ details: "Training created successfully" });

}