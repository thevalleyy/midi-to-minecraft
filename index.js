const device = "arturia minilab mkii";
const closeSequence = [69, 71, 72];
const mouseDelay = 2;

// import dependencies
const midi = require("midi");
const robot = require("robotjs");
const width = robot.getScreenSize().width;
const height = robot.getScreenSize().height;
const widthSteps = Math.round(width / 127);
const heightSteps = Math.round(height / 127);

// configure things
const input = new midi.Input();
robot.setMouseDelay(mouseDelay);

if (input.getPortCount() <= 0) throw "No midi inputs found (" + input.getPortCount() + ")";

// Count the available input ports.
console.log("Scanning: " + input.getPortCount() + (input.getPortCount() == 1 ? " Port" : " Ports") + ", searching for: " + device);

// scan every midi input for desired device
const devlist = [];
for (let i = 0; i < input.getPortCount(); i++) {
    if (input.getPortName(i).toLowerCase().includes(device.toLowerCase())) {
        console.log(input.getPortName(0) + " ✅");
        devlist.push(i);
    } else {
        console.log(input.getPortName(0) + " ❌");
    }
}

// connect to desired device
if (!devlist.length) throw "No device found, search term: " + device;

console.log("Connecting to " + input.getPortName(devlist[0]) + " [" + devlist[0] + "]");
input.openPort(devlist[0]);

/* Sysex, timing, and active sensing messages are ignored
 * by default. To enable these message types, pass false for
 * the appropriate type in the function below.
 * Order: (Sysex, Timing, Active Sensing)
 * For example if you want to receive only MIDI Clock beats
 * you should use
 * input.ignoreTypes(true, false, true)
 */

input.ignoreTypes(false, false, false);

// Configure a callback.
const keySeq = [];
const oldSlot = [];
const oldY = [];
input.on("message", (deltaTime, message) => {
    const key = message.splice(",");

    /* The message is an array of numbers corresponding to the MIDI bytes:
     *    [status, data1, data2]
     * https://www.cs.cf.ac.uk/Dave/Multimedia/node158.html has some helpful
     * information interpreting the messages.
     */

    // console.log(`m: ${message} d: ${deltaTime}`);

    // ignores non midi inputs
    if (key.length > 3) return;

    // key down
    if (key[0] == 152) {
        keySeq.push(key[1]);
        if (keySeq.length > closeSequence.length) keySeq.shift();

        key.shift();
        console.log("key down " + key);

        // W
        if (key[0] == 60) {
            robot.keyToggle("w", "down");
        }

        // A
        if (key[0] == 55) {
            robot.keyToggle("a", "down");
        }

        // S
        if (key[0] == 59) {
            robot.keyToggle("s", "down");
        }

        // D
        if (key[0] == 57) {
            robot.keyToggle("d", "down");
        }

        // SPRINT
        if (key[0] == 52) {
            robot.keyToggle("r", "down");
        }

        // SHIFT
        if (key[0] == 53) {
            robot.keyToggle("shift", "down");
        }

        // RIGHT CLICK
        if (key[0] == 65) {
            robot.mouseToggle("down", "right");
        }

        // LEFT CLICK
        if (key[0] == 64) {
            robot.mouseToggle("down", "left");
        }

        // MIDDLE CLICK
        if (key[0] == 62) {
            robot.mouseClick("middle");
        }
    }

    // key up
    if (key[0] == 136) {
        key.shift();
        console.log("key up " + key);

        // W
        if (key[0] == 60) {
            robot.keyToggle("w", "up");
        }

        // A
        if (key[0] == 55) {
            robot.keyToggle("a", "up");
        }

        // S
        if (key[0] == 59) {
            robot.keyToggle("s", "up");
        }

        // D
        if (key[0] == 57) {
            robot.keyToggle("d", "up");
        }

        // SPRINT
        if (key[0] == 52) {
            robot.keyToggle("r", "up");
        }

        // SHIFT
        if (key[0] == 53) {
            robot.keyToggle("shift", "up");
        }

        // RIGHT CLICK
        if (key[0] == 65) {
            robot.mouseToggle("up", "right");
        }

        // LEFT CLICK
        if (key[0] == 64) {
            robot.mouseToggle("up", "left");
        }
    }

    // pad down
    if (key[0] == 153) {
        key.shift();
        console.log("pad down " + key);

        // Jump
        if (key[0] == 36) {
            robot.keyToggle("space", "down");
        }

        // E
        if (key[0] == 37) {
            robot.keyTap("e");
        }

        // Q
        if (key[0] == 38) {
            robot.keyToggle("q", "down");
        }

        // F
        if (key[0] == 39) {
            robot.keyTap("f");
        }

        // TAB
        if (key[0] == 40) {
            robot.keyToggle("tab", "down");
        }

        // L
        if (key[0] == 41) {
            robot.keyTap("l");
        }

        // F5
        if (key[0] == 42) {
            robot.keyTap("f2");
        }

        // F5
        if (key[0] == 43) {
            robot.keyTap("f5");
        }
    }

    // pad up
    if (key[0] == 137) {
        key.shift();
        console.log("pad up " + key);

        // Jump
        if (key[0] == 36) {
            robot.keyToggle("space", "up");
        }

        // Q
        if (key[0] == 38) {
            robot.keyToggle("q", "up");
        }

        // TAB
        if (key[0] == 40) {
            robot.keyToggle("tab", "up");
        }
    }

    // slider
    if (key[0] == 184) {
        key.shift();
        // console.log("slider " + key);

        // ESC
        if (key[0] == 113 && key[1] == 127) {
            robot.keyTap("escape");
        }

        // ENTER
        if (key[0] == 115 && key[1] == 127) {
            robot.keyTap("enter");
        }

        // SCROLL KNUBS

        // Mouse up/down
        if (key[0] == 75) {
            const currentPos = robot.getMousePos();
            robot.moveMouse(currentPos.x + 1, heightSteps * (127 - key[1]));
            // console.log(currentPos, robot.getMousePos());
            console.log("y-slider: " + key[1]);
        }

        // Mouse right/left
        if (key[0] == 72) {
            const currentPos = robot.getMousePos();
            robot.moveMouse(widthSteps * key[1], currentPos.y + 1);
            // console.log(currentPos, robot.getMousePos());
            console.log("x-slider: " + key[1]);
        }

        // Scrollwheel
        if (key[0] == 73) {
            const slot = Math.round(key[1] / 15.85);
            if (oldSlot[0] != slot) {
                oldSlot[0] = slot;
                robot.keyTap((slot + 1).toString().replace("5", "v"));
            }
        }
    }

    // // pitch
    // if (key[0] == 232) {
    //     key.shift();
    //     console.log("pitch " + key);
    // }

    // Close Port when sequence has been played
    if (JSON.stringify(keySeq) === JSON.stringify(closeSequence)) {
        console.log("Closed Port " + input.getPortName(devlist[0]) + " [" + devlist[0] + "]");
        input.closePort();
    }
});

// TODO:
/*
 * typeString(string) iwas lustiges damit machen
 */
