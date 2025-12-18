// Input parsing, command handling, and command definitions
const prompt = "c0nqu15t4d0r@Dark-Knight:~$ ";
let buffer = "";
let history = [];
let historyIndex = -1;

const commands = ["help", "whoami", "clear"];

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

// Handle key input
term.attachCustomKeyEventHandler((e) => {
    if (e.key === "Tab") {
        e.preventDefault();
        autocomplete();
        return false;
    }
    return true;
});

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
