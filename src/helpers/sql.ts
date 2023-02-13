import { db } from "index"
import { MessagesFromDB } from "types/message"

export const getUserMessages: (user_id: number) => Promise<MessagesFromDB> = (user_id: number) => new Promise((resolve, reject) => {
    db.query<MessagesFromDB>('SELECT * FROM Message WHERE to_user_id = ? AND recieved=0;', [user_id], (err, messages) => {
        if (err) reject(err)
        resolve(messages)
    })
})

export const getMessagesFromUser: (user_id: number) => Promise<MessagesFromDB> = (user_id: number) => new Promise((resolve, reject) => {
    db.query<MessagesFromDB>('SELECT * FROM Message WHERE from_user_id = ?', [user_id], (err, messages) => {
        if (err) reject(err)
        resolve(messages)
    })
})