import { slackUsers, users } from "../server";
import { CronJob } from "cron";
import fs from "fs";
import { sendMessage } from "./slack";

type Message = {
  id: string;
  name: string;
  current: number;
  dayTarget: number;
};

// sec minute hour dayOfMonth month dayOfWeek
new CronJob({
  cronTime: "0 */30 8-21 * * *",
  onTick: () => {
    let chatUsers: any = slackUsers;

    const onlyUsers: any = Object.values(chatUsers).filter(
      (user: any) => user.is_bot === false && user.id !== "USLACKBOT"
    );

    users.map((user) => {
      let slackUser: any = onlyUsers.filter((u: any) =>
        u.real_name.toLowerCase().includes(user.name.toLowerCase())
      )[0];

      if (user.current < user.dayTarget) {
        send({
          id: slackUser.id,
          name: user.name,
          current: user.current,
          dayTarget: user.dayTarget,
        });
      }
    });
  },
  start: true,
  timeZone: "Asia/Jerusalem",
});

// Reset at night
new CronJob({
  cronTime: "* * 0 24 * *",
  onTick: () => {
    const users = JSON.parse(fs.readFileSync("./users.json", "utf8")).map(
      (user: any) => ({
        ...user,
        current: 0,
      })
    );

    fs.writeFileSync("./users.json", JSON.stringify(users));
  },
  start: true,
});

function send(Message: Message) {
  // console.log(
  //   new Date(),
  //   Message.name,
  //   convertValue(Message.current),
  //   convertValue(Message.dayTarget)
  // );
  sendMessage({
    channel: Message.id,
    text: `Water Drink Reminder 💧 : Hi ${
      Message.name
    }, you currently drank ${convertValue(Message.current)} / ${convertValue(
      Message.dayTarget
    )} of water today, please take another glass of water 🥤`,
  });
}

function convertValue(value: number) {
  return value > 1000 ? value / 1000 + "L" : value + "ml";
}
