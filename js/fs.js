import { state } from "./state.js";

const FS_ROOT = "/fs";

function normalize(path) {
    if (!path.startsWith("/")) return path;

    if (state.cwd.endsWith("/")) return state.cwd + path;
    return state.cwd + "/" + path;
}

export async function readFile(path) {
    const fullPath = FS_ROOT + normalize(path);
    const res = await fetch(fullPath);

    if (!res.ok) {
        throw new Error("No such file");
    }
    return await res.text();
}

export async function listDir(path = ".") {
    const fullPath = FS_ROOT + normalize(path) + "/index.json";
    const res = await fetch(fullPath);

    if (!res.ok) {
        throw new Error("No such directory");
        
    }

    return await res.json()
}

export function changeDir(path) {
    const next = normalize(path);
    state.cwd = next;
}

