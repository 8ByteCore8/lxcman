import { BuilderCallback, ArgumentsCamelCase } from "yargs";
import { Command } from ".";
import { getContainers } from "../utils";
import destroy from "../lxc/destroy";

type DestroyArgs = {
    container: string;
    force: boolean;
    snapshots: boolean;
};

export default class implements Command<DestroyArgs> {
    name: string = "destroy [-fs] <container>";
    description: string = "Destroy container";

    builder: BuilderCallback<DestroyArgs, DestroyArgs> = async (yargs) => yargs
        .positional("container", {
            type: "string",
            description: "Container name",
            demandOption: true,
            choices: await getContainers(),
        })
        .option("force", {
            alias: "f",
            type: "boolean",
            description: "If a container is running, stop it first",
        }).option("snapshots", {
            alias: "s",
            type: "boolean",
            description: "Destroy container with all its snapshots",
        });
    handler: (args: ArgumentsCamelCase<DestroyArgs>) => void | Promise<void> = async (args) => {
        const {
            container,
            force,
            snapshots,
        } = args;

        await destroy(container, force, snapshots);
    };
};