
import { shell } from "../utils";

export default async function (container: string, force: boolean = true, snapshots: boolean = true): Promise<void> {
    await shell(`lxc-destroy ${force ? "-f" : ""} ${snapshots ? "-s" : ""} --name="${container}"`, {
        strict: true,
    });
}