import { NotifeeModel } from '@/models/notification';
import dbConnect from '@/utils/dbConnect';

// ارسال push notification
import webPush from 'web-push';

// زمان بندی
import schedule from 'node-schedule';

// قرار دادن کلید های عمومی و خصوصی
const Public_Key = process.env.Public_Key;
const Private_Key = process.env.Private_Key;

webPush.setVapidDetails('mailto:maansaridot@gmail.com', Public_Key, Private_Key);
// generate-vapid-keys --json

// لیست زمانبندی ها
let currentJob = new Map();

export async function POST(req) {
    // یادداشت قدیمی
    let oldNotifee;
    // اتصال به دیتابیس
    await dbConnect();
    // دریافت اطلاعات از مرورگر
    const subscription = await req.json();

    // قرار دادن این زمانبندی در لیست
    currentJob.set(subscription.keys.auth, subscription.keys.auth);

    // گرفتن زمانبندی فعلی
    var my_job = schedule.scheduledJobs[currentJob.get(subscription.keys.auth)];
    // لغو زمانبندی فعلی
    my_job?.cancel();

    // تابع کاری
    async function jobFunc() {
        // گرفتن آخرین یادداشت
        const notification = await NotifeeModel.findOne();
        // ساخت محتویات پیام
        const payload = JSON.stringify({ title: notification?.title, body: notification?.message });

        // اگر یادداشت جدید باشد
        if (notification?.title) {
            // اگر محتویات پیام جدید باشند
            if (oldNotifee?.title !== notification.title || oldNotifee?.message !== notification.message) {
                // ارسال پیام
                webPush.sendNotification(subscription, payload).catch(error => console.error(error));
                // یادداشت جدید
                oldNotifee = notification;
            }
        }
    }

    // قرار دادن زمانبندی جدید
    const rule = new schedule.RecurrenceRule();
    // قرار دادن روز اول هر ماه
    rule.date = 1;
    // قرار دادن تایم زون تهران
    rule.tz = 'Asia/Tehran';
    // قرار دادن زمانبندی جدید
    schedule.scheduleJob(currentJob.get(subscription.keys.auth), { start: new Date(), end: new Date(new Date().getTime() + 60000 * 60 * 24 * 7), rule }, jobFunc);

    // قرار دادن زمانبندی جدید
    // schedule.scheduleJob(currentJob.get(subscription.keys.auth), { date: 1, tz: 'Asia/Tehran' }, jobFunc);

    // ارسال پاسخ به مرورگر
    return Response.json({});
}


// const schedule = require('node-schedule');
// const moment = require('moment-timezone');

// const rule = new schedule.DateRule();

// // تاریخ اول هر ماه را به وقت تهران محاسبه کنید
// rule.date = function() {
//   const now = moment.tz('Asia/Tehran');
//   return new Date(now.year(), now.month(), 1, 0, 0, 0);
// };

// schedule.scheduleJob(currentJob.get(subscription.keys.auth), { rule }, jobFunc);

//! process.on('SIGINT', function () { 
//   schedule.gracefulShutdown()
//   .then(() => process.exit(0))
// })