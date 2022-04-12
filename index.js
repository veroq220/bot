const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = '5181195595:AAEjtfkldOSlfzu2miVKDmetgXLFznEQ8j0'

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Я загадаю цифру от 0 до 9, а ты должен отгадать её!)')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Информация о пользователе'},
        {command: '/game', description: 'Игра угадай число'},
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if(text === '/start'){
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/d06/e20/d06e2057-5c13-324d-b94f-9b5a0e64f2da/11.webp')
            return bot.sendMessage(chatId, 'Добро пожаловать!')
        }

        if(text === '/info'){
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.username}`)
        }
        if (text === '/game'){
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, ' Я тебя не понимаю, попробуй ещё раз!')

    })

    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `К сожалению, ты не отгадал цифру ${chats[chatId]}`, againOptions)
        }

    })
}

start()