import { BuilderCallback, ArgumentsCamelCase } from "yargs";
import { Command } from ".";
import run from "../lxc/run";

type RunArgs = {
    container: string;
    command: string;
};

export default class implements Command<RunArgs> {
    name: string = "run <container> <command>";
    description: string = "Run command in container";

    builder: BuilderCallback<RunArgs, RunArgs> = (yargs) => yargs
        .positional("container", {
            type: "string",
            description: "Container name",
            demandOption: true,
        })
        .positional("command", {
            type: "string",
            description: "Command for execution",
            demandOption: true,
        });
    handler: (args: ArgumentsCamelCase<RunArgs>) => void | Promise<void> = async (args) => {
        const {
            container,
            command,
        } = args;

        await run(container, command);
    };
}