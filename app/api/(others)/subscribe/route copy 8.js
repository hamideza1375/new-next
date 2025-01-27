import { NotifeeModel } from '@/models/notification';
import dbConnect from '@/utils/dbConnect';
import webPush from 'web-push';
import schedule from 'node-schedule';

const Public_Key = process.env.Public_Key;
const Private_Key = process.env.Private_Key;

webPush.setVapidDetails('mailto:maansaridot@gmail.com', Public_Key, Private_Key);
// web-push generate-vapid-keys --json

let currentJob = new Map();

export async function POST(req) {
  let oldNotifee;
    await dbConnect();
    const subscription = await req.json();
    // if (!subscription) return Response.json({}, { status: 206 });

    currentJob.set(subscription.keys.auth, subscription.keys.auth);

    var my_job = schedule.scheduledJobs[currentJob.get(subscription.keys.auth)];
    my_job?.cancel();

    async function jobFunc() {
        const notification = await NotifeeModel.findOne();
        const payload = JSON.stringify({ title: notification?.title, body: notification?.message });

        // console.log(subscription);

        if (notification?.title) {
          if (oldNotifee?.title !== notification.title || oldNotifee?.message !== notification.message) {
            webPush.sendNotification(subscription, payload).catch(error => console.error(error));
            oldNotifee = notification;
          }
        }
    }

    // schedule.scheduleJob(currentJob.get(subscription.keys.auth), '0 */1 * * * *', jobFunc);
    schedule.scheduleJob(currentJob.get(subscription.keys.auth), '0 0 */30 * * *', jobFunc);
    // schedule.scheduleJob(currentJob.get(subscription.keys.auth), '0 11 1 * * *', jobFunc);
    jobFunc()
    return Response.json({});
}
