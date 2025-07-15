module.exports = (fastify, opts, next) => {
    fastify.post(
        "/",
        {
            preValidation: [fastify.authorize(["USER"])],
            schema: {
                body: {
                    type: "object",
                    properties: {
                        trainingId: {
                            type: "number",
                            minimum: 1,
                            errorMessage: {
                                type: "Training ID must be a valid number",
                                minimum: "Training ID must be a positive number",
                            },
                        },
                        subscriptionId: {
                            type: "number",
                            minimum: 1,
                            errorMessage: {
                                type: "Subscription ID must be a valid number",
                                minimum: "Subscription ID must be a positive number",
                            },
                        },
                    },
                    required: ["trainingId", "subscriptionId"],
                },
            },
        },
        handler
    );

    next();
};

async function handler(request, reply) {
    const {
        createBooking,
        findByUserIdAndTrainingId,
        getBookedSpots,
    } = require("@db/booking");

    const {
        getSubscriptionById,
        decrementSessions,
    } = require("@db/subscription");

    const { getTrainingById } = require("@db/training");

    const { trainingId, subscriptionId } = request.body;

    const userId = request.user.id;

    const subscription = await getSubscriptionById(subscriptionId);

    if (!subscription) {
        return reply.status(404).send({ details: "Subscription not found" });
    }

    if (!subscription.isActive) {
        return reply.status(400).send({ details: "Subscription is not active" });
    }

    if (subscription.userId !== request.user.id) {
        return reply
            .status(403)
            .send({
                details: "You do not have permission to book this subscription",
            });
    }

    if (subscription.availableSessions <= 0) {
        return reply
            .status(400)
            .send({ details: "No available sessions left in this subscription" });
    }

    const training = await getTrainingById(trainingId);

    if (!training) {
        return reply.status(404).send({ details: "Training not found" });
    }

    if (training.startTime < new Date()) {
        return reply
            .status(400)
            .send({ details: "Cannot book a training that has already started" });
    }

    const bookedSpots = await getBookedSpots(trainingId);

    if (training.availableSpots.availableSpots <= bookedSpots) {
        return reply
            .status(400)
            .send({ details: "No available spots for this training" });
    }

    const existingBooking = await findByUserIdAndTrainingId(userId, trainingId);

    console.log("Existing booking:", existingBooking);


    if (existingBooking && existingBooking.status !== 'CANCELLED') {
        return reply
            .status(400)
            .send({ details: "Booking for this user and training already exists" });
    }

    await createBooking(userId, trainingId);
    await decrementSessions(subscriptionId);

    return reply.status(201).send({
        details: "Booking created successfully",
    });
}
