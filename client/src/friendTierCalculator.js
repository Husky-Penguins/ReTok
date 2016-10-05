// score formula is (Constant / ((videoChatWeight * videoChatCount + textChatWeight * textChatCount) + 1)) + days since last chat * 2

module.exports = (friends) => {
 
 // score calculator for a friend
  var friendScoreCal = (vCount, tCount, date) => {
    var constant = 30;
    var videoChatWeight = 0.7;
    var textChatWeight = 1 - videoChatWeight;
    var max = 1000;
    var min = 5;

    var countComponent = constant / ((videoChatWeight * vCount + textChatWeight * tCount) + 1);

    var currentDate = new Date();
    var timeDiff = date ? Math.abs(currentDate.getTime() - date.getTime()) : 0;
    var diffDaysComponent = Math.ceil(timeDiff / (1000 * 3600 * 24)) * 2;

    var score = countComponent + diffDaysComponent;

    if (score > max) {return max;} // max score
    else if (score < min) {return min;} // min score
    else {return Math.floor(score);} // round the score

 };

 //update friend list array with scores
  friends.forEach((friend) => {
    
    friend['score'] = friendScoreCal(friend.videoChatCount, friend.textChatCount, friend.dateLastChat);
  });

 //return the updated friend list
  return friends;

};