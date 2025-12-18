// Bootstrap sequence
let booting = true;

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

// Start boot sequence
bootSequence();