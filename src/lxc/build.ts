
import { getContainers } from "../utils";
import { access, readFile } from "fs/promises";
import { constants } from "fs";
import { createContext, runInContext } from "vm";
import * as lxc from ".";

export default async function (container: string, source: string): Promise<void> {
    await access(source, constants.R_OK);

    if ((await getContainers()).includes(container))
        throw new Error(`Container \"${container}\" was defined`);

    runInContext(
        (await readFile(source))
            .toString("utf-8"),
        createContext({
            LXC: lxc,
            console: console,
            CONTAINER: container,
            Promise: Promise,
        }),
        {
            breakOnSigint: true,
        }
    );
}