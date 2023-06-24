const frequency = 750; // 1000Hz

document.addEventListener("DOMContentLoaded", () => {
    const morseButton = document.getElementById("morseButton");
    const morseTextbox = document.getElementById("morseTextbox");
    const enableAudioSwitch = document.getElementById("enableAudioSwitch");
  
    let pressStartTime;
    let pressDuration;
    let morseInput = "";
    let audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let oscillator;
    let audioEnabled = false;

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
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = "sine"; // Set the type of wave
        oscillator.frequency.value = frequency; // Set the frequency of the tone
    
        oscillator.connect(audioContext.destination);
        oscillator.start();
        
      }
    });
  
    morseButton.addEventListener("pointerup", () => {
      pressDuration = new Date() - pressStartTime;
      const morseChar = pressDuration < 300 ? "." : "-"; // Threshold of 300ms to differentiate between dot and dash
      morseInput += morseChar;
  
      //if (audioEnabled) {
        // Stop playing the tone
        oscillator.stop();

        // Add this line to release resources after the tone has played
        oscillator.onended = () => {
        gainNode.disconnect(audioContext.destination);
        oscillator.disconnect(gainNode);
  };

      //}
  
      // Update the textbox
      morseTextbox.value = morseInput;
    });
  });
  