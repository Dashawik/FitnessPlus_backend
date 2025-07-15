const schedule = require('node-schedule');
const dayjs = require('dayjs');

module.exports = () => {
    schedule.scheduleJob('0 17 ? * 0,4-6', closeBooking);
    schedule.scheduleJob('* 1 * * *', closeSubscription);
};

async function closeBooking() {
    const { getAllActiveBookings, completeBooking } = require("@db/booking");

    const bookings = await getAllActiveBookings();

    const now = dayjs();

    bookings.forEach(booking => {
        const endTime = dayjs(booking.training.endTime);

        if (endTime.isBefore(now)) {
            completeBooking(booking.id);
        }
    });
}



async function closeSubscription() {
    console.log("Running closeSubscription job...");

    const { getAllActiveSubscriptions, closeSubscription } = require("@db/subscription");

    const subscriptions = await getAllActiveSubscriptions();

    subscriptions.forEach(subscription => {
        if (subscription.endDate < new Date()) {
            closeSubscription(subscription.id);
        }
    });
}
