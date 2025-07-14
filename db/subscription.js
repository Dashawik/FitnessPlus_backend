const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

module.exports = {
    async createSubscription(userId, templateId, startDate, endDate, availableSessions) {
        return await prisma.Subscription.create({
            data: {
                userId,
                templateId,
                startDate,
                endDate,
                availableSessions,
            }
        });
    },

    async getSubscriptionById(id) {
        return await prisma.Subscription.findUnique({
            where: { id }
        });
    },

    async getAllSubscriptions() {
        return await prisma.Subscription.findMany();
    },

    async getSubscriptionByUserId(userId) {
        return await prisma.Subscription.findMany({
            where: { userId },
            select: {
                id: true,
                templateId: true,
                startDate: true,
                endDate: true,
                availableSessions: true,
                isActive: true,
                template: {
                    select: {
                        name: true,
                    }
                }
            }
        });
    },

    async decrementSessions(subscriptionId) {
        return await prisma.Subscription.update({
            where: { id: subscriptionId },
            data: {
                availableSessions: {
                    decrement: 1,
                }
            }
        });
    },

    async incrementSessions(subscriptionId) {
        return await prisma.Subscription.update({
            where: { id: subscriptionId },
            data: {
                availableSessions: {
                    increment: 1,
                }
            }
        });
    }
};

