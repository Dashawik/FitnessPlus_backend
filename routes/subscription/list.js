module.exports = (fastify, opts, next) => {
    fastify.get(
        "/",
        {
            preValidation: [fastify.authorize(["ADMIN", "USER"])],
            shema: {
                querystring: {
                    type: "object",
                    properties: {
                        filter: {
                            type: "string",
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
    const {
        getAllSubscriptions,
        getSubscriptionByUserId,
        getActiveSubscriptionByUserId,
    } = require("@db/subscription");

    const userId = request.user.id;

    let subscriptions;

    if (request.user.role === "ADMIN") {
        subscriptions = await getAllSubscriptions();
    } else if (request.user.role === "USER") {
        if (request.query.filter === "active") {
            subscriptions = await getActiveSubscriptionByUserId(userId);
        } else
            subscriptions = await getSubscriptionByUserId(userId);
    }

    return reply.status(200).send(subscriptions);
}
