var GraphQLDate = require('graphql-date');
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLInt = require('graphql').GraphQLInt;
var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLBoolean = require('graphql').GraphQLBoolean;

var Db = require('./db');

var Auth = require('../auth/auth');

var User = new GraphQLObjectType({

	name: 'User',
	description: 'User table',
	fields: () => {
		return {
			id: {
				type: GraphQLInt,
				resolve (user) {
					return user.id;
				}
			},
			username: {
				type: GraphQLString,
				resolve (user) {
					return user.username;
				}
			},
			password: {
				type: GraphQLString,
				resolve (user) {
					return user.password;
				}
			},
			firstName: {
				type: GraphQLString,
				resolve (user) {
					return user.firstName;
				}
			},			
			lastName: {
				type: GraphQLString,
				resolve (user) {
					return user.lastName;
				}
			},			
			email: {
				type: GraphQLString,
				resolve (user) {
					return user.email;
				}
			},			
			dob: {
				type: GraphQLDate,
				resolve (user) {
					return user.dob;
				}
			},			
			gender: {
				type: GraphQLString,
				resolve (user) {
					return user.gender;
				}
			},			
			profilePic: {
				type: GraphQLString,
				resolve (user) {
					return user.profilePic;
				}
			},			
			coin: {
				type: GraphQLInt,
				resolve (user) {
					return user.coin;
				}
			},
			online: {
				type: GraphQLBoolean,
				resolve (user) {
					return user.online;
				}
			},
			//ONLY FOR FINDFRIENDS QUERY
			videoChatCount: {
				type: GraphQLInt,
				resolve (user) {
					return user.videoChatCount;
				}
			},
			//ONLY FOR FINDFRIENDS QUERY			
			textChatCount: {
				type: GraphQLInt,
				resolve (user) {
					return user.textChatCount;
				}
			},
			//ONLY FOR FINDFRIENDS QUERY			
			lastChatTime: {
				type: GraphQLDate,
				resolve (user) {
					return user.lastChatTime;
				}
			}
		}
	}

});

var Friendship = new GraphQLObjectType({

	name: 'Friendship',
	description: 'all unique friendships',
	fields: () => {
		return {
			userOne: {
				type: GraphQLInt,
				resolve (friendship) {
					return friendship.userOne;
				}
			},
			userTwo: {
				type: GraphQLInt,
				resolve (friendship) {
					return friendship.userTwo;
				}
			},
			relationship: {
				type: GraphQLInt,
				resolve (friendship) {
					return friendship.relationship;
				}
			},
			textChatCount: {
				type: GraphQLInt,
				resolve (friendship) {
					return friendship.textChatCount;
				}
			},
			videoChatCount: {
				type: GraphQLInt,
				resolve (friendship) {
					return friendship.videoChatCount;
				}
			},
			lastChatTime: {
				type: GraphQLDate,
				resolve (friendship) {
					return friendship.lastChatTime;
				}
			}
		}
	}

});

var Chat = new GraphQLObjectType({

	name: 'Chat',
	description: 'chat history log',
	fields: () => {
	return {
		id: {
			type: GraphQLInt,
			resolve (chat) {
				return chat.id;
			}
		},
		sender: {
			type: GraphQLString,
			resolve (chat) {
				return chat.sender;
			}
		},
		receiver: {
			type: GraphQLString,
			resolve (chat) {
				return chat.receiver;
			}
		},
		text: {
			type: GraphQLString,
			resolve (chat) {
				return chat.text;
			}
		},
		time: {
			type: GraphQLDate,
			resolve (chat) {
				return chat.time;
			}
		}
	}
	}

});

var Emoji = new GraphQLObjectType({
	name: 'Emoji',
	description: 'emoji store',
	fields: () => {
		return {
			id: {
				type: GraphQLInt,
				resolve (emoji) {
					return emoji.id;
				}
			},
			emoji: {
				type: GraphQLString,
				resolve (emoji) {
					return emoji.emoji;
				}
			},
			price: {
				type: GraphQLInt,
				resolve (emoji) {
					return emoji.price;
				}
			}
		}
	}
});

var emoji_user = new GraphQLObjectType({
	name: 'emoji_user',
	description: 'join table for emoji and user',
	fields: () => {
		return {
			UserId: {
				type: GraphQLInt,
				resolve(emoUser) {
					return emoUser.UserId;
				}
			},
			EmojiId: {
				type: GraphQLInt,
				resolve(emoUser) {
					return emoUser.EmojiId;
				}
			}
		}
	}
});

var Query = new GraphQLObjectType({

	name: 'Query',
	description: 'Root query object',
	fields: () => {
		return {
			users: {
				type: new GraphQLList(User),
				args: {
					id: {type: GraphQLInt},
					username: {type: GraphQLString},
					password: {type: GraphQLString},
					firstName: {type: GraphQLString},
					lastName: {type: GraphQLString},
					email: {type: GraphQLString},
					dob: {type: GraphQLDate},
					gender: {type: GraphQLString},
					profilePic: {type: GraphQLString},
					coin: {type: GraphQLInt},
					online: {type: GraphQLBoolean}
				},
				resolve (root, args) {
					return Db.User.findAll({where: args, attributes: ['id', 'username', 'firstName', 'lastName', 'email', 'dob', 'gender', 'profilePic', 'coin','online']});
				}
			},
			friendships: {
				type: new GraphQLList(Friendship),
				args: {
					userOne: {type: GraphQLInt},
					userTwo: {type: GraphQLInt},
					relationship: {type: GraphQLInt},
					textChatCount: {type: GraphQLInt},
					videoChatCount: {type: GraphQLInt},
					lastChatTime: {type: GraphQLDate}
				},
				resolve (root, args) {
					return Db.Friendship.findAll({where: args});
				}
			},
			chats: {
				type: new GraphQLList(Chat),
				args: {
					id: {type: GraphQLInt},
					sender: {type: GraphQLString},
					receiver: {type: GraphQLString},
					text: {type: GraphQLString},
					time: {type: GraphQLDate}
				},
				resolve (root, args) {
					return Db.Chat.findAll({where: args});
				}
			},
			findFriends: {
				type: new GraphQLList(User),
				args: {
					username: {type: new GraphQLNonNull(GraphQLString)}
				},
				resolve (root, args) {

					var friends = [];
					var myself;
					return Db.User.findAll({where: args})
					.then(function(user){
						myself = user;

						return Db.sequelize.query("SELECT `FriendTwo`.`id` , `FriendTwo`.`username`, `FriendTwo`.`firstName`, `FriendTwo`.`lastName`, `FriendTwo`.`email`, `FriendTwo`.`dob`, `FriendTwo`.`gender`, `FriendTwo`.`profilePic`, `FriendTwo`.`coin`, `FriendTwo`.`online`, `FriendTwo`.`createdAt`, `FriendTwo`.`updatedAt`, `FriendTwo.Friendship`.`relationship`, `FriendTwo.Friendship`.`textChatCount`, `FriendTwo.Friendship`.`videoChatCount`, `FriendTwo.Friendship`.`lastChatTime`, `FriendTwo.Friendship`.`createdAt`, `FriendTwo.Friendship`.`updatedAt`, `FriendTwo.Friendship`.`userOne`, `FriendTwo.Friendship`.`userTwo` FROM `Users` AS `User` LEFT OUTER JOIN (`Friendships` AS `FriendTwo.Friendship` INNER JOIN `Users` AS `FriendTwo` ON `FriendTwo`.`id` = `FriendTwo.Friendship`.`userTwo`) ON `User`.`id` = `FriendTwo.Friendship`.`userOne` WHERE `FriendTwo.Friendship`.`userOne` ="+user[0].id+";");

					})
					.then(function(response){	
						if(response.length > 0) {
							response[0].forEach(function(friend){
								friends.push(friend);
							});
						}
						return friends;
					})
					.then(function(nothing){

						return Db.sequelize.query("SELECT `FriendOne`.`id` , `FriendOne`.`username`, `FriendOne`.`firstName`, `FriendOne`.`lastName`, `FriendOne`.`email`, `FriendOne`.`dob`, `FriendOne`.`gender`, `FriendOne`.`profilePic`, `FriendOne`.`coin`, `FriendOne`.`online`, `FriendOne`.`createdAt`, `FriendOne`.`updatedAt`, `FriendOne.Friendship`.`relationship`, `FriendOne.Friendship`.`textChatCount`, `FriendOne.Friendship`.`videoChatCount`, `FriendOne.Friendship`.`lastChatTime`, `FriendOne.Friendship`.`createdAt`, `FriendOne.Friendship`.`updatedAt`, `FriendOne.Friendship`.`userOne`, `FriendOne.Friendship`.`userTwo` FROM `Users` AS `User` LEFT OUTER JOIN (`Friendships` AS `FriendOne.Friendship` INNER JOIN `Users` AS `FriendOne` ON `FriendOne`.`id` = `FriendOne.Friendship`.`userOne`) ON `User`.`id` = `FriendOne.Friendship`.`userTwo` WHERE `FriendOne.Friendship`.`userTwo` ="+myself[0].id+";");

					})
					.then(function(response){	
						if(response.length > 0) {
							response[0].forEach(function(friend){
								friends.push(friend);
							});
						}
						console.log("friends: ", friends)
						return friends;
					})
					.catch(function(err){
						console.log("There is an error: ", err);
					});
				}
			},
			getEmoji: {
				type: new GraphQLList(Emoji),
				args: {
					username: {type: new GraphQLNonNull(GraphQLString)}
				},
				resolve (root, args) {
					return Db.User.findAll({
						where: args,
						include: [Db.Emoji]
					}).then(function(users) {
						return users[0].Emojis;
					})
				}
			},
			getOtherEmoji: {
				type: new GraphQLList(Emoji),
				args: {
					username: {type: new GraphQLNonNull(GraphQLString)}
				},
				resolve (root, args) {
          return Db.User.findAll({
            where: args,
            include: [Db.Emoji]
          }).then(function(users) {
            var emojiIdArray = [];
            if (users[0].Emojis.length > 0) {
              users[0].Emojis.forEach(function(emoji) {
                emojiIdArray.push(emoji.id);    
              });
              return Db.Emoji.findAll({where: {$not: [{id: emojiIdArray}]}});
            } else {
              return Db.Emoji.findAll();
            }
          });
        }
			}
		};
	}
});

var Mutation = new GraphQLObjectType({

	name: 'Mutation',
	description: 'functions to create new users, friendships and chats',
	fields: () => {
		return {
			addUser: {
				type: User,
				args: {
					username: {type: new GraphQLNonNull(GraphQLString)},
					password: {type: new GraphQLNonNull(GraphQLString)},
					firstName: {type: GraphQLString},
					lastName: {type: GraphQLString},
					email: {type: new GraphQLNonNull(GraphQLString)},
					dob: {type: GraphQLDate},
					gender: {type: GraphQLString},
					profilePic: {type: GraphQLString},
				},
				resolve (root, args) {
					return Db.User.findAll({where: {username: args.username}})
					.then(function (user) {
						if (user.length > 0) {
							return;
						} else {
							return Auth.hashPwAsync(args.password)
							.then(function (hashed) {
								return Db.User.create({
									username: args.username,
									password: hashed,
									firstName: args.firstName,
									lastName: args.lastName,
									email: args.email,
									dob: args.dob,
									gender: args.gender,
									profilePic: args.profilePic,
									coin: 500,
									online: true
								});
							})
						}
					})
					.catch(function (err) {
						console.log("There is an error: ", err);
					});
				}
			},
			updateUser: {
				type: User,
				args: {
					username: {type: new GraphQLNonNull(GraphQLString)},
					password: {type: GraphQLString},
					firstName: {type: GraphQLString},
					lastName: {type: GraphQLString},
					email: {type: GraphQLString},
					dob: {type: GraphQLDate},
					gender: {type: GraphQLString},
					profilePic: {type: GraphQLString},
					coin: {type: GraphQLInt},
					online: {type: GraphQLBoolean}
				},
				resolve (root, args) {
					return Db.User.update(args, {where: {username: args.username}});
				}
			},
			addFriendship: {
				type: Friendship,
				args: {
					userOne: {type: new GraphQLNonNull(GraphQLString)},
					userTwo: {type: new GraphQLNonNull(GraphQLString)},
				},
				resolve (root, args) {
					return Db.User.findAll({where: {$or: [{username: args.userOne}, {username: args.userTwo}]}})
					.then(function(users){

						return Db.Friendship.create({
							userOne: users[0].id,
							userTwo: users[1].id,
							relationship: 1,
							textChatCount: 0,
							videoChatCount: 0,
						});
					})
					.catch(function(err){
						console.log('There is an error: ', err);
					});
				}
			},
			updateFriendship: {
				type: Friendship,
				args: {
					userOne: {type: new GraphQLNonNull(GraphQLString)},
					userTwo: {type: new GraphQLNonNull(GraphQLString)},
					item: {type: GraphQLInt}
				},
				resolve (root, args) {
					return Db.User.findAll({where: {$or: [{username: args.userOne}, {username: args.userTwo}]}})
					.then(function(users){
						return Db.Friendship.findAll({
							where: {
								$or: [
									{
										$and: [
											{userOne: users[0].id},
											{userTwo: users[1].id}
										]
									},
									{
										$and: [
											{userOne: users[1].id},
											{userTwo: users[0].id}
										]
									}
								]
							}
						})
					})	
					.then(function(friendship) {

						var updatedArgs = {lastChatTime: new Date()};

						if (friendship.length === 0) {
							return;
						}

						if (args.item === 1) {
							updatedArgs['videoChatCount'] = friendship[0].videoChatCount + 1;
						} else if (args.item === 2) {
							updatedArgs['textChatCount'] = friendship[0].textChatCount + 1;
						} else {
							return;
						}
						
						return Db.Friendship.update(updatedArgs,{
								where: {$and: [{userOne: friendship[0].userOne}, {userTwo: friendship[0].userTwo}]}
							});

					})
					.catch(function(err){
						console.log('There is an error: ', err);
					});
				}
			},
			addChat: {
				type: Chat,
				args: {
					sender: {type: new GraphQLNonNull(GraphQLString)},
					receiver: {type: new GraphQLNonNull(GraphQLString)},
					text: {type: new GraphQLNonNull(GraphQLString)}
				},
				resolve(root, args) {
					var time = new Date();
					Db.Chat.create({
						sender: args.sender,
						receiver: args.receiver,
						text: args.text,
						time: time
					}).catch(function(err) {
						console.log('Error when adding chat: ', err);
					});
				} 
			},
			deleteChat: {
				type: Chat,
				args: {
					sender: {type: new GraphQLNonNull(GraphQLString)},
					receiver: {type: new GraphQLNonNull(GraphQLString)},
				},
				resolve(root, args) {
					Db.Chat.findAll({
						where: {
							$or: [{$and: [{sender: args.sender}, {receiver: args.receiver}]}, {$and: [{sender: args.receiver}, {receiver: args.sender}]}
							]
						}
					}).then(function(chats) {
						var time = new Date();
						var deleteThreshold = 10;
						if (chats.length > deleteThreshold) {
							var chatsLeft = chats.length;
							chats.forEach(function(chat, idx) {
								if (chatsLeft - idx > deleteThreshold) {
									chat.destroy();
								}
							});
						}
						return;
					}).catch(function(err) {
						console.log('Error when adding chat: ', err);
					});
				}
			},
			addEmoji: {
				type: Emoji,
				args: {
					emoji: {type: new GraphQLNonNull(GraphQLString)},
					price: {type: new GraphQLNonNull(GraphQLInt)}
				},
				resolve(root, args) {
					var time = new Date();
					return Db.Emoji.create(args).catch(function(err) {
						console.log('Error when adding chat: ', err);
					});
				} 
			},
			updateEmojiUser: {
				type: emoji_user,
				args: {
					username: {type: new GraphQLNonNull(GraphQLString)},
					emoji: {type: new GraphQLNonNull(GraphQLString)}
				},
				resolve(root, args) {
					var updates = {};
					return Db.User.findAll({where: {username: args.username}})
					.then(function(user) {
						updates.UserId = user[0].id;
						return Db.Emoji.findAll({where: {emoji: args.emoji}})
						.then(function(emoji) {
							updates.EmojiId = emoji[0].id;
							return Db.emoji_user.create(updates)
							.catch(function(err) {
								console.log('error when updating emoji_user: ', err);
							})
						})
					})

				}
			},
			addEmoji: {
				type: Emoji,
				args: {
					emoji: {type: new GraphQLNonNull(GraphQLString)},
					price: {type: new GraphQLNonNull(GraphQLInt)}
				},
				resolve(root, args) {
					var time = new Date();
					return Db.Emoji.create(args).catch(function(err) {
						console.log('Error when adding chat: ', err);
					});
				} 
			},
			updateEmojiUser: {
				type: emoji_user,
				args: {
					username: {type: new GraphQLNonNull(GraphQLString)},
					emoji: {type: new GraphQLNonNull(GraphQLString)}
				},
				resolve(root, args) {
					var updates = {};
					return Db.User.findAll({where: {username: args.username}})
					.then(function(user) {
						updates.UserId = user[0].id;
						return Db.Emoji.findAll({where: {emoji: args.emoji}})
						.then(function(emoji) {
							updates.EmojiId = emoji[0].id;
							return Db.emoji_user.create(updates)
							.catch(function(err) {
								console.log('error when updating emoji_user: ', err);
							})
						})
					})

				}
			}
		}
	}
		//TODO: addChat, deleteChat
});

var Schema = new GraphQLSchema({
	query: Query,
	mutation: Mutation
});

module.exports = Schema;	
