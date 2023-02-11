import { BuilderCallback, ArgumentsCamelCase } from "yargs";
import { Command } from ".";
import { getContainers } from "../utils";
import stop from "../lxc/stop";

type StopArgs = {
    container: string;
};

export default class implements Command<StopArgs> {
    name: string = "stop <container>";
    description: string = "Stop container";

    builder: BuilderCallback<StopArgs, StopArgs> = async (yargs) => yargs
        .positional("container", {
            type: "string",
            description: "Container name",
            demandOption: true,
            choices: await getContainers(),
        });
    handler: (args: ArgumentsCamelCase<StopArgs>) => void | Promise<void> = async (args) => {
        const {
            container,
        } = args;

        await stop(container);
    };
};