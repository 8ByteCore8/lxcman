import { spawn } from "child_process";
import { readFile, writeFile } from "fs/promises";
import { join, normalize, resolve } from "path";
import { Readable, Writable } from "stream";

export type ContainerState = "running" | "stopped" | "frozen";

function splitShellCommand(command: string) {
    let split: boolean = true;
    let escape: boolean = false;
    let splited: string[] = [];
    let substring: string = "";
    let split_wait: string = "";

    function stopSplit(char: string) {
        if (split) {
            split_wait = char;
            split = false;
        }
        else
            substring += char;
    }

    for (let char of command) {
        if (escape) {
            substring += char;
            escape = false;
            continue;
        }

        if (split_wait == char) {
            split = true;
            split_wait = "";
            continue;
        }

        switch (char) {
            case "\"":
                stopSplit("\"");
                continue;

            case "\'":
                stopSplit("\'");
                continue;

            case "\\":
                escape = true;
                continue;

            case " ":
                if (split) {
                    splited.push(substring);
                    substring = "";
                }
                continue;

            default:
                substring += char;
                continue;
        }
    }

    if (substring != "")
        splited.push(substring);

    return splited
        .map(x => x.trim())
        .filter(x => x != "");;
}

type ShellOptions = {
    stdin?: 'inherit' | 'ignore' | Readable;
    stdout?: 'inherit' | 'ignore' | Writable;
    stderr?: 'inherit' | 'ignore' | Writable;
    strict?: boolean;
};
export function shell(command: string, options?: ShellOptions): Promise<number> {

    return new Promise<number>((res, rej) => {
        const stdin = options?.stdin || "inherit";
        const stdout = options?.stdout || "inherit";
        const stderr = options?.stderr || "inherit";
        const strict = options?.strict || false;

        const [program, ...args] = splitShellCommand(command);

        const child = spawn(program, args, {
            stdio: [
                typeof stdin === "object" ? "pipe" : stdin,
                typeof stdout === "object" ? "pipe" : stdout,
                typeof stderr === "object" ? "pipe" : stderr,
            ],
        });

        if (typeof stdin === "object" && child.stdin)
            stdin.pipe(child.stdin);

        if (typeof stdout === "object" && child.stdout) {
            child.stdout.pipe(stdout);
        }

        if (typeof stderr === "object" && child.stderr)
            child.stderr.pipe(stderr);

        child.once("exit", (code) => {
            if (code === null)
                rej("Shell command execution error");
            else if (strict && code != 0)
                rej(new Error(`Shell command "${command}" exit with error. Exit code: ${code}`));
            else
                res(code);
        });
    });
}

export function getOutput(command: string): Promise<string> {
    return new Promise(async (res, rej) => {
        let buffer = "";
        const stream = new Writable({
            write(chunk: string | Buffer, encoding, callback) {
                buffer += chunk.toString("utf-8");
                callback();
            },
        });
        stream.on("finish", () => {
            res(buffer.trim());
        });
        await shell(command, {
            stdout: stream,
            strict: true
        });
    });
}

export async function getContainers(state?: ContainerState | "active"): Promise<string[]> {
    if (state)
        return (await getOutput(`lxc-ls --defined --${state}`)).split(" ");
    return (await getOutput(`lxc-ls --defined`)).split(" ");
}

export async function getState(container: string): Promise<ContainerState> {
    return getOutput(`lxc-info --name="${container}" -sH`)
        .then(x => x.toLowerCase()) as Promise<ContainerState>;
}

export async function getTemplates() {
    return (await getOutput(`ls "/usr/share/lxc/templates"`))
        .split("\n")
        .map(x => x.replace(/^lxc-/, ""));
}

export class Config {
    options: Record<string, string> = {};

    static async load(path: string) {
        const config = new Config();
        await config.load(path);
        return config;
    }

    get(name: string): string | undefined {
        return this.options[name];
    }

    set(name: string, value: string | undefined) {
        if (value)
            this.options[name] = value;
        else
            delete this.options[name];
    }

    async load(path: string) {
        const comment = /#.*/;
        this.options = {};
        const file = (await readFile(path))
            .toString("utf-8")
            .split("\n")
            .map(x => x
                .replace(comment, "")
                .trim()
            )
            .filter(x => x != "");


        for (let line of file) {
            const [name, value] = line.split("=").map(x => x.trim());
            this.options[name] = value;
        }
    }

    print(): string {
        return Object.keys(this.options)
            .sort()
            .map(name => {
                return `${name} = ${this.options[name].toString()}`;
            })
            .join("\n");
    }

    async save(path: string) {
        await writeFile(
            path,
            `# This config was generated by lxcman\n${this.print()}\n`
        );
    }
}

export async function resolvePath(path: string): Promise<string> {
    const containers = await getContainers();
    let [path_container, path_path] = path.split(":");
    if (path_path) {
        if (!containers.includes(path_container))
            throw new Error(`Invalid container name. Defined containers: ${containers.join(", ")}`);

        path = resolve(
            normalize(
                join(
                    `/var/lib/lxc/${path_container}/rootfs/`,
                    path_path,
                )
            )
        );

        if (!path.startsWith(`/var/lib/lxc/${path_container}/rootfs/`))
            throw new Error(`Path \"${path_path}\" is invalid`);

        return path;
    } else {
        return resolve(
            normalize(
                path_container
            )
        );
    }
}