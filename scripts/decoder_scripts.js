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
  let gainNode; // Move gainNode to the global scope
  let audioEnabled = false;
  let isPlaying = false; // Add isPlaying flag

  enableAudioSwitch.addEventListener("change", function () {
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

      oscillator.type = "sine"; // Set the type of wave
      oscillator.frequency.value = frequency; // Set the frequency of the tone

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.start();

      isPlaying = true; // Set isPlaying flag to true
    }
  });

  morseButton.addEventListener("pointerup", () => {
    pressDuration = new Date() - pressStartTime;
    const morseChar = pressDuration < 300 ? "." : "-"; // Threshold of 300ms to differentiate between dot and dash
    morseInput += morseChar;

    // Stop playing the tone
    if (oscillator) {
      oscillator.stop();

      // Add this line to release resources after the tone has played
      oscillator.onended = () => {
        gainNode.disconnect(audioContext.destination);
        oscillator.disconnect(gainNode);
        isPlaying = false; // Set isPlaying flag to false
      };
    }

    // Update the textbox
    morseTextbox.value = morseInput;
  });
});