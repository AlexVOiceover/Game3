const frequency = 1000;
const volume = 0.5;
let isMuted = false;

document.addEventListener("DOMContentLoaded", () => {
    const muteButton = document.getElementById("muteButton");
    const device = document.getElementById("device");
    const morseTextbox = document.getElementById("morseTextbox");
    const arrayMorseTextbox = document.getElementById("arrayMorseTextbox");
    const enableAudioSwitch = document.getElementById("enableAudioSwitch");
    const deleteLastSignal = document.getElementById("deleteLastSignal");

    let pressStartTime;
    let pressDuration;
    let morseInput = "";
    let audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let oscillator;
    let gainNode;
    let audioEnabled = false;
    let isPlaying = false;
    let isStopBeepCalled = false; //Needed to dont call stopBeep twice
    const timeBetweenCharacters = 1000;
    const minDurationDash = 150;
    let maxCharacters = 5;
    let tapCount = 0;
    let arrayCharacters = [];
  
    const morseCode = {
      'A': '.-',    'B': '-...',  'C': '-.-.',  'D': '-..',   'E': '.',
      'F': '..-.',  'G': '--.',   'H': '....',  'I': '..',    'J': '.---',
      'K': '-.-',   'L': '.-..',  'M': '--',    'N': '-.',    'O': '---',
      'P': '.--.',  'Q': '--.-',  'R': '.-.',   'S': '...',   'T': '-',
      'U': '..-',   'V': '...-',  'W': '.--',   'X': '-..-',  'Y': '-.--',
      'Z': '--..',  '0': '-----', '1': '.----', '2': '..---', '3': '...--',
      '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.'
  };
  
    //morseButton.disabled = true;
    device.disabled = true;

// Get the current URL
var url = new URL(window.location.href);
// Get the search parameters from the URL
var params = new URLSearchParams(url.search);
// Retrieve a specific parameter by name
var paramValue3 = params.get('param3');
switch (paramValue3) {
  case '1':
    maxCharacters = 3;
    break;
  case '2':
    maxCharacters = 4;
    break;
  default:
    maxCharacters = 5;
}

arrayCharacters = new Array(maxCharacters).fill("*");
console.log(arrayCharacters);
arrayMorseTextbox.value = arrayCharacters.join(" ");

enableAudioSwitch.addEventListener("change", function () {
    // Toggle the disabled state of the button based on the switch state
    device.disabled = !enableAudioSwitch.checked;
    
    if (this.checked) {
        audioEnabled = true;
    } else {
        audioEnabled = false;
    }
});

    // display instructionModal when instructionButton is clicked
    document.getElementById('instructionButton').addEventListener('click', function() {
    document.getElementById('instructionModal').style.display = 'block';
    });
  
    muteButton.addEventListener("pointerdown", () => {
      isMuted = !isMuted;
      // Toggle the 'muted' subclass based on the isMuted variable
      muteButton.classList.toggle("muted", isMuted);
    });

    let translationTimeout;

    const translateMorseCode = () => {
      morseInput = morseTextbox.value.trim();
      const character = Object.keys(morseCode).find((key) => morseCode[key] === morseInput);
  
      //Adding as String, modify to use array
      if (character) {
        arrayMorseTextbox.value += character;
        morseInput = "";
        
         // Check if the number of decoded characters has reached 5
        if (arrayMorseTextbox.value.length >= maxCharacters) {
            // Disable the device
            device.disabled = true;
            // Uncheck the enableAudioSwitch
            enableAudioSwitch.checked = false;
        }
   
      } else {
        arrayMorseTextbox.value += "*";
        morseInput = "";
      }
      morseTextbox.value = "";
      // After translation, reset tapCount and re-enable the device
      tapCount = 0;
      // Only re-enable the device if the maximum number of characters has not been reached
      if (arrayMorseTextbox.value.length < maxCharacters) {
        device.disabled = false;
      }
  };
  
  //This also needs to be modified if change to array
  deleteLastSignal.addEventListener("pointerdown", () => {
    // Check if arrayMorseTextbox.value is not empty
    
    if (arrayMorseTextbox.value.length > 0) {
      // Remove the last character of the string
      arrayMorseTextbox.value = arrayMorseTextbox.value.slice(0, -1);
      //Activate device and siwtch to carry one after deleting
      device.disabled = false;
      enableAudioSwitch.checked = true;
    }
  });
  
    device.addEventListener("pointerdown", () => {      

        if (device.disabled) return; 

        tapCount++;

        // If tapCount has reached 5, disable the device and return
         if (tapCount > 5) {
        device.disabled = true;
        return;
        }

        device.classList.add("down");
        isStopBeepCalled = false;
        pressStartTime = new Date();

        if (audioEnabled && !isMuted ) {
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
            gainNode.gain.value = volume;

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.start();

            isPlaying = true;
        }
    });

    const stopBeep = () => {
        if (device.disabled) return;
        if (isStopBeepCalled) {
            return;
        }

        if (!device.disabled) {
            pressDuration = new Date() - pressStartTime;
            const morseChar = pressDuration < minDurationDash ? "." : "-";
            morseInput += morseChar;
            device.classList.remove("down");
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

    device.addEventListener("pointerup", stopBeep);
    device.addEventListener("pointerleave", stopBeep);
    device.addEventListener("pointercancel", stopBeep);
});
