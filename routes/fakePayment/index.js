module.exports = (fastify, opts, next) => {
    fastify.post(
        "/",
        {
            preValidation: [
                fastify.authorize(["USER"]),
            ],
            schema: {
                body: {
                    type: "object",
                    properties: {
                        templateId: {
                            type: "number",
                            minimum: 1,
                            errorMessage: {
                                type: "Template ID must be a number",
                                minimum: "Template ID must be greater than 0"
                            }
                        },
                        startDate: {
                            type: "string",
                            format: "date-time",
                            errorMessage: {
                                type: "Start date must be a valid date-time string"
                            }
                        },
                    },
                    required: ["templateId", "startDate"],
                },
            }
        },
        handler
    );

    next();
};

async function handler(request, reply) {

    const { createSubscription } = require("@db/subscription");
    const { getSubscriptionTemplateById } = require("@db/subscriptionTemplate");

    const { templateId, startDate } = request.body;
    const userId = request.user.id;

    const startDateObj = new Date(startDate);
    const endDate = new Date(startDateObj);
    endDate.setDate(startDateObj.getDate() + 30);

    const { sessionLimit } = await getSubscriptionTemplateById(templateId);

    if (!sessionLimit) {
        return reply.status(400).send({ error: "Invalid subscription template ID" });
    }

    await createSubscription(userId, templateId, startDateObj, endDate, sessionLimit);

    return reply.status(201).send({ details: ["Payment processed successfully"] });


}