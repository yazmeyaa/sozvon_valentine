import { bot, usersState } from "index";
import { Message } from "node-telegram-bot-api";

function getReciever(message: Message, changeState: (user_id: number) => void) {

    if (!message.forward_from) {
        if (message.forward_sender_name) {
            return bot.sendMessage(message.from!.id, 'Пользователю невозможно отправить сообщение, так как он запретил пересылку сообщений настройками приватности.')
        }
        return bot.sendMessage(message.from!.id, 'Необходимо переслать сообщение того, кому ты хочешь отправить валентинку.', {
            reply_to_message_id: message.message_id
        })
    }

    if (message.forward_from.id === message.from!.id) return bot.sendMessage(message.from!.id, 'Нельзя самому себе отправлять валентинки!')
    if (message.forward_from.id === 279603779) return bot.sendMessage(message.from!.id, 'Этот пользователь не принимает валентинки.')
    bot.sendMessage(message.from!.id, 'Отлично! Теперь ты можешь отправить сообщение, которое нужно доставить этому пользователю!')
    changeState(message.forward_from.id)
}

export { getReciever }
