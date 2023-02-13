#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import commands from "../commands";


async function main() {
    const parser = yargs(hideBin(process.argv));

    for (let command of commands) {
        parser.command(
            command.name,
            command.description,
            command.builder,
            command.handler,
            command.middlewares,
            command.deprecated,
        );
    }

    parser.version();
    parser.option("h", {
        alias: "help"
    });
    parser.parserConfiguration({
        "unknown-options-as-args": true,
        "sort-commands": true,
    });

    parser.parse();
}

main();