
import { shell } from "../utils";

export default async function (container: string): Promise<void> {
    await shell(`lxc-start --name="${container}"`, {
        strict: true,
    });
}