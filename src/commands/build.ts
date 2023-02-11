import { BuilderCallback, ArgumentsCamelCase } from "yargs";
import { Command } from ".";
import { build } from "../lxc";


type BuildArgs = {
    container: string;
    source: string;
};

export default class implements Command<BuildArgs> {
    name: string = "build <container> <source>";
    description: string = "Build container by script";

    builder: BuilderCallback<BuildArgs, BuildArgs> = async (yargs) => yargs
        .positional("container", {
            type: "string",
            description: "Container name",
            demandOption: true,
        })
        .positional("source", {
            type: "string",
            description: "Script file path",
            demandOption: true,
        });
    handler: (args: ArgumentsCamelCase<BuildArgs>) => void | Promise<void> = async (args) => {
        const {
            container,
            source,
        } = args;

        await build(container, source);
    };
};