import { BuilderCallback, ArgumentsCamelCase } from "yargs";
import { Command } from ".";
import { getContainers, shell } from "../utils";
import { attach } from "../lxc";

type AttachArgs = {
    container: string;
};

export default class implements Command<AttachArgs> {
    name: string = "attach <container>";
    description: string = "Attach to container";

    builder: BuilderCallback<AttachArgs, AttachArgs> = async (yargs) => yargs
        .positional("container", {
            type: "string",
            description: "Container name",
            demandOption: true,
            choices: await getContainers(),
        });
    handler: (args: ArgumentsCamelCase<AttachArgs>) => void | Promise<void> = async (args) => {
        const {
            container,
        } = args;

        await attach(container);
    };
};