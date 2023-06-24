document.addEventListener("DOMContentLoaded", () => {
    const morseButton = document.getElementById("morseButton");
    const morseTextbox = document.getElementById("morseTextbox");
  
    let pressStartTime;
    let pressDuration;
    let morseInput = "";
    let audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let oscillator;
  
    morseButton.addEventListener("pointerdown", () => {
      pressStartTime = new Date();
  
      oscillator = audioContext.createOscillator();
      oscillator.frequency.value = 750; // Set the frequency of the tone
      oscillator.type = "sine"; // Set the type of wave
      oscillator.connect(audioContext.destination);
      oscillator.start();
    });
  
    morseButton.addEventListener("pointerup", () => {
      pressDuration = new Date() - pressStartTime;
      const morseChar = pressDuration < 300 ? "." : "-"; // Threshold of 300ms to differentiate between dot and dash
      morseInput += morseChar;
  
      // Stop playing the tone
      oscillator.stop();
  
      // Update the textbox
      morseTextbox.value = morseInput;
    });
  });
  