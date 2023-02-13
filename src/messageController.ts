import { alreadySendedMessage } from "./handlers/alreadySendedMessage";
import { getReciever } from "./handlers/getReciever";
import { sendMessageToReciever } from "./handlers/sendMessageToReciever";
import { usersState } from "./index";
import { Message } from "node-telegram-bot-api";
import { UserState } from "./types/userState";

const commands = ['/start', '/check_valentines', '/get_valentine']

export function MessageController(message: Message) {
    if (message.text && commands.includes(message.text)) return;

    const user_id = message.from!.id
    let userState: UserState | undefined = usersState.find(item => item.user_id === message.from!.id)
    if (!userState) {
        userState = {
            user_id: user_id,
            state: 'PENDEING'
        }
        usersState.push(userState)
    }


    const step = userState.state

    switch (step) {
        case 'PENDEING': {
            return getReciever(message, (reciever) => {
                console.log(reciever)
                const index = usersState.findIndex(item => item.user_id === user_id)
                const newState: UserState = {
                    user_id: user_id,
                    state: 'CHOOSED',
                    reciever: reciever
                }
                usersState[index] = newState
            })
        }
        case 'CHOOSED': {
            return sendMessageToReciever(message, userState.reciever, (reciever) => {
                console.log(reciever)
                const index = usersState.findIndex(item => item.user_id === user_id)
                const newState: UserState = {
                    user_id: user_id,
                    state: 'SENDED',
                    reciever: reciever
                }
                usersState[index] = newState
            })
        }
        case "SENDED": {
            return alreadySendedMessage(message)
        }
    }
}