var db = require('../server/db/db');

var username = ['aaa', 'bbb', 'ccc', 'ddd', 'eee', 'fff'];
var emoji = [':)', ':D', ':(', 'O_O'];

// add records to User table
function populateUserData(data) {
	for (var i = 0; i < data.length) {
		db.User.create({
			username: data[i],
			password: data[i],
			email: data[i] + '@gmail.com',
			coin: Math.floor(Math.random() * 1000),
			online: Math.random() >= 0.5 ? true : false
		});
	}
};

function populateFriendshipData(data) {
	for (var i = 0; i < data.length) {
		var	userOne = (Math.random() * 10) % 6;
		var	userTwo = (Math.random() * 10) % 6;
		while (userOne === userTwo) {
			userTwo = (Math.random() * 10) % 6;
		}
		db.Friendship.create({
			userOne: userOne,
			userTwo: userTwo,
			relationship: 1,
			textChatCount: Math.floor(Math.random() * 1000),
			videoChatCount: Math.floor(Math.random() * 1000),
		});
	}
};

function populateChatData(data) {
	for (var i = 0; i < data.length) {
		var	userOne = username[(Math.random() * 10) % 6];
		var	userTwo = username[(Math.random() * 10) % 6];
		while (userOne === userTwo) {
			userTwo = username[(Math.random() * 10) % 6];
		}
		db.Chat.create({
			sender: userOne,
			receiver: userTwo,
			text: 1,
			time: new Date() + Math.floor(Math.random() * 100000)
		});
	}
};

function populateEmojiData(data) {
	for (var i = 0; i < data.length) {
		var	userOne = username[(Math.random() * 10) % 6];
		var	userTwo = username[(Math.random() * 10) % 6];
		while (userOne === userTwo) {
			userTwo = username[(Math.random() * 10) % 6];
		}
		var price = Math.random() * 100
		db.Emoji.create({
			emoji: emoji[i]
			price:  
		});
	}
};