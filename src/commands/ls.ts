import { BuilderCallback, ArgumentsCamelCase } from "yargs";
import { Command } from ".";
import { ContainerState, shell } from "../utils";

type LsArgs = {
    state?: ContainerState;
};

export default class implements Command<LsArgs> {
    name: string = "ls [state]";
    description: string = "List all exists containers";

    builder: BuilderCallback<LsArgs, LsArgs> = (yargs) => yargs
        .positional("state", {
            type: "string",
            description: "Container state",
            choices: [
                "active",
                "running",
                "stopped",
                "frozen",
            ],
        });
    handler: (args: ArgumentsCamelCase<LsArgs>) => void | Promise<void> = async (args) => {
        const {
            state,
        } = args;

        if (state)
            process.exit(
                await shell(`lxc-ls --defined --${state}`)
            );
        else
            process.exit(
                await shell(`lxc-ls --defined`)
            );
    };
}