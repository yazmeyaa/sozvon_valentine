type UserChoosedReciever = {
    state: "CHOOSED",
    reciever: number
}

type UserNotChoosedReciever = {
    state: "PENDEING"
}

type SendedMessage = {
    state: "SENDED",
    reciever: number
}

type States = UserChoosedReciever | UserNotChoosedReciever | SendedMessage

interface User {
    user_id: number
}

export type UserState = User & States