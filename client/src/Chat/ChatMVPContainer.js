import React from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'
import io from 'socket.io-client'
import * as userActions from '../Redux/userReducer'

class ChatMVPContainer extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    var track = window.stream.getTracks();  // if only one media track
    track.forEach(function(media) {
      media.stop();
    })
  }

  componentDidMount() {

     var socket = this.props.socket
     var isChannelReady = false;
     var isInitiator = false;
     var isStarted = false;
     var localStream;
     var pc;
     var remoteStream;
     var turnReady;
     var sentCall = false;

     var pcConfig = {
       'iceServers': [{
         'url': 'stun:stun.l.google.com:19302'
       }]
     };

     // Set up audio and video regardless of what devices are present.
     var sdpConstraints = {
       'mandatory': {
         'OfferToReceiveAudio': true,
         'OfferToReceiveVideo': true
       }
     };

     /////////////////////////////////////////////

     var room = this.props.room;
     if(this.props.room === this.props.user.username) {
       isInitiator = true;
     }
     // Could prompt for room name:
     // room = prompt('Enter room name:');
     console.log('this room', room)

     if (room !== '' && room !== this.props.user.username) {
       console.log('Attempted to create or  join room', room);
       socket.emit('create or join', room);
     }

     socket.on('created', function(room) {
       console.log('Created room ' + room);
       isInitiator = true;
     });

     socket.on('full', function(room) {
       console.log('Room ' + room + ' is full');
     });

     socket.on('join', function (room){
       // console.log('Another peer made a request to join room ' + room);
       // console.log('This peer is the initiator of room ' + room + '!');
       console.log('Both peers are ready in room ' + room + '!')
       isChannelReady = true;
     });

     socket.on('joined', function(room) {
       console.log('joined: ' + room);
       isChannelReady = true;
     });

     socket.on('log', function(array) {
       console.log.apply(console, array);
     });

     ////////////////////////////////////////////////

     function sendMessage(message) {
       console.log('Client sending message: ', message);
       socket.emit('message', message);
     }

     // This client receives a message
     socket.on('message', function(message) {
       console.log('Client received message:', message);
       if (message === 'got user media') {
         maybeStart();
       } else if (message.type === 'offer') {
         if (!isInitiator && !isStarted) {
           maybeStart();
         }
         console.log('offering message', message)
         pc.setRemoteDescription(new RTCSessionDescription(message));
         doAnswer();
       } else if (sentCall) {
        console.log('THIS IS THE LAST THING----------->')
         pc.setRemoteDescription(new RTCSessionDescription(message));
       } else if (message.type === 'candidate' && isStarted) {
         var candidate = new RTCIceCandidate({
           sdpMLineIndex: message.label,
           candidate: message.candidate
         });
         pc.addIceCandidate(candidate);
       } else if (message === 'bye' && isStarted) {
         handleRemoteHangup();
       }
     });

     ////////////////////////////////////////////////////

     var localVideo = document.querySelector('#localVideo');
     var remoteVideo = document.querySelector('#remoteVideo');

     console.log(navigator.mediaDevices);

     navigator.mediaDevices.getUserMedia({
       audio: true,
       video: true
     })
     .then(gotStream)
     .catch(function(e) {
       alert('getUserMedia() error: ' + e.name);
     });

     function gotStream(stream) {
       console.log('Adding local stream.');
       localVideo.src = window.URL.createObjectURL(stream);
       localStream = stream;
       window.stream = localStream;
       sendMessage('got user media');
       if (isInitiator) {
         maybeStart();
       }
     }

     var constraints = {
       video: true
     };

     // console.log('Getting user media with constraints', constraints);

     // if (location.hostname !== 'localhost') {
     //   requestTurn(
     //     'https://computeengineondemand.appspot.com/turn?username=41784574&key=4080218913'
     //   );
     // }

     function maybeStart() {
       console.log('>>>>>>> maybeStart() ', isStarted, localStream, isChannelReady);
       if (!isStarted && typeof localStream !== 'undefined' && isChannelReady) {
         console.log('>>>>>> creating peer connection');
         createPeerConnection();
         pc.addStream(localStream);
         isStarted = true;
         console.log('isInitiator', isInitiator);
         if (isInitiator) {
           doCall();
         }
       }
     }

     window.onbeforeunload = function() {
       sendMessage('bye');
     };

     /////////////////////////////////////////////////////////

     function createPeerConnection() {
       try {
         pc = new webkitRTCPeerConnection(null);
         pc.onicecandidate = handleIceCandidate;
         pc.onaddstream = handleRemoteStreamAdded;
         pc.onremovestream = handleRemoteStreamRemoved;
         console.log('Created RTCPeerConnnection');
       } catch (e) {
         console.log('Failed to create PeerConnection, exception: ' + e.message);
         alert('Cannot create RTCPeerConnection object.');
         return;
       }
     }

     function handleIceCandidate(event) {
       console.log('icecandidate event: ', event);
       if (event.candidate) {
         sendMessage({
           sessionDescription: {
             type: 'candidate',
             label: event.candidate.sdpMLineIndex,
             id: event.candidate.sdpMid,
             candidate: event.candidate.candidate
           },
           room: room
         });
       } else {
        
         document.getElementById("localVideo").muted = true;
         console.log('End of candidates.');
       }
     }

     function handleRemoteStreamAdded(event) {
       console.log('Remote stream added.');
       remoteVideo.src = window.URL.createObjectURL(event.stream);
       remoteStream = event.stream;
     }

     function handleCreateOfferError(event) {
       console.log('createOffer() error: ', event);
     }

     function doCall() {
       console.log('Sending offer to peer----------------------------<');
       sentCall = true;
       pc.createOffer(setLocalAndSendMessage, handleCreateOfferError);
     }

     function doAnswer() {
       console.log('Sending answer to peer.------------------------->');
       pc.createAnswer().then(
         setLocalAndSendMessageAnswer,
         onCreateSessionDescriptionError
       );
     }

     function setLocalAndSendMessage(sessionDescription) {
       // Set Opus as the preferred codec in SDP if Opus is present.
       //sessionDescription.sdp = preferOpus(sessionDescription.sdp);

       pc.setLocalDescription(sessionDescription);
       console.log('setLocalAndSendMessage sending message', sessionDescription);
       var wrapper = {sessionDescription:sessionDescription, room: room}
       sendMessage(wrapper);
     }

     function setLocalAndSendMessageAnswer(sessionDescription) {
       // Set Opus as the preferred codec in SDP if Opus is present.
       //sessionDescription.sdp = preferOpus(sessionDescription.sdp);

       pc.setLocalDescription(sessionDescription);
       console.log('setLocalAndSendMessage sending message', sessionDescription);
       sessionDescription['answer'] = true;
       console.log('this is the answer to the call', sessionDescription, ' ------------------------>')
       var wrapper = {sessionDescription:sessionDescription, room: room}
       sendMessage(wrapper);
     }

     function onCreateSessionDescriptionError(error) {
       trace('Failed to create session description: ' + error.toString());
     }

     function requestTurn(turnURL) {
       var turnExists = false;
       for (var i in pcConfig.iceServers) {
         if (pcConfig.iceServers[i].url.substr(0, 5) === 'turn:') {
           turnExists = true;
           turnReady = true;
           break;
         }
       }
       if (!turnExists) {
         console.log('Getting TURN server from ', turnURL);
         // No TURN server. Get one from computeengineondemand.appspot.com:
         var xhr = new XMLHttpRequest();
         xhr.onreadystatechange = function() {
           if (xhr.readyState === 4 && xhr.status === 200) {
             var turnServer = JSON.parse(xhr.responseText);
             console.log('Got TURN server: ', turnServer);
             pcConfig.iceServers.push({
               'url': 'turn:' + turnServer.username + '@' + turnServer.turn,
               'credential': turnServer.password
             });
             turnReady = true;
           }
         };
         xhr.open('GET', turnURL, true);
         xhr.send();
       }
     }

     function handleRemoteStreamAdded(event) {
       console.log('Remote stream added.');
       remoteVideo.src = window.URL.createObjectURL(event.stream);
       remoteStream = event.stream;
     }

     function handleRemoteStreamRemoved(event) {
       remoteStream.close()
       console.log('Remote stream removed. Event: ', event);
     }

     function hangup() {
       console.log('Hanging up.');
       stop();
       sendMessage('bye');
     }

     function handleRemoteHangup() {
       console.log('Session terminated.');
       stop();
       isInitiator = false;
     }

     function stop() {
       isStarted = false;
       isAudioMuted = false;
       isVideoMuted = false;
       remoteStream.close();
       pc.close();
       pc = null;
     }

     ///////////////////////////////////////////

     // Set Opus as the default audio codec if it's present.
     function preferOpus(sdp) {
       var sdpLines = sdp.split('\r\n');
       var mLineIndex;
       // Search for m line.
       for (var i = 0; i < sdpLines.length; i++) {
         if (sdpLines[i].search('m=audio') !== -1) {
           mLineIndex = i;
           break;
         }
       }
       if (mLineIndex === null) {
         return sdp;
       }

       // If Opus is available, set it as the default in m line.
       for (i = 0; i < sdpLines.length; i++) {
         if (sdpLines[i].search('opus/48000') !== -1) {
           var opusPayload = extractSdp(sdpLines[i], /:(\d+) opus\/48000/i);
           if (opusPayload) {
             sdpLines[mLineIndex] = setDefaultCodec(sdpLines[mLineIndex],
               opusPayload);
           }
           break;
         }
       }

       // Remove CN in m line and sdp.
       sdpLines = removeCN(sdpLines, mLineIndex);

       sdp = sdpLines.join('\r\n');
       return sdp;
     }

     function extractSdp(sdpLine, pattern) {
       var result = sdpLine.match(pattern);
       return result && result.length === 2 ? result[1] : null;
     }

     // Set the selected codec to the first in m line.
     function setDefaultCodec(mLine, payload) {
       var elements = mLine.split(' ');
       var newLine = [];
       var index = 0;
       for (var i = 0; i < elements.length; i++) {
         if (index === 3) { // Format of media starts from the fourth.
           newLine[index++] = payload; // Put target payload to the first.
         }
         if (elements[i] !== payload) {
           newLine[index++] = elements[i];
         }
       }
       return newLine.join(' ');
     }

     // Strip CN from sdp before CN constraints is ready.
     function removeCN(sdpLines, mLineIndex) {
       var mLineElements = sdpLines[mLineIndex].split(' ');
       // Scan from end for the convenience of removing an item.
       for (var i = sdpLines.length - 1; i >= 0; i--) {
         var payload = extractSdp(sdpLines[i], /a=rtpmap:(\d+) CN\/\d+/i);
         if (payload) {
           var cnPos = mLineElements.indexOf(payload);
           if (cnPos !== -1) {
             // Remove CN payload from m line.
             mLineElements.splice(cnPos, 1);
           }
           // Remove CN line in sdp
           sdpLines.splice(i, 1);
         }
       }

       sdpLines[mLineIndex] = mLineElements.join(' ');
       return sdpLines;
     }

  }



  render() {
    return (
      <div>
      <h1>Tok</h1>

      <div id="videos">
        <video id="localVideo" autoPlay></video>
        <video id="remoteVideo" autoPlay></video>
      </div>

      </div>
      )


  }

};


function mapStateToProps(state) {
  return {
    isLoggedIn: state.userReducer.isLoggedIn,
    user: state.userReducer.user,
    room: state.userReducer.room,
    socket: state.userReducer.socket
  }
}

export default connect(mapStateToProps)(ChatMVPContainer);