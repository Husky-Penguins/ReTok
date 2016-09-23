import {
	GraphQLObjectType,
 	GraphQLString,
 	GraphQLInt,
	GraphQLSchema,
	GraphQLList,
	GraphQLNonNull
} from 'graphql';

//import date type separately
import GraphQLDate from 'graphql-date';

import Db from './db';

const User = new GraphQLObjectType({

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
			emoji: {
				type: GraphQLString,
				resolve (user) {
					return user.emoji;
				}
			}
		}
	}

});

const Friendship = new GraphQLObjectType({

	name: 'Friendship',
	description: 'all unique friendships',
	fields: () => {
		return {
			id: {
				type: GraphQLInt,
				resolve (friendship) {
					return friendship.id;
				}
			},
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
			chatCount: {
				type: GraphQLInt,
				resolve (friendship) {
					return friendship.chatCount;
				}
			}
		}
	}

});

const Chat = new GraphQLObjectType({

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
		friendshipID: {
			type: GraphQLInt,
			resolve (chat) {
				return chat.friendshipID;
			}
		},
		senderID: {
			type: GraphQLInt,
			resolve (chat) {
				return chat.senderID;
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

});

const Query = new GraphQLObjectType({

	name: 'Query';
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
					emoji: {type: GraphQLString}
				},
				resolve (root, args) {
					return Db.models.User.findAll({where: args});
				}
			},
			friendships: {
				type: new GraphQLList(Friendship),
				args: {
					id: {type: GraphQLInt},
					userOne: {type: GraphQLInt},
					userTwo: {type: GraphQLInt},
					relationship: {type: GraphQLInt},
					chatCount: {type: GraphQLInt}
				},
				resolve (root, args) {
					return Db.models.Friendship.findAll({where: args});
				}
			},
			chats: {
				type: new GraphQLList(Chat),
				args: {
					id: {type: GraphQLInt},
					friendshipID: {type: GraphQLInt},
					senderID: {type: GraphQLInt},
					text: {type: GraphQLString},
					time: {type: GraphQLDate}
				},
				resolve (root, args) {
					return Db.models.Chat.findAll({where: args});
				}
			},
		}
	}
});

const Mutation = new GraphQLObjectType({

	name: 'Mutation',
	description: 'functions to create new users, friendships and chats',
	fields: () => {
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
				coin: {type: GraphQLInt},
				emoji: {type: GraphQLString}
			},
			resolve (root, args) {
				return Db.models.User.create({
					username: args.username,
					password: args.password,
					firstName: args.firstName,
					lastName: args.lastName,
					email: args.email,
					dob: args.dob,
					gender: args.gender,
					profilePic: args.profilePic,
					coin: 0,
					emoji: 'test-emoji'
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
				emoji: {type: GraphQLString}
			},
			resolve (root, args) {
				return Db.models.User.findAll({where: {username: arg.username}})
				.update(args);
			}
		},
	}
		//TODO: addFriendship, updateFriendship, addChat, delateChat
});

const Schema = new GraphQLSchema({
	query: Query,
	mutation: Mutation
});

export default Schema;
