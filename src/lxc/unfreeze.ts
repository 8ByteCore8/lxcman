
import { shell } from "../utils";

export default async function (container: string): Promise<void> {
    await shell(`lxc-unfreeze --name="${container}"`, {
        strict: true,
    });
}