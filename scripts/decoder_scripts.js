let arrayMorse = [];

// Function to play a tone given a frequency and duration
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

  oscillator.onended = () => {
    gainNode.disconnect(audioContext.destination);
    oscillator.disconnect(gainNode);
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const morseButton = document.getElementById("morseButton");
  const morseTextbox = document.getElementById("morseTextbox");

  let pressStartTime;
  let pressDuration;
  let morseInput = "";

  morseButton.addEventListener("pointerdown", () => {
    pressStartTime = new Date();
  });

  morseButton.addEventListener("pointerup", () => {
    pressDuration = new Date() - pressStartTime;
    const morseChar = pressDuration < 300 ? "." : "-"; // Threshold of 300ms to differentiate between dot and dash
    morseInput += morseChar;

    // Play Morse character
    playTone(750, morseChar === "." ? 0.1 : 0.3);

    // Update the textbox
    morseTextbox.value = morseInput;
  });
});
