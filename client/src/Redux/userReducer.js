
// ------ ACTIONS FOR USER REDUCER --------- //
export function userAuth (userID) {
  return {
    type: 'USER_AUTH',
    isLoggedIn: true,
    userID
  }
}

export function toggleLogIn(bool){
  return {
    type: 'TOGGLE_LOGIN',
    isLoggedIn: bool,
  }
}

export function userUnauth () {
  return {
    type: 'USER_UNAUTH',
    isLoggedIn: false,
  }
}

export function updateUser (user) {
  return {
    type: 'UPDATE_USER',
    user,
  }
}

export function updateFriends (friends) {
  return {
    type: 'UPDATE_FRIENDS',
    friends,
  }
}

export function updateOnlineFriends (onlineFriends) {
  return {
    type: 'UPDATE_ONLINE_FRIENDS',
    onlineFriends,
  }
}

export function updateSuggestedFriends (suggestedFriends) {
  return {
    type: 'UPDATE_SUGGESTED_FRIENDS',
    suggestedFriends,
  }
}

export function updateFriendCount (count) {
  return {
    type: 'UPDATE_FRIEND_COUNT',
    count,
  }
}
export function increaseFriendCount() {
  return {
    type: 'INCREASE_FRIEND_COUNT',
  }
}


export function updateSearch (search) {
  return {
    type: 'UPDATE_SEARCH',
    search,
  }
}

export function updateEmojis (emojis) {
  return {
    type: 'UPDATE_EMOJIS',
    emojis,
  }
}

export function updateStoreEmojis (storeEmojis) {
  return {
    type: 'UPDATE_STORE_EMOJIS',
    storeEmojis,
  }
}

export function updateUserEmojis (userEmojis) {
  return {
    type: 'UPDATE_USER_EMOJIS',
    userEmojis,
  }
}

export function createRoom(room) {
  return {
    type: 'CREATE_ROOM',
    room
  }
}

export function sendSocket(socket) {
  return {
    type: 'SEND_SOCKET',
    socket
  }
}

// ----- SET USER REDUCER INITIAL STATE ------ //
const userInitialState = {
  userID: '',
  user: {username: 'buddyboowaggytails', password: 'abcd1234', firstName: 'Boo', lastName: 'theDog', email: 'buddyboo@gmail.com', dob: '9/9/1999', profilePic: 'http://images5.fanpop.com/image/photos/31300000/-Boo-Buddy-boo-and-buddy-31314627-403-403.jpg', coin: 0, emoji: ''},
  friends: [],
  onlineFriends: [],
  suggestedFriends: [],
  friendCount: 0,
  isLoggedIn: false,
  error: '',
  emojis: [],
  storeEmojis: [],
  userEmojis: [],
  search: [{username: 'andersoncooper', profilePic: 'https://img.buzzfeed.com/buzzfeed-static/static/2013-10/enhanced/webdr06/15/14/enhanced-buzz-8404-1381861542-6.jpg', date: '06/10/2016'}, {username: 'human', profilePic: 'http://allthingsd.com/files/2012/08/531287_10151443421215398_1956136074_n-380x285.jpeg', date: '08/10/2016'}, {username: 'buddy', profilePic: 'http://cdn1.boothedog.net/wp-content/uploads/2011/07/boo-the-dog-300x255.jpg', date: '09/10/2016'}],
  room: '',
  socket: null

}

// ------------ USER REDUCER -----------------//
export default function userReducer (state = userInitialState, action) {
  switch(action.type){
    case 'USER_AUTH' :  {
   return {
     ...state,
      isLoggedIn: true,
      }
    }
    case 'USER_UNAUTH' : {
      return {
        ...state,
         isLoggedIn: false,
         user: {},
         userID: ''
       }
    }

    case 'TOGGLE_LOGIN' : {
      return {
        ...state,
         isLoggedIn: action.isLoggedIn,
       }
    }

    case 'FETCHING_USER_INFO' : {
      return {
        ...state,
         isFetching: true,
       }
    }

    case 'UPDATE_USER' : {
     return {
       ...state,
        user:action.user,
      }
    }

    case 'UPDATE_FRIENDS' : {
      return {
        ...state,
        friends: action.friends,
      }
    }

    case 'UPDATE_ONLINE_FRIENDS' : {
      return {
        ...state,
        onlineFriends: action.onlineFriends,
      }
    }

    case 'UPDATE_SUGGESTED_FRIENDS' : {
      return {
        ...state,
        suggestedFriends: action.suggestedFriends,
      }
    }

    case 'UPDATE_SEARCH' : {
      return {
        ...state,
        search: action.search,
      }
    }


    case 'UPDATE_EMOJIS' : {
      return {
        ...state,
        emojis: action.emojis,
      }
    }

    case 'UPDATE_STORE_EMOJIS' : {
      return {
        ...state,
        storeEmojis: action.storeEmojis,
      }
    }

    case 'UPDATE_USER_EMOJIS' : {
      return {
        ...state,
        userEmojis: action.userEmojis,
      }
    }

    case 'UPDATE_FRIEND_COUNT' : {
      return {
        ...state,
        friendCount: action.count,
      }
    }

    case 'INCREASE_FRIEND_COUNT' : {
      return {
        ...state,
        friendCount: state.friendCount++,
      }
    }

    case 'CREATE_ROOM' : {
      return {
        ...state,
        room: action.room
      }
    }

    case 'SEND_SOCKET' : {
      return {
        ...state,
        socket: action.socket
      }
    }

    default : 
      return state

    }
  }