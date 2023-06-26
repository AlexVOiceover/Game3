const frequency = 750;

document.addEventListener("DOMContentLoaded", () => {
  const morseButton = document.getElementById("morseButton");
  const morseTextbox = document.getElementById("morseTextbox");
  const enableAudioSwitch = document.getElementById("enableAudioSwitch");

  let pressStartTime;
  let pressDuration;
  let morseInput = "";
  let audioContext = new (window.AudioContext || window.webkitAudioContext)();
  let oscillator;
  let gainNode;
  let audioEnabled = false;
  let isPlaying = false;

  morseButton.disabled = true;

  morseButton.addEventListener("pointerdown", () => {
    // Add the 'pressed' class when the button is pressed
    morseButton.classList.add("pressed");
  });

  enableAudioSwitch.addEventListener("change", function () {
    // Toggle the disabled state of the button based on the switch state
    morseButton.disabled = !enableAudioSwitch.checked;
    
    if (this.checked) {
      audioEnabled = true;
    } else {
      audioEnabled = false;
    }
  });

  morseButton.addEventListener("pointerdown", () => {
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
    pressDuration = new Date() - pressStartTime;
    const morseChar = pressDuration < 300 ? "." : "-";
    morseInput += morseChar;
    morseButton.classList.remove("pressed");

    if (oscillator) {
      oscillator.stop();

      oscillator.onended = () => {
        gainNode.disconnect(audioContext.destination);
        oscillator.disconnect(gainNode);
        isPlaying = false;
      };
    }

    morseTextbox.value = morseInput;
  };

  morseButton.addEventListener("pointerup", stopBeep);
  morseButton.addEventListener("pointerleave", stopBeep);
  morseButton.addEventListener("pointercancel", stopBeep);


});
