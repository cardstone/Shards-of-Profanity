var io;
var gameSocket;
var gamesObj;
var socketsObj;

exports.initPlay = function (sio, socket, games, socketsInfo) {
	io = sio;
	gameSocket = socket;
	gamesObj = games;
	socketsObj = socketsInfo;

	gameSocket.on('client:getRandWhite', sendRandWhite);
};

function sendRandWhite(data) {
	var gameNum = socketsObj[this.id].room;
	var whiteCards = gamesObj[gameNum].whiteCards;
	var cards = [];
	for(var i = 0; i < data.numCards; i++) {
		var random = Math.floor(Math.random() * whiteCards.length);
		cards.push(whiteCards[random]);
		whiteCards.splice(random, 1);
	}
	this.emit('server:whiteCard', {cards: cards});
}

function czar(socketId) {
	io.to(socketId).emit('server:czar');
}
