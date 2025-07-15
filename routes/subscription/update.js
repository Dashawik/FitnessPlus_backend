module.exports = (fastify, opts, next) => {
    fastify.put(
        "/:id",
        {
            preValidation: [fastify.authorize(["ADMIN"])],

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
                            },
                        },
                    },
                    required: ["id"],
                },
                body: {
                    type: "object",
                    properties: {
                        startDate: {
                            type: "string",
                            format: "date-time",
                            errorMessage: {
                                type: "Start date must be a valid date-time string",
                                format: "Start date must be in ISO 8601 format",
                            },
                        },
                        endDate: {
                            type: "string",
                            format: "date-time",
                            errorMessage: {
                                type: "End date must be a valid date-time string",
                                format: "End date must be in ISO 8601 format",
                            },
                        },
                        availableSessions: {
                            type: "number",
                            minimum: 0,
                            errorMessage: {
                                type: "Available sessions must be a number",
                                minimum: "Available sessions must be at least 0",
                            },
                        },
                        isActive: {
                            type: "boolean",
                            errorMessage: {
                                type: "Is active must be a boolean",
                                format: "Is active must be true or false",
                            },
                        },
                    },
                    required: ["startDate", "endDate", "availableSessions", "isActive"],
                },
            },
        },
        handler
    );

    next();
};

async function handler(request, reply) {
    const { updateSubscription, getSubscriptionById } = require("@db/subscription");

    const subscriptionId = request.params.id;

    const subscription = await getSubscriptionById(subscriptionId);

    if (!subscription) {
        return reply.status(404).send({ details: "Subscription not found" });
    }

    const updatedData = request.body;

    await updateSubscription(subscriptionId, updatedData);

    return reply.send({ details: "Subscription updated successfully" });

}
