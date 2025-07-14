module.exports = (fastify, opts, next) => {
    fastify.get(
        "/",
        {
            preValidation: [
                fastify.authorize(["ADMIN", "USER"]),
            ],
        },
        handler
    );

    next();
};

async function handler(request, reply) {

    const { getAllSubscriptions, getSubscriptionByUserId } = require("@db/subscription");

    let subscriptions;
    if (request.user.role === "ADMIN")
        subscriptions = await getAllSubscriptions();
    else if (request.user.role === "USER") {
        const userId = request.user.id;
        subscriptions = await getSubscriptionByUserId(userId);
    }

    return reply.status(200).send(subscriptions);

}