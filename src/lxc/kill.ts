
import { shell } from "../utils";

export default async function (container: string): Promise<void> {
    await shell(`lxc-stop --name="${container}" --kill`, {
        strict: true,
    });
}