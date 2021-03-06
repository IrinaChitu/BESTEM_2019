//-- Speaker Identification methods
// 1. Start the browser listening, listen for 15 seconds, pass the audio stream to "createProfile"

function getProfiles() {
	return profileIds;
}

function loadProfiles() {
	var create = 'https://westus.api.cognitive.microsoft.com/spid/v1.0/identificationProfiles';

	var request = new XMLHttpRequest();
	request.open("GET", create, true);

	request.setRequestHeader('Content-Type','application/json');
	request.setRequestHeader('Ocp-Apim-Subscription-Key', key);

	request.onload = function () {
		var json = JSON.parse(request.responseText);
		for (var i = 0; i < json.length; ++i) {
			var profileId = json[i].identificationProfileId;

			var docRef = db.collection("Users").doc(profileId);

			var name = docRef.get().then(function(doc) {
				if (doc.exists) {
					profileIds.push(new Profile(doc.data().nume, doc.data().profileID));
					console.log("Document data:", doc.data());
				} else {
					// doc.data() will be undefined in this case
					// doc.data().name = "";
					console.log("No such document!");
				}
				}).catch(function(error) {
					console.log("Error getting document:", error);
			});
		}

		if (json.status == 'succeeded') {
			clearInterval(interval);
		}
	};

	request.send();
}

function enrollNewProfile(){
	navigator.getUserMedia({audio: true}, function(stream){
		console.log('I\'m listening... just start talking for a few seconds...');
		console.log('Maybe read this: \n' + thingsToRead[Math.floor(Math.random() * thingsToRead.length)]);

		document.getElementById("textToRead").innerHTML = thingsToRead[Math.floor(Math.random() * thingsToRead.length)];
		
		var k = 0;
		var interval = setInterval(function() {
			document.getElementById("readyToSpeak").innerText = 14-k;
			console.log(k);
			++k;
		}, 1000);
		setTimeout(function() {
			document.getElementById("readyToSpeak").style.display = "none";
			clearInterval(interval);
		}, 15000);

		onMediaSuccess(stream, createProfile, 15);
	}, onMediaError);
}

function createProfile(blob){

	var create = 'https://westus.api.cognitive.microsoft.com/spid/v1.0/identificationProfiles';

	var request = new XMLHttpRequest();
	request.open("POST", create, true);

	request.setRequestHeader('Content-Type','application/json');
	request.setRequestHeader('Ocp-Apim-Subscription-Key', key);

	request.onload = function () {
		console.log('creating profile');
		console.log(request.responseText);

		var json = JSON.parse(request.responseText);
		var profileId = json.identificationProfileId;

		// Now we can enrol this profile using the profileId
		enrollProfileAudio(blob, profileId);
	};

	request.send(JSON.stringify({ 'locale' :'en-us'}));
}

// enrollProfileAudio enrolls the recorded audio with the new profile Id, polling the status
function enrollProfileAudio(blob, profileId){
  var enroll = 'https://westus.api.cognitive.microsoft.com/spid/v1.0/identificationProfiles/'+profileId+'/enroll?shortAudio=true';

  var request = new XMLHttpRequest();
  request.open("POST", enroll, true);
  
  request.setRequestHeader('Content-Type','multipart/form-data');
  request.setRequestHeader('Ocp-Apim-Subscription-Key', key);

  request.onload = function () {
  	console.log('enrolling');
	console.log(request.responseText);
	
	// The response contains a location to poll for status
    var location = request.getResponseHeader('Operation-Location');

	if (location!=null) {
		// ping that location to get the enrollment status
    	pollForEnrollment(location, profileId);
	} else {
		console.log('Ugh. I can\'t poll, it\'s all gone wrong.');
	}
  };

  request.send(blob);
}

// Ping the status endpoint to see if the enrollment for identification has completed
function pollForEnrollment(location, profileId){
	var enrolledInterval;

	// hit the endpoint every few seconds 
	enrolledInterval = setInterval(function()
	{
		var request = new XMLHttpRequest();
		request.open("GET", location, true);

		request.setRequestHeader('Content-Type','multipart/form-data');
		request.setRequestHeader('Ocp-Apim-Subscription-Key', key);

		request.onload = function()
		{
			console.log('getting status');
			console.log(request.responseText);

			var json = JSON.parse(request.responseText);
			if (json.status == 'succeeded' && json.processingResult.enrollmentStatus == 'Enrolled')
			{
				// Woohoo! The audio was enrolled successfully! 

				// stop polling
				clearInterval(enrolledInterval);
				console.log('enrollment complete!');

				// ask for a name to associated with the ID to make the identification nicer
				var firstname = document.getElementsByName("firstname")[0].value;
				var lastname = document.getElementsByName("lastname")[0].value;
				var name = firstname + " " + lastname;

				// localStorage.setItem(profileId, name);

				db.collection("Users").doc(profileId).set({
					nume : name,
					profileID : profileId
				});
				profileIds.push(new Profile(name, profileId));
				
				console.log(profileId + ' is now mapped to ' + name);
			}
			else if(json.status == 'succeeded' && json.processingResult.remainingEnrollmentSpeechTime > 0) {
				// stop polling, the audio wasn't viable
				clearInterval(enrolledInterval);
				console.log('That audio wasn\'t long enough to use');
			}
			else 
			{
				// keep polling
				console.log('Not done yet..');
			}
		};

		request.send();
	}, 1000);
}

// 2. Start the browser listening, listen for 10 seconds, pass the audio stream to "identifyProfile"
function startListeningForIdentification(){
	if (profileIds.length > 0 ){
		console.log('I\'m listening... just start talking for a few seconds...');
		console.log('Maybe read this: \n' + thingsToRead[Math.floor(Math.random() * thingsToRead.length)]);
		navigator.getUserMedia({audio: true}, function(stream){onMediaSuccess(stream, identifyProfile, 10)}, onMediaError);
	} else {
		console.log('No profiles enrolled yet! Click the other button...');
	}
}

// 3. Take the audio and send it to the identification endpoint
function identifyProfile(blob){
	// comma delimited list of profile IDs we're interested in comparing against
	var Ids = profileIds.map(x => x.profileId).join();

	var identify = 'https://westus.api.cognitive.microsoft.com/spid/v1.0/identify?identificationProfileIds=' 
		+ Ids 
		+ '&shortAudio=true';
  
	var request = new XMLHttpRequest();
	request.open("POST", identify, true);
	
	request.setRequestHeader('Content-Type','application/json');
	request.setRequestHeader('Ocp-Apim-Subscription-Key', key);
  
	request.onload = function () {
		console.log('identifying profile');
		console.log(request.responseText);

		// The response contains a location to poll for status
		var location = request.getResponseHeader('Operation-Location');

		if (location!=null) {
			// ping that location to get the identification status
			pollForIdentification(location);
		} else {
			console.log('Ugh. I can\'t poll, it\'s all gone wrong.');
		}
	};
  
	request.send(blob);
}

// Ping the status endpoint to see if the identification has completed
function pollForIdentification(location){
	var identifiedInterval;

	// hit the endpoint every few seconds 
	identifiedInterval = setInterval(function()
	{
		var request = new XMLHttpRequest();
		request.open("GET", location, true);

		request.setRequestHeader('Content-Type','multipart/form-data');
		request.setRequestHeader('Ocp-Apim-Subscription-Key', key);

		request.onload = function()
		{
			console.log('getting status');
			console.log(request.responseText);

			var json = JSON.parse(request.responseText);
			if (json.status == 'succeeded')
			{
				// Identification process has completed
				clearInterval(identifiedInterval);
				var speaker = profileIds.filter(function(p){return p.profileId == json.processingResult.identifiedProfileId});
				
				if (speaker != null && speaker.length > 0){
					console.log('I think ' + speaker[0].name + ' was talking');
					console.log(speaker[0]);
				} else {
					console.log('I couldn\'t tell who was talking. So embarrassing.');
				}
			}
			else 
			{
				// Not done yet			
				console.log('still thinking..');
				console.log(json);
			}
		};

		request.send();
	}, 500);
}

//-- If it looks like the profiles are messed up, kick off "BurnItAll" to delete all profile data
// BurnItAll('identification') - clear identification profiles
// BurnItAll('verification') - clear verification profiles
function BurnItAll(mode = 'identification'){
	// brute force delete everything - keep retrying until it's empty
	var listing = 'https://westus.api.cognitive.microsoft.com/spid/v1.0/' + mode + 'Profiles';

	var request = new XMLHttpRequest();
	request.open("GET", listing, true);

	request.setRequestHeader('Content-Type','multipart/form-data');
	request.setRequestHeader('Ocp-Apim-Subscription-Key', key);

	request.onload = function () {
		var json = JSON.parse(request.responseText);
		for(var x in json){
			if (json[x][mode + 'ProfileId'] == undefined) {continue;}
			var request2 = new XMLHttpRequest();
			request2.open("DELETE", listing + '/'+ json[x][mode + 'ProfileId'], true);

			request2.setRequestHeader('Content-Type','multipart/form-data');
			request2.setRequestHeader('Ocp-Apim-Subscription-Key', key);
			request2.onload = function(){
				console.log(request2.responseText);
			};
			request2.send();
		}
	};

		localStorage.clear();
	request.send();
}

// Example phrases
var thingsToRead = [
	"Never gonna give you up\nNever gonna let you down\nNever gonna run around and desert you\nNever gonna make you cry\nNever gonna say goodbye\nNever gonna tell a lie and hurt you",
	"There's a voice that keeps on calling me\n	Down the road, that's where I'll always be.\n	Every stop I make, I make a new friend,\n	Can't stay for long, just turn around and I'm gone again\n	\n	Maybe tomorrow, I'll want to settle down,\n	Until tomorrow, I'll just keep moving on.\n	\n	Down this road that never seems to end,\n	Where new adventure lies just around the bend.\n	So if you want to join me for a while,\n	Just grab your hat, come travel light, that's hobo style.",
	"They're the world's most fearsome fighting team \n	They're heroes in a half-shell and they're green\n	When the evil Shredder attacks\n	These Turtle boys don't cut him no slack! \n	Teenage Mutant Ninja Turtles\nTeenage Mutant Ninja Turtles",
	"If you're seein' things runnin' thru your head \n	Who can you call (ghostbusters)\n	An' invisible man sleepin' in your bed \n	Oh who ya gonna call (ghostbusters) \nI ain't afraid a no ghost \n	I ain't afraid a no ghost \n	Who ya gonna call (ghostbusters) \n	If you're all alone pick up the phone \n	An call (ghostbusters)",
];

// The Cognitive Services key
var key = "ae0dd6bd40da4f7b983018f2777c5af3";

// Speaker Recognition API profile configuration - constructs to make management easier
var Profile = class {
	constructor (name, profileId) {
		this.name = name; this.profileId = profileId;
	}

	getName() {
		return this.name;
	}
};
var profileIds = [];

// (function () {
// 	// Cross browser sound recording using the web audio API
// 	navigator.getUserMedia = ( navigator.getUserMedia ||
// 							navigator.webkitGetUserMedia ||
// 							navigator.mozGetUserMedia ||
// 							navigator.msGetUserMedia);

// 	// Really easy way to dump the console logs to the page
// 	var old = console.log;
// 	var logger = document.getElementById('log');
// 	var isScrolledToBottom = logger.scrollHeight - logger.clientHeight <= logger.scrollTop + 1;
    
// 	console.log = function () {
// 		for (var i = 0; i < arguments.length; i++) {
// 			if (typeof arguments[i] == 'object') {
// 				logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i]) + '<br />';
// 			} else {
// 				logger.innerHTML += arguments[i] + '<br />';
// 			}
// 			if(isScrolledToBottom) logger.scrollTop = logger.scrollHeight - logger.clientHeight;
// 		}
// 		old(...arguments);
// 	}
// 	console.error = console.log; 
// })();


var recorder;
var audio_context;

function onMediaSuccess(stream, callback, secondsOfAudio) {
    audio_context = audio_context || new window.AudioContext;
    var input = audio_context.createMediaStreamSource(stream);
    recorder = new Recorder(input);
    recorder.record();
    
	setTimeout(() => { StopListening(callback); }, secondsOfAudio*1000);
}

function onMediaError(e) {
    console.error('media error', e);
}

function StopListening(callback){
	console.log('...working...');
    recorder && recorder.stop();
    recorder.exportWAV(function(blob) {
        callback(blob);
    });
    recorder.clear();
}