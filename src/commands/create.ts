import { BuilderCallback, ArgumentsCamelCase } from "yargs";
import { Command } from ".";
import { getOutput } from "../utils";
import create from "../lxc/create";

type CreateArgs = {
    container: string;
    template: string;
};

export default class implements Command<CreateArgs> {
    name: string = "create <container> <template>";
    description: string = "Create container";

    builder: BuilderCallback<CreateArgs, CreateArgs> = async (yargs) => yargs
        .positional("container", {
            type: "string",
            description: "Container name",
            demandOption: true,
        })
        .positional("template", {
            type: "string",
            description: "Creation template",
            demandOption: true,
            choices: (await getOutput(`ls "/usr/share/lxc/templates"`))
                .split("\n")
                .map(x => x.replace(/^lxc-/, ""))
        });
    handler?: ((args: ArgumentsCamelCase<CreateArgs>) => void | Promise<void>) | undefined = async (args) => {
        let {
            container,
            template,
        } = args;

        await create(
            container,
            template,
            args._
                .slice(1)
                .map(x => x.toString())
        );
    };
};