
import { shell } from "../utils";

export default async function (container: string): Promise<void> {
    await shell(`lxc-freeze --name="${container}"`, {
        strict: true,
    });
}