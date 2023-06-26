const frequency = 750;

document.addEventListener("DOMContentLoaded", () => {
  const morseButton = document.getElementById("morseButton");
  const morseTextbox = document.getElementById("morseTextbox");
  const arrayMorseTextbox = document.getElementById("arrayMorseTextbox");
  const enableAudioSwitch = document.getElementById("enableAudioSwitch");

  let pressStartTime;
  let pressDuration;
  let morseInput = "";
  let audioContext = new (window.AudioContext || window.webkitAudioContext)();
  let oscillator;
  let gainNode;
  let audioEnabled = false;
  let isPlaying = false;
  let isStopBeepCalled = false; //Needed to dont call stopBeeo twice
  const timeBetweenCharacters = 800;

  const morseCode = {
    'A': '.-',    'B': '-...',  'C': '-.-.',  'D': '-..',   'E': '.',
    'F': '..-.',  'G': '--.',   'H': '....',  'I': '..',    'J': '.---',
    'K': '-.-',   'L': '.-..',  'M': '--',    'N': '-.',    'O': '---',
    'P': '.--.',  'Q': '--.-',  'R': '.-.',   'S': '...',   'T': '-',
    'U': '..-',   'V': '...-',  'W': '.--',   'X': '-..-',  'Y': '-.--',
    'Z': '--..',  '0': '-----', '1': '.----', '2': '..---', '3': '...--',
    '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.'
};

  morseButton.disabled = true;

  enableAudioSwitch.addEventListener("change", function () {
    // Toggle the disabled state of the button based on the switch state
    morseButton.disabled = !enableAudioSwitch.checked;
    
    if (this.checked) {
      audioEnabled = true;
    } else {
      audioEnabled = false;
    }
  });

  let translationTimeout;

  const translateMorseCode = () => {

    const morseInput = morseTextbox.value.trim();
    const character = Object.keys(morseCode).find((key) => morseCode[key] === morseInput);

    if (character) {
      arrayMorseTextbox.value += character;
    } else {
      arrayMorseTextbox.value += "*";
    }

    morseTextbox.value = "";
};

  morseButton.addEventListener("pointerdown", () => {
    if (!morseButton.disabled) {
      // Add the 'pressed' class when the button is pressed
      morseButton.classList.add("pressed");
    }

    isStopBeepCalled = false;

    pressStartTime = new Date();

    if (audioEnabled) {
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }

      if (isPlaying && oscillator) {
        oscillator.stop();
      }

      oscillator = audioContext.createOscillator();
      gainNode = audioContext.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = frequency;

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.start();

      isPlaying = true;
    }
  });

  const stopBeep = () => {
    if (isStopBeepCalled) {
      return;
    }

    if (!morseButton.disabled) {
      pressDuration = new Date() - pressStartTime;
      const morseChar = pressDuration < 300 ? "." : "-";
      morseInput += morseChar;
      morseButton.classList.remove("pressed");
    }

    if (oscillator) {
      oscillator.stop();

      oscillator.onended = () => {
        gainNode.disconnect(audioContext.destination);
        oscillator.disconnect(gainNode);
        isPlaying = false;
      };
    }

    clearTimeout(translationTimeout);
    translationTimeout = setTimeout(translateMorseCode, timeBetweenCharacters);

    morseTextbox.value = morseInput;
    isStopBeepCalled = true;
  };

  morseButton.addEventListener("pointerup", stopBeep);
  morseButton.addEventListener("pointerleave", stopBeep);
  morseButton.addEventListener("pointercancel", stopBeep);
});
