const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options.js');
const token = '5428789056:AAEnN-5d13yZEJVU1tRJPw2FmNr-qT_hA80';

const bot  = new TelegramApi(token, {polling: true});

let gameDB = {}

const StartGame = async (chatId) => {
    await bot.sendMessage(chatId, `Я загадал число от 0 до 9, попробуй угадать`);
    const randomNumber = Math.floor(Math.random() * 10);
    gameDB[chatId] = randomNumber;
    await bot.sendMessage(chatId, `Можешь начинать`, gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветиствие'},
        {command: '/rnd_img', description: 'Рандомная картинка'},
        {command: '/game', description: 'Угадай число'},
    ])
    
    bot.on("message", async msg => {
        const text = msg.text;
        const username = msg.from.username;
        const chatId = msg.chat.id;
        if(text === '/start'){
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/3d2/135/3d213551-8cac-45b4-bdf3-e24a81b50526/8.webp')
            return bot.sendMessage(chatId, `Добро пожаловать, ${username}`);
        }
        if(text === '/rnd_img'){
            return bot.sendPhoto(chatId, `https://api.lorem.space/image?w=150&h=180`)
        }
        if(text === '/game'){
            return StartGame(chatId)
        }

        return bot.sendMessage(chatId, `${username}, я не понимать тебя(`);
        
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if(data === '/again'){
            return StartGame(chatId)
        }

        if(data == gameDB[chatId]){
            return await bot.sendMessage(chatId, `Поздравляю ты угадал, чило ${gameDB[chatId]}!`, againOptions)
        } else {
            return await bot.sendMessage(chatId, `Не угадал, я загадал ${gameDB[chatId]}`, againOptions)
        }
    })

}

start();