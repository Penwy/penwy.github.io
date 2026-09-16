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

function handleRaid(channel, raider, count, self) {
	
    console.log(raider)
    console.log(count)
    text = document.getElementById("raidtext_inner");
    text.innerHTML = raider + " crashed in,<br>causing " + count + " fatalities."
    setTimeout(showText, 5000);
    setTimeout(hideText, 10000);

    video = document.getElementById("videoframe");
    video.play();
	
}

function hideText() {
    text = document.getElementById("raidtext_inner");
    text.style.display = 'none'
}

function showText() {
    text = document.getElementById("raidtext_inner");
    text.style.display = 'block'
}

client.addListener('raided', handleRaid);


client.connect();