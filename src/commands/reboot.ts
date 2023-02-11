import { BuilderCallback, ArgumentsCamelCase } from "yargs";
import { Command } from ".";
import { getContainers, shell } from "../utils";
import reboot from "../lxc/reboot";

type RebootArgs = {
    container: string;
};

export default class implements Command<RebootArgs> {
    name: string = "reboot <container>";
    description: string = "Reboot container";

    builder: BuilderCallback<RebootArgs, RebootArgs> = async (yargs) => yargs
        .positional("container", {
            type: "string",
            description: "Container name",
            demandOption: true,
            choices: await getContainers(),
        });
    handler: (args: ArgumentsCamelCase<RebootArgs>) => void | Promise<void> = async (args) => {
        const {
            container,
        } = args;

        await reboot(container);
    };
};