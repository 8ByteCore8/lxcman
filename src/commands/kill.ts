import { BuilderCallback, ArgumentsCamelCase } from "yargs";
import { Command } from ".";
import { getContainers, shell } from "../utils";
import kill from "../lxc/kill";

type KillArgs = {
    container: string;
};

export default class implements Command<KillArgs> {
    name: string = "kill <container>";
    description: string = "Rather than requesting a clean shutdown of the container, explicitly kill all tasks in the container.";

    builder: BuilderCallback<KillArgs, KillArgs> = async (yargs) => yargs
        .positional("container", {
            type: "string",
            description: "Container name",
            demandOption: true,
            choices: await getContainers(),
        });
    handler: (args: ArgumentsCamelCase<KillArgs>) => void | Promise<void> = async (args) => {
        const {
            container,
        } = args;

        await kill(container);
    };
};