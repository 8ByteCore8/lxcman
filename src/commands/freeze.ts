import { BuilderCallback, ArgumentsCamelCase } from "yargs";
import { Command } from ".";
import { getContainers, shell } from "../utils";
import freeze from "../lxc/freeze";

type FreezeArgs = {
    container: string;
};

export default class implements Command<FreezeArgs> {
    name: string = "freeze <container>";
    description: string = "Freeze container (freeze all the container's processes)";

    builder: BuilderCallback<FreezeArgs, FreezeArgs> = async (yargs) => yargs
        .positional("container", {
            type: "string",
            description: "Container name",
            demandOption: true,
            choices: await getContainers(),
        });
    handler: (args: ArgumentsCamelCase<FreezeArgs>) => void | Promise<void> = async (args) => {
        const {
            container,
        } = args;

        await freeze(container);
    };
};