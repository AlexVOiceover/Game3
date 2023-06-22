const maxDegrees = 2;
let xdeviation = 0;
let ydeviation = 0;

const playAudio = (src, callback) => {
  const audio = new Audio(src);
  audio.play();
  audio.addEventListener("ended", callback);
};

const backgroundMusic = document.getElementById("backgroundMusic");
backgroundMusic.volume = 0.5; // Adjust the volume as needed

document.getElementById("resetPosition").addEventListener("click", () => {
  xdeviation = x;
  ydeviation = y;
});


document.getElementById("startTransmissionButton").addEventListener("click", () => {
  if (backgroundMusic.paused) {
    backgroundMusic.play();
  } else {
    backgroundMusic.pause();
  }
});

//Declare the coordinates of the dot
let x = 0;
let y = 0;

window.addEventListener("deviceorientation", (event) => {
  const roll = event.gamma; // Roll value in degrees

  let horTextboxValue = 0;

  if (roll <= (-1*maxDegrees)){
    horTextboxValue = -1}
  else if (roll >= maxDegrees){
    horTextboxValue = 1}
  else {
    horTextboxValue =  roll/maxDegrees }
  
  // Round the textbox value to 5 decimal places
  horTextboxValue = parseFloat(horTextboxValue.toFixed(4));

  // Update the textbox value
  document.getElementById("horizontalTextbox").value = horTextboxValue.toFixed(4);

  // Calculate the x coordinate for the dot
  x = ((horTextboxValue + 1) / 2) * canvas.width - canvas.width / 2;

  updateDotPosition();

  // Update the playback rate of the background music
  backgroundMusic.playbackRate = horTextboxValue;
});

window.addEventListener("deviceorientation", (event) => {
  const pitch = event.beta; // Pitch value in degrees
  let verTextboxValue = 0;

  if (pitch <= (-1*maxDegrees)){
    verTextboxValue = -1}
  else if (pitch >= maxDegrees){
    verTextboxValue = 1}
  else {
    verTextboxValue =  pitch/maxDegrees}
  
  // Round the textbox value to 5 decimal places
  verTextboxValue = parseFloat(verTextboxValue.toFixed(4));

  // Update the textbox value
  document.getElementById("verticalTextbox").value = verTextboxValue.toFixed(4);

   // Calculate the y coordinate for the dot
   y = ((verTextboxValue + 1) / 2) * canvas.height - canvas.height / 2;

   updateDotPosition();

});

const canvas = document.getElementById("dotCanvas");
const ctx = canvas.getContext("2d");

function drawDot(x, y) {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  ctx.beginPath();
  ctx.arc(x-xdeviation, y-ydeviation, 5, 0, 2 * Math.PI); // Draw a dot with a radius of 5
  ctx.fillStyle = "white";
  ctx.fill();
}

function updateDotPosition() {
  drawDot(x, y);
}



//Function to play a tone given a frequency and duration
let audioContext;
function playTone(frequency, duration) {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.01);
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration - 0.01);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);

  // Add this line to release resources after the tone has played
  oscillator.onended = () => {
    gainNode.disconnect(audioContext.destination);
    oscillator.disconnect(gainNode);
  };
}

function playMorseCode(char) {
  const morseCode = {
      'A': '.-',    'B': '-...',  'C': '-.-.',  'D': '-..',   'E': '.',
      'F': '..-.',  'G': '--.',   'H': '....',  'I': '..',    'J': '.---',
      'K': '-.-',   'L': '.-..',  'M': '--',    'N': '-.',    'O': '---',
      'P': '.--.',  'Q': '--.-',  'R': '.-.',   'S': '...',   'T': '-',
      'U': '..-',   'V': '...-',  'W': '.--',   'X': '-..-',  'Y': '-.--',
      'Z': '--..',  '0': '-----', '1': '.----', '2': '..---', '3': '...--',
      '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.'
  };

  const multiplier = 1;

  const dotDuration = 0.1 * multiplier; // 100ms
  const dashDuration = 0.3 * multiplier; // 300ms
  const gapDuration = 0.3 * multiplier; // 100ms
  const frequency = 2000; // 1000Hz

  const code = morseCode[char.toUpperCase()];
  let currentTime = 0;

  for (let i = 0; i < code.length; i++) {
      setTimeout(() => {
          playTone(frequency, code[i] === '.' ? dotDuration : dashDuration);
      }, currentTime * 1000);

      currentTime += (code[i] === '.' ? dotDuration : dashDuration) + gapDuration;
  }
}

document.getElementById("playMorseCode").addEventListener("click", () => {
  const inputChar = document.getElementById("inputChar").value;
  if (inputChar.length === 1) {
      playMorseCode(inputChar);
  }
});


