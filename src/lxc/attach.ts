import { shell } from "../utils";

export default async function (container: string): Promise<void> {
    await shell(
        `lxc-attach --name="${container}"`, {
        strict: true,
    });
}