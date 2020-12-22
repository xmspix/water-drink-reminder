import { WebClient, WebAPICallResult, ErrorCode } from "@slack/web-api";
const dotenv = require("dotenv");
dotenv.config();

const web = new WebClient(process.env.SLACK_BOT_TOKEN);

type Message = {
  text: string;
  channel: string;
};

let usersStore: any = {};

export const slackConnect = async () => {
  try {
    const result: any = await web.users.list();
    saveUsers(result.members);
    return usersStore;
  } catch (error) {
    console.error(error);
    return error;
  }
};

function saveUsers(usersArray: any[]) {
  let userId = "";
  usersArray.forEach(function (user) {
    userId = user["id"];
    usersStore[userId] = user;
  });
}

export const sendMessage = async (message: Message) => {
  await web.chat
    .postMessage({
      text: message.text,
      channel: message.channel,
      as_user: true,
    })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
};
