import dotenv from 'dotenv'
import TelegramBot from 'node-telegram-bot-api'
import { createConnection } from 'mysql2'
import { MessagesFromDB } from 'types/message'
import { MessageController } from 'messageController'
import { getUserMessages } from 'helpers/sql'
import { UserState } from 'types/userState'

dotenv.config()

const token = process.env.TELEGRAM_KEY_API

const {
    MYSQL_SERVER,
    MYSQL_PORT,
    MYSQL_USER,
    MYSQL_PASSWORD,
    MYSQL_DATABASE
} = process.env
if (!MYSQL_SERVER || !MYSQL_PORT || !MYSQL_USER || !MYSQL_PASSWORD || !MYSQL_DATABASE) throw new Error('Missed MySQL config')
if (!token) throw new Error('TELEGRAM_KEY_API IS REQUIRED')

export const bot = new TelegramBot(token)
export const db = createConnection({
    host: MYSQL_SERVER,
    password: MYSQL_PASSWORD,
    user: MYSQL_USER,
    database: MYSQL_DATABASE,
    port: Number(MYSQL_PORT)
})

async function start() {
    db.connect()
    console.log('Connected to DB')
    await bot.startPolling()
    console.log('Started polling server')
}

start()

bot.onText(/(\/start|\/check_valentines)/, async (message) => {
    const user_id = message.from!.id

    const messages = await getUserMessages(user_id)
    if (messages.length === 0) return bot.sendMessage(user_id, 'У тебя нет валентинок.')

    bot.sendMessage(user_id, `У тебя есть ${messages.length} неоткрытых валентинок. Напиши /get_valentine чтобы посмотреть валентинки`)
})

bot.onText(/\/get_valentine/, async (message) => {
    const user_id = message.from!.id
    const messages = await getUserMessages(user_id)
    if (messages.length === 0) return bot.sendMessage(user_id, 'У тебя нет валентинок.')
    const singleMessage = messages[0]

    const availableMessages = messages.length - 1 === 0 ? 'У тебя больше нет непрочитанных валентинок.' : `У тебя ещё есть ${messages.length} неоткрытых валентинок.`

    const finalMessage = 
`${singleMessage.text}

${availableMessages}`

    bot.sendMessage(user_id, finalMessage)

    db.query(`UPDATE Message SET recieved=1 WHERE ID=?`, [singleMessage.ID])
})

bot.on('message', MessageController)




export const usersState: UserState[] = []