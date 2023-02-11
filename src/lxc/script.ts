
import { access, constants } from "fs/promises";
import { shell } from "../utils";
import { createReadStream } from "fs";

export default async function (container: string, path: string): Promise<void> {
    await access(path, constants.R_OK);

    await shell(
        `lxc-attach --name="${container}"`, {
        stdin: createReadStream(path),
        strict: true,
    });
}