import { BuilderCallback, ArgumentsCamelCase } from "yargs";
import { Command } from ".";
import { getContainers } from "../utils";
import config from "../lxc/config";

type ConfigArgs = {
    container: string;
    option: string;
    value: string;
};

export default class implements Command<ConfigArgs> {
    name: string = "config <container> [option] [value]";
    description: string = "Manage container configs";

    builder: BuilderCallback<ConfigArgs, ConfigArgs> = async (yargs) => yargs
        .positional("container", {
            type: "string",
            description: "Container name",
            demandOption: true,
            choices: await getContainers(),
        })
        .positional("option", {
            type: "string",
            description: "Config option name",
        })
        .positional("value", {
            type: "string",
            description: "New option value",
        });
    handler: (args: ArgumentsCamelCase<ConfigArgs>) => void | Promise<void> = async (args) => {
        const {
            container,
            option,
            value,
        } = args;

        if (option && value)
            await config(container, option, value);
        else
            console.log(
                await config(container, option, value)
            );
    };
};