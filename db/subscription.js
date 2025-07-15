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
        return await prisma.Subscription.findMany({
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
                },
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    }
                }
            }
        });
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
    },

    async updateSubscription(id, data) {
        return await prisma.Subscription.update({
            where: { id },
            data: {
                ...data,
            }
        });
    },


    async getActiveSubscriptionByUserId(userId) {
        return await prisma.Subscription.findMany({
            where: {
                userId,
                isActive: true,
                availableSessions: {
                    gt: 0,
                },
            },
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

    async getAllActiveSubscriptions() {
        return await prisma.Subscription.findMany({
            where: {
                isActive: true,
            }
        });
    },

    async closeSubscription(id) {
        return await prisma.Subscription.update({
            where: { id },
            data: {
                isActive: false,
            }
        });
    }
};

