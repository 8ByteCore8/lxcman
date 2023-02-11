import { BuilderCallback, ArgumentsCamelCase } from "yargs";
import { Command } from ".";
import exists from "../lxc/exists";

type ExistsArgs = {
    container: string;
};

export default class implements Command<ExistsArgs> {
    name: string = "exists <container>";
    description: string = "Check container exists";

    builder: BuilderCallback<ExistsArgs, ExistsArgs> = (yargs) => yargs
        .positional("container", {
            type: "string",
            description: "Container name",
            demandOption: true,
        });
    handler: (args: ArgumentsCamelCase<ExistsArgs>) => void | Promise<void> = async (args) => {
        const {
            container,
        } = args;

        console.log(
            await exists(container)
        );
    };
}