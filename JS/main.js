window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;

if ('SpeechRecognition' in window) {
    // speech recognition API supported
    console.log("Speech recognition API supported");
} else {
    // speech recognition API not supported
    console.log("Speech recognition API NOT supported");
}

const recognition = new SpeechRecognition();
recognition.continuous = true;

let tmp = 0;
recognition.onresult = (event) => {
    const speechToText = event.results[tmp][0].transcript;
    tmp++;

    console.log(speechToText);
};
recognition.start();

