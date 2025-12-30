import { CronJob } from "cron";
export const job = new CronJob(
  "1 * * * * *",
  function () {
    console.log("i am running");
  },
  null,
  true // if this is set true then we don't need to call the function in main.ts file job.start() rather only call job
);
