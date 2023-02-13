import { getMessagesFromUser } from "../helpers/sql";
import { bot, db, usersState } from "../index";
import { Message } from "node-telegram-bot-api";

async function sendMessageToReciever(message: Message, reciever: number, changeState: (user_id: number) => void) {
    const messagesFromUser = await getMessagesFromUser(message.from!.id)
    if (messagesFromUser.length > 0) return bot.sendMessage(message.from!.id, 'Ты уже отправил валентинку. Больше нельзя.')

    if (!message.text) return bot.sendMessage(message.from!.id, 'Бот поддерживает только текст.')
    usersState[usersState.findIndex(item => item.user_id === message.from!.id)].state = 'SENDED'

    db.query('INSERT INTO Message (text, to_user_id, from_user_id, recieved) VALUES(?, ?, ?, ?);', [message.text, reciever, message.from!.id, 0])

    try {
        bot.sendMessage(reciever, 'Вам пришла новая валентинка! ♥ \n Напиши /get_valentine чтобы посмотреть валентинки')
    }
    catch (error) {
        console.error(error)
    }
    await bot.sendMessage(message.from!.id, 'Доставлено!')
    changeState(reciever)
}

export { sendMessageToReciever }
