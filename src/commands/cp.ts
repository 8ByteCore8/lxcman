import { BuilderCallback, ArgumentsCamelCase } from "yargs";
import { Command } from ".";
import cp from "../lxc/cp";

type CpArgs = {
    source: string;
    dest: string;
    parents: boolean;
    rewrite: boolean;
};

export default class implements Command<CpArgs> {
    name: string = "copy [-rm] <source> <dest>";
    description: string = "Copy files beetwen container/host";

    builder: BuilderCallback<CpArgs, CpArgs> = async (yargs) => yargs
        .positional("source", {
            type: "string",
            description: "Source path",
            demandOption: true,
            normalize: false,
        })
        .positional("dest", {
            type: "string",
            description: "Destination path",
            demandOption: true,
            normalize: false,
        })
        .option("rewrite", {
            alias: "r",
            type: "boolean",
            description: "Remove destination and then write the new data"
        })
        .option("parents", {
            alias: "p",
            type: "boolean",
            description: "Create destination parents directories",
        });
    handler: (args: ArgumentsCamelCase<CpArgs>) => void | Promise<void> = async (args) => {
        let {
            source,
            dest,
            parents,
            rewrite,
        } = args;

        await cp(source, dest, parents, rewrite);
    };
};