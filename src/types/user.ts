import { RowDataPacket } from "mysql2"
import { Message } from "./message"

export interface User {
    user_id: number
    recieved_messages: Message[]
}

export type UserFromDB = (User & RowDataPacket)[]