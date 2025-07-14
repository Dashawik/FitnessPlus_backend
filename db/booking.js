const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

module.exports = {
    async createBooking(userId, trainingId) {
        return await prisma.booking.create({
            data: {
                userId,
                trainingId,
            },
        });
    },

    async findByUserIdAndTrainingId(userId, trainingId) {
        return await prisma.booking.findFirst({
            where: {
                userId,
                trainingId,
            },
        });
    },

    async getBookedSpots(trainingId) {
        return await prisma.booking.count({
            where: {
                trainingId,
                status: 'ACTIVE',
            },
        });
    },

    async getBookingByTrainingId(trainingId) {
        return await prisma.booking.findMany({
            where: { trainingId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
            },
        });
    },

    async getBookingByUserId(userId) {
        return await prisma.booking.findMany({
            where: { userId },
            select: {
                id: true,
                status: true,
                training: {
                    select: {
                        id: true,
                        startTime: true,
                        endTime: true,
                        type: {
                            select: {
                                name: true,
                            },
                        },
                        trainer: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                training: {
                    startTime: 'desc',
                },
            },
        });
    },

    async getBookingById(id) {
        return await prisma.booking.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    }
                },
                training: {
                    select: {
                        id: true,
                        startTime: true,
                        endTime: true,
                        type: {
                            select: {
                                name: true,
                            },
                        },
                        trainer: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
            },
        });
    },

    async cancelBooking(bookingId) {
        return await prisma.booking.update({
            where: { id: bookingId },
            data: { status: 'CANCELLED' },
        });
    },


};

