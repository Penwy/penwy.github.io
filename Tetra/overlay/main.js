var channels = ['tetra'], // Channels to initially join
	fadeDelay = 5000, // Set to false to disable chat fade
	showChannel = true, // Show repespective channels if the channels is longer than 1
	useColor = true, // Use chatters' colors or to inherit
	showBadges = true, // Show chatters' badges
	showEmotes = true, // Show emotes in the chat
	doTimeouts = true, // Hide the messages of people who are timed-out
	doChatClears = true, // Hide the chat from an entire channel
	showHosting = true, // Show when the channel is hosting or not
	showConnectionNotices = true, // Show messages like "Connected" and "Disconnected"
    donatorsList = {},
    orderedList = [];





var chat = document.getElementById('chat'),
	defaultColors = ['rgb(255, 0, 0)','rgb(0, 0, 255)','rgb(0, 128, 0)','rgb(178, 34, 34)','rgb(255, 127, 80)','rgb(154, 205, 50)','rgb(255, 69, 0)','rgb(46, 139, 87)','rgb(218, 165, 32)','rgb(210, 105, 30)','rgb(95, 158, 160)','rgb(30, 144, 255)','rgb(255, 105, 180)','rgb(138, 43, 226)','rgb(0, 255, 127)'],
	randomColorsChosen = {},
	clientOptions = {
			options: {
					debug: true
				},
			channels: channels
		},
	client = new tmi.client(clientOptions);

function dehash(channel) {
	return channel.replace(/^#/, '');
}

function capitalize(n) {
	return n[0].toUpperCase() +  n.substr(1);
}

function htmlEntities(html) {
	function it() {
		return html.map(function(n, i, arr) {
				if(n.length == 1) {
					return n.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
						   return '&#'+i.charCodeAt(0)+';';
						});
				}
				return n;
			});
	}
	var isArray = Array.isArray(html);
	if(!isArray) {
		html = html.split('');
	}
	html = it(html);
	if(!isArray) html = html.join('');
	return html;
}

function formatEmotes(text, emotes) {
	var splitText = text.split('');
	for(var i in emotes) {
		var e = emotes[i];
		for(var j in e) {
			var mote = e[j];
			if(typeof mote == 'string') {
				mote = mote.split('-');
				mote = [parseInt(mote[0]), parseInt(mote[1])];
				var length =  mote[1] - mote[0],
					empty = Array.apply(null, new Array(length + 1)).map(function() { return '' });
				splitText = splitText.slice(0, mote[0]).concat(empty).concat(splitText.slice(mote[1] + 1, splitText.length));
				splitText.splice(mote[0], 1, '<img class="emoticon" src="http://static-cdn.jtvnw.net/emoticons/v1/' + i + '/3.0">');
			}
		}
	}
	return htmlEntities(splitText).join('')
}

function badges(chan, user, isBot) {
	
	function createBadge(name) {
		var badge = document.createElement('div');
		badge.className = 'chat-badge-' + name;
		return badge;
	}
	
	var chatBadges = document.createElement('span');
	chatBadges.className = 'chat-badges';
	
	if(!isBot) {
		if(user.username == chan) {
			chatBadges.appendChild(createBadge('broadcaster'));
		}
		if(user['user-type']) {
			chatBadges.appendChild(createBadge(user['user-type']));
		}
		if(user.turbo) {
			chatBadges.appendChild(createBadge('turbo'));
		}
	}
	else {
		chatChages.appendChild(createBadge('bot'));
	}
	
	return chatBadges;
}

function handleChat(channel, user, message, self) {
	
    console.log(user)
	var chan = dehash(channel),
        name = user.username,
        dName = user['display-name'] || user.username,
        userID = user['user-id'],
		chatLine = document.createElement('div'),
		chatChannel = document.createElement('span'),
		chatName = document.createElement('span'),
		chatColon = document.createElement('span'),
		chatMessage = document.createElement('span');

        console.log(dName)
    if (user.bits) {
        if (donatorsList[userID]) {
            donatorsList[userID].amount += parseInt(user.bits)
            donatorsList[userID].name = dName
        } else {
            donatorsList[userID] = {'amount' : parseInt(user.bits), 'name' : dName}
        }
    }

    topAmount = orderedList[0] ? orderedList[0][1] : 0
    donatorsList[userID].amount = Math.min(donatorsList[userID].amount, topAmount + 500)


    let prev = orderedList[0]

    orderedList = []
    for (let [key, value] of Object.entries(donatorsList)) {
        orderedList.push([value.name, value.amount])
    }
    orderedList.sort(([,a],[,b]) => b-a)

    if (prev && orderedList[0] && orderedList[1] && orderedList[0][1] == orderedList[1][1] && orderedList[1][0] == prev[0]) {
        [orderedList[0], orderedList[1] ] = [orderedList[1], orderedList[0]]
    }

    if (orderedList[0]){
        document.getElementById('First').innerHTML = `First : ${orderedList[0][0]} (${orderedList[0][1]})`
    }
    if (orderedList[1]){
        document.getElementById('Second').innerHTML = `${orderedList[1][0]} (${orderedList[1][1]})`
    }
    if (orderedList[2]){
        document.getElementById('Third').innerHTML = `${orderedList[2][0]} (${orderedList[2][1]})`
    }


	
}

client.addListener('cheer', handleChat);

client.addListener('crash', function () {
		chatNotice('Crashed', 10000, 4, 'chat-crash');
	});

client.connect();