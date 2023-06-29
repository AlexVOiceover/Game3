const frequency = 1000;
let isMuted = false;

document.addEventListener("DOMContentLoaded", () => {
    const muteButton = document.getElementById("muteButton");
    const device = document.getElementById("device");

    enableAudioSwitch.addEventListener("change", function () {
        // Toggle the disabled state of the button based on the switch state
        device.disabled = !enableAudioSwitch.checked;
        
        if (this.checked) {
            audioEnabled = true;
        } else {
            audioEnabled = false;
        }
    });

    device.addEventListener("pointerdown", () => {
        if (device.disabled) return; 

        //Added for the new button
        device.classList.toggle("down");

        // Add the 'pressed' class when the button is pressed
        device.classList.add("pressed");

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
            device.classList.remove("pressed");
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
        console.log("Dentro stopBeep" +morseInput);
        morseTextbox.value = morseInput;
        isStopBeepCalled = true;
    };

    device.addEventListener("pointerup", stopBeep);
    device.addEventListener("pointerleave", stopBeep);
    device.addEventListener("pointercancel", stopBeep);
});
