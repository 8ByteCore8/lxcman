import { BuilderCallback, ArgumentsCamelCase } from "yargs";
import { Command } from ".";
import script from "../lxc/script";

type ScriptArgs = {
    container: string;
    path: string;
};

export default class implements Command<ScriptArgs> {
    name: string = "script <container> <path>";
    description: string = "Run script in container";

    builder: BuilderCallback<ScriptArgs, ScriptArgs> = (yargs) => yargs
        .positional("container", {
            type: "string",
            description: "Container name",
            demandOption: true,
        })
        .positional("path", {
            type: "string",
            description: "Path to script file",
            demandOption: true,
            normalize: true,
        });
    handler: (args: ArgumentsCamelCase<ScriptArgs>) => void | Promise<void> = async (args) => {
        const {
            container,
            path,
        } = args;

        await script(container, path);
    };
}