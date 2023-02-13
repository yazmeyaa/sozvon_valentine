import { bot } from "index";
import { Message } from "node-telegram-bot-api";

function alreadySendedMessage(message: Message) {
    const user_id = message.from!.id
    return bot.sendMessage(user_id, 'Ты уже отправил свою валентинку! Больше нельзя. :(')
}

export { alreadySendedMessage }
