import { shell } from "../utils";

export default async function (command: string): Promise<void> {
    await shell(
        command, {
        strict: true,
    });
}