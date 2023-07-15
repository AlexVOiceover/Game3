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

arrayCharacters = new Array(maxCharacters).fill("-");
arrayMorseTextbox.value = arrayCharacters.join(" ");

enableAudioSwitch.addEventListener("change", function () {
    // Toggle the disabled state of the button based on the switch state
    device.disabled = !enableAudioSwitch.checked;
    
    if (this.checked && decodedCharacters < maxCharacters) {
        audioEnabled = true;
    } else {
      console.log("dentro switch if " + decodedCharacters + " Max char " + maxCharacters );
        audioEnabled = false;
        this.checked = false;
        console.log("deviced disable for switch");
        device.disabled = true;
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

  let decodedCharacters = 0;

  const translateMorseCode = () => {

      if (decodedCharacters < maxCharacters) {
        // Stop last beep
        stopBeep();
        morseInput = morseTextbox.value.trim();
        const character = Object.keys(morseCode).find((key) => morseCode[key] === morseInput);
      
        // Find the first '-' in the array
        const index = arrayCharacters.indexOf("-");
      
        if (character && index !== -1) {
          // Replace the first '-' with the decoded character
          arrayCharacters[index] = character;
          
          
        } else if (index !== -1) {
          // If the Morse code is not recognized, replace the first '-' with '*'
          arrayCharacters[index] = "*";
        }
      
        decodedCharacters++;
      
        morseTextbox.value = "";
        morseInput = ""; // Reset morseInput
        arrayMorseTextbox.value = arrayCharacters.join(" ");
      
        // Check if the number of decoded characters has reached maxCharacters
        if (decodedCharacters === maxCharacters) {
          // Disable the device
          console.log("disable device for maxCharacters");
          device.disabled = true;
          // Uncheck the enableAudioSwitch
          enableAudioSwitch.checked = false;
        } else {
          // Reset tapCount and re-enable the device
          
          device.disabled = false;
        }
      tapCount = 0;
      }
      
  };
  
  deleteLastSignal.addEventListener("pointerdown", () => {
    console.log("pressed delete");
    if (decodedCharacters>0 & arrayCharacters.length > 0 && arrayCharacters[decodedCharacters - 1] !== "-") {
      console.log("Antes decoded characters " + decodedCharacters);
      console.log("Antes Array characters " + arrayCharacters);
      arrayCharacters[decodedCharacters - 1] = "-";
      decodedCharacters--;

      console.log("Despues decoded characters " + decodedCharacters);
      console.log("Despues Array characters " + arrayCharacters);
      
    // Manually trigger the change event on enableAudioSwitch
    enableAudioSwitch.checked = true;
    let event = new Event('change');
    enableAudioSwitch.dispatchEvent(event);

    }
    arrayMorseTextbox.value = arrayCharacters.join(" ");
    //console.log(arrayCharacters);
    //console.log("decoded characters" + decodedCharacters);
  });

  device.addEventListener("pointerdown", () => {    

    console.log("Boton decoded characters " + decodedCharacters);
    console.log("Boton Array characters " + arrayCharacters);

      if (device.disabled) return; 

      //Added to have haptic response
      if (navigator.vibrate) { // Check if the browser supports the Vibration API
        navigator.vibrate(75); // Vibrate for 200ms
      } else {
        console.log("Your browser does not support the Vibration API.");
      }

      tapCount++;

      // If tapCount has reached 5, disable the device and return
      if (tapCount > 5) {
        device.disabled = true;
        console.log("deviced disable for 5 taps");
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
