const frequency = 1000;
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
    const timeBetweenCharacters = 800;
    const minDurationDash = 150;
  
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

    enableAudioSwitch.addEventListener("change", function () {
        // Toggle the disabled state of the button based on the switch state
        device.disabled = !enableAudioSwitch.checked;
        
        if (this.checked) {
            audioEnabled = true;
        } else {
            audioEnabled = false;
        }
    });

    muteButton.addEventListener("pointerdown", () => {
      isMuted = !isMuted;
      // Toggle the 'muted' subclass based on the isMuted variable
      muteButton.classList.toggle("muted", isMuted);
    });

    let translationTimeout;

    const translateMorseCode = () => {
     // console.log("Dentro translateMorseCode" +morseInput);
      morseInput = morseTextbox.value.trim();
      const character = Object.keys(morseCode).find((key) => morseCode[key] === morseInput);
  
      //Adding as String, modify to use array
      if (character) {
       // console.log("Dentro if character antes" +morseInput);
        arrayMorseTextbox.value += character;
        morseInput = "";
        // console.log("Dentro if character despues" +morseInput);
   
      } else {
        arrayMorseTextbox.value += "*";
        morseInput = "";
  
      }
      morseTextbox.value = "";
  };
  
  //This also needs to be modified if change to array
  deleteLastSignal.addEventListener("pointerdown", () => {
    // Check if arrayMorseTextbox.value is not empty
    if (arrayMorseTextbox.value.length > 0) {
      // Remove the last character of the string
      arrayMorseTextbox.value = arrayMorseTextbox.value.slice(0, -1);
    }
  });
  
    device.addEventListener("pointerdown", () => {
        if (device.disabled) return; 

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
        // console.log("Dentro stopBeep" +morseInput);
        morseTextbox.value = morseInput;
        isStopBeepCalled = true;
    };

    device.addEventListener("pointerup", stopBeep);
    device.addEventListener("pointerleave", stopBeep);
    device.addEventListener("pointercancel", stopBeep);
});