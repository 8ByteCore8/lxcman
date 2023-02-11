import { BuilderCallback, ArgumentsCamelCase } from "yargs";
import { Command } from ".";
import { getContainers, shell } from "../utils";
import unfreeze from "../lxc/unfreeze";

type UnfreezeArgs = {
    container: string;
};

export default class implements Command<UnfreezeArgs> {
    name: string = "unfreeze <container>";
    description: string = "Unfreeze container";

    builder: BuilderCallback<UnfreezeArgs, UnfreezeArgs> = async (yargs) => yargs
        .positional("container", {
            type: "string",
            description: "Container name",
            demandOption: true,
            choices: await getContainers(),
        });
    handler: (args: ArgumentsCamelCase<UnfreezeArgs>) => void | Promise<void> = async (args) => {
        const {
            container,
        } = args;

        await unfreeze(container);
    };
};