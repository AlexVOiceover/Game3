const playAudio = (src, callback) => {
  const audio = new Audio(src);
  audio.play();
  audio.addEventListener("ended", callback);
};

const backgroundMusic = document.getElementById("backgroundMusic");
backgroundMusic.volume = 0.5; // Adjust the volume as needed

document.getElementById("startTransmissionButton").addEventListener("click", () => {
  if (backgroundMusic.paused) {
    backgroundMusic.play();
  } else {
    backgroundMusic.pause();
  }
});

/*
window.addEventListener("deviceorientation", handleOrientation, true);

function handleOrientation(event) {
  const roll = event.gamma; // Roll angle in degrees
  const motionData = document.getElementById("motion-data");

  if (motionData) {
    motionData.innerHTML = `Roll: ${roll?.toFixed(2) || 'N/A'}`;
  }
} */

window.addEventListener("deviceorientation", (event) => {
  const roll = event.gamma; // Roll value in degrees
  const minRoll = -20; // Minimum roll value
  const maxRoll = 20; // Maximum roll value
  const minValue = 0.5; // Minimum value of the slider
  const maxValue = 2; // Maximum value of the slider

  // Calculate the value based on the roll value
  const sliderValue = ((roll - minRoll) / (maxRoll - minRoll)) * (maxValue - minValue) + minValue;

  // Update the slider value
  document.getElementById("musicSpeedSlider").value = sliderValue;

  // Update the textbox value
  document.getElementById("sliderValueTextbox").value = sliderValue;

  // Update the playback rate of the background music
  backgroundMusic.playbackRate = sliderValue;
});

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

document.getElementById("musicSpeedSlider").addEventListener("input", () => {
  const sliderValue = document.getElementById("musicSpeedSlider").value;
  backgroundMusic.playbackRate = sliderValue;
  document.getElementById("sliderValueTextbox").value = sliderValue; // Update the textbox value
});

