//establish database connection
//CHANGE PASSWORD IN SETTINGS.JS IF NEEDED
var Sequelize = require('sequelize');
var userinfo = require('../../settings.js');

var sequelize = new Sequelize('ReTok', userinfo.user, userinfo.password);
// var sequelize = new Sequelize('ReTok', userinfo.user, userinfo.password, {
// host: userinfo.connectionString,
// port: 3306,
// logging: console.log,
// maxConcurrentQueries: 100,
// dialectOptions: {
// ssl:'Amazon RDS'
// },
// pool: { maxConnections: 5, maxIdleTime: 30},
// language: 'en'
// })
//define user model
var User = sequelize.define('User', {
	username: Sequelize.STRING,
	password: Sequelize.STRING,
	firstName: Sequelize.STRING,
	lastName: Sequelize.STRING,
	email: Sequelize.STRING,
	dob: Sequelize.DATE,
	gender: Sequelize.STRING,
	profilePic: Sequelize.STRING,
	coin: Sequelize.INTEGER,
	online: Sequelize.BOOLEAN
});
// chat model stores all chat histories
var Chat = sequelize.define('Chat', {
	room: Sequelize.STRING,
	text: Sequelize.TEXT('long'),
	time: Sequelize.DATE
});
// emoji table...
var Emoji = sequelize.define('Emoji', {
	emoji: Sequelize.STRING,
	price: Sequelize.INTEGER
});

var emoji_user = sequelize.define('emoji_user', {
});

Emoji.belongsToMany(User, {through: 'emoji_user'});
User.belongsToMany(Emoji, {through: 'emoji_user'});

User.sync();
Chat.sync();
Emoji.sync();
emoji_user.sync();

// friendship model stores all friendships and related information
var Friendship = sequelize.define('Friendship', {
	relationship: Sequelize.INTEGER,
	textChatCount: Sequelize.INTEGER,
	videoChatCount: Sequelize.INTEGER,
	lastChatTime: Sequelize.DATE
});

module.exports.FriendTwo = User.belongsToMany(User, {as: 'FriendTwo', through: 'Friendship', foreignKey: 'userOne', otherKey: 'userTwo'});
module.exports.FriendOne = User.belongsToMany(User, {as: 'FriendOne', through: 'Friendship', foreignKey: 'userTwo', otherKey: 'userOne'});

Friendship.sync();

module.exports.sequelize = sequelize;
module.exports.User = User;
module.exports.Friendship = Friendship;
module.exports.Chat = Chat;
module.exports.emoji_user = emoji_user;
module.exports.Emoji = Emoji;
