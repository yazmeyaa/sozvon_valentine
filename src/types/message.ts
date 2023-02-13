import { RowDataPacket } from "mysql2"

export interface Message {
    ID: number
    user_id: string
    text: string
    from_user_id: string | null
    to_user_id: string
    recieved: boolean
}

export type MessagesFromDB = (Message & RowDataPacket)[]
