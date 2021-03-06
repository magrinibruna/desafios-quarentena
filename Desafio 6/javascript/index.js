process.env.NTBA_FIX_319 = true; // Silences an annoying error message.
const TelegramBot = require('node-telegram-bot-api');
const jokempo = require('./jokempo');
const randomPhrases = require('./random-phrases');
const guessNumber = require('./guess-number');
const answerQuestions = require('./answer-questions');

const token = process.env.TOKEN || require('./token');

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

/**
 * Listen to the /help command. 
 * When a user calls this command, a message explain about the bot will be sended.
 */
bot.onText(/\/help/, async (msg) => {
	bot.sendMessage(msg.chat.id, 
		"Bot realizado no Desafio da Quarentena do USPCodeLab Sanca.\n\nComandos:\n/jokempo - Inicia o jogo Pedra, Papel e Tesoura contra o bot.\n/number - Inicia um jogo de adivinhação de um número gerado pelo bot.\n/help - Envia essa mensagem.\n\nVocê pode fazer algumas perguntas pois o bot é capaz de responder, como: \"Por que o t-rex não bate palma?\"\n\nO código fonte está disponível no GitHub e pode ser acessado <a href='https://github.com/magrinibruna/desafios-quarentena/tree/master/Desafio 6'>aqui</a>.",
		{parse_mode: "HTML"}); /*!< Sending in HTML mode */
})

// Listen for any kind of message. There are different kinds of messages.
bot.on('message', async (msg) => {
	const chatMessage = msg.text.trim().toLowerCase();
	const chatId = msg.chat.id;

	if (jokempo.main(bot, chatId, chatMessage)) 
		return;
	else if(guessNumber.main(bot, chatId, chatMessage)) 
		return;
	else if(answerQuestions.answer(bot, chatId, chatMessage))
		return;
	else if(chatMessage == '/help') /*!< If its a command that is implemmented */
		return;
	else 
		randomPhrases.writeRandomPhrase(bot, chatId);
});

console.log('Fetching data...');
bot.getMe().then(me => {
	console.log(`I'm ready to serve! Talk to me on @${me.username}`);
	console.log(`or visit this link: https://t.me/${me.username}`);
});