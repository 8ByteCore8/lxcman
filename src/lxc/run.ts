
import { Readable } from "stream";
import { shell } from "../utils";

export default async function (container: string, command: string): Promise<void> {
    await shell(
        `lxc-attach --name="${container}"`, {
        stdin: Readable.from([command]),
        strict: true,
    });
}