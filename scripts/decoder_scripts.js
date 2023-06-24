let activated = false;

document.addEventListener("DOMContentLoaded", () => {
    const morseButton = document.getElementById("morseButton");
    const morseTextbox = document.getElementById("morseTextbox");
    const enableAudioButton = document.getElementById("enableAudioButton");
  
    let pressStartTime;
    let pressDuration;
    let morseInput = "";
    let audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let oscillator;
    let audioEnabled = false;

    enableAudioButton.addEventListener("change", function () {
        if (this.checked) {
          activated = true;
          } else {
          activated = false;
        }
      });

  
    enableAudioButton.addEventListener("click", () => {
      audioEnabled = true;
      enableAudioButton.disabled = true;
    });
  
    morseButton.addEventListener("pointerdown", () => {
      pressStartTime = new Date();
  
      if (audioEnabled) {
        oscillator = audioContext.createOscillator();
        oscillator.frequency.value = 750; // Set the frequency of the tone
        oscillator.type = "sine"; // Set the type of wave
        oscillator.connect(audioContext.destination);
        oscillator.start();
      }
    });
  
    morseButton.addEventListener("pointerup", () => {
      pressDuration = new Date() - pressStartTime;
      const morseChar = pressDuration < 300 ? "." : "-"; // Threshold of 300ms to differentiate between dot and dash
      morseInput += morseChar;
  
      if (audioEnabled) {
        // Stop playing the tone
        oscillator.stop();
      }
  
      // Update the textbox
      morseTextbox.value = morseInput;
    });
  });
  