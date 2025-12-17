let booting = true;

const term = new Terminal({
    cursorBlink: true,
    theme: {
        background: "#282a36",
        foreground: "#f8f8f2",
        cursor: "#f8f8f2",
        selection: "#44475a",
        black: "#21222c",
        red: "#ff5555",
        green: "#50fa7b",
        yellow: "#f1fa8c",
        blue: "#bd93f9",
        magenta: "#ff79c6",
        cyan: "#8be9fd",
        white: "#f8f8f2",
    }
});

const prompt = "c0nqu15t4d0r@Dark-Knight:~$ ";
let buffer = "";
let history = [];
let historyIndex = -1;

const commands = ["help", "whoami", "clear"];

term.open(document.getElementById("terminal"));
const container = document.getElementById("terminal");

term.attachCustomKeyEventHandler((e) => {
    if (e.key === "Tab") {
        e.preventDefault();
        autocomplete();
        return false;
    }
    return true;
});

const bootSteps = [
    { text: "Initializing kernel", weight: 20 },
    { text: "Loading night modules", weight: 30 },
    { text: "Mounting /mnt/root", weight: 25 },
    { text: "Starting terminal services", weight: 25 },
];

function renderProgress(percent) {
    const width = 30;
    const filled = Math.round((percent / 100) * width);
    const empty = width - filled;
    return `Boot progress: [${"█".repeat(filled)}${"░".repeat(empty)}] ${percent}%`;
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function bootSequence() {
    term.writeln("TermOS v1.0");
    term.writeln("Copyright (c) 2025 Fortis Tech Inc.");
    term.writeln("");

    let progress = 0;
    term.writeln(renderProgress(progress));

    for (const step of bootSteps) {
        term.write("\x1b[1A");
        term.write("\x1b[2K\r");
        term.writeln(`[ \x1b[32mOK\x1b[0m ] ${step.text}`);

        const target = progress + step.weight;
        while (progress < target) {
            progress++;
            term.write("\x1b[2K\r" + renderProgress(progress));
            await sleep(20);
        }
        term.writeln("");
    }

    // Clear the progress bar line before welcome message
    term.write("\x1b[1A");
    term.write("\x1b[2K\r");
    term.writeln("[ \x1b[32mOK\x1b[0m ] Booting completed");

    term.writeln("");
    term.writeln("\x1b[35mWelcome back, CONQU15T4D0R\x1b[0m");
    term.writeln("");

    booting = false;
    term.write(prompt);
}

term.onKey(e => {
    const key = e.domEvent.key;

    // ENTER
    if (key === "Enter") {
        term.write("\r\n");
        if (buffer.trim() !== "") {
            history.push(buffer);
        }
        historyIndex = history.length;
        handleCommand(buffer.trim());
        buffer = "";
        term.write(prompt);
    }
    // BACKSPACE
    else if (key === "Backspace") {
        if (buffer.length > 0) {
            buffer = buffer.slice(0, -1);
            term.write("\b \b");
        }
    }
    // ARROW UP
    else if (key === "ArrowUp") {
        if (historyIndex > 0) {
            historyIndex--;
            replaceBuffer(history[historyIndex]);
        }
    }
    // ARROW DOWN
    else if (key === "ArrowDown") {
        if (historyIndex < history.length - 1) {
            historyIndex++;
            replaceBuffer(history[historyIndex]);
        } else {
            historyIndex = history.length;
            replaceBuffer("");
        }
    }
    // Printable Char
    else if (key.length === 1) {
        buffer += key;
        term.write(key);
    }
});
// Start boot sequence after everything is set up
bootSequence();
function replaceBuffer(text) {
    while (buffer.length > 0) {
        term.write("\b \b");
        buffer = buffer.slice(0, -1);
    }
    buffer = text;
    term.write(text);
}

function autocomplete() {
    const matches = commands.filter(cmd => cmd.startsWith(buffer));
    if (matches.length === 1) {
        replaceBuffer(matches[0]);
    } else if (matches.length > 1) {
        term.write("\r\n" + matches.join(" ") + "\r\n");
        term.write(prompt + buffer);
    }
}

function handleCommand(cmd) {
    if (cmd === "") return;

    switch (cmd) {
        case "help":
            term.writeln("Available commands:");
            term.writeln("  help");
            term.writeln("  whoami");
            term.writeln("  clear");
            break;

        case "whoami":
            term.writeln("c0nqu15t4d0r@Dark-Knight");
            break;

        case "clear":
            term.clear();
            break;

        default:
            term.writeln(`command not found: ${cmd}`);
            break;
    }
}