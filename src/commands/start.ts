import { BuilderCallback, ArgumentsCamelCase } from "yargs";
import { Command } from ".";
import { getContainers, shell } from "../utils";
import start from "../lxc/start";

type StartArgs = {
    container: string;
};

export default class implements Command<StartArgs> {
    name: string = "start <container>";
    description: string = "Start container";

    builder: BuilderCallback<StartArgs, StartArgs> = async (yargs) => yargs
        .positional("container", {
            type: "string",
            description: "Container name",
            demandOption: true,
            choices: await getContainers(),
        });
    handler: (args: ArgumentsCamelCase<StartArgs>) => void | Promise<void> = async (args) => {
        const {
            container,
        } = args;

        await start(container);
    };
};