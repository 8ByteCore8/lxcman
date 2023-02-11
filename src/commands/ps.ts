import { BuilderCallback, ArgumentsCamelCase } from "yargs";
import { Command } from ".";
import { ContainerState, shell } from "../utils";

type PsArgs = {
    state?: ContainerState;
};

export default class implements Command<PsArgs> {
    name: string = "ps [state]";
    description: string = "List all exists containers in pretty view";

    builder: BuilderCallback<PsArgs, PsArgs> = (yargs) => yargs
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

    handler: (args: ArgumentsCamelCase<PsArgs>) => void | Promise<void> = async (args) => {
        const {
            state,
        } = args;

        if (state)
            process.exit(
                await shell(`lxc-ls -f --defined --${state}`)
            );
        else
            process.exit(
                await shell(`lxc-ls -f --defined`)
            );

    };
}