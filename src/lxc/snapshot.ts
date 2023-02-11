import { getState, shell } from "../utils";
import stop from "./stop";
import start from "./start";

export default async function (container: string, action: "create" | "list"): Promise<void>;
export default async function (container: string, action: "restore" | "destroy", snapshot: string): Promise<void>;
export default async function (container: string, action: "create" | "restore" | "destroy" | "list", snapshot?: string): Promise<void> {
    if (action == "list") {
        await shell(
            `lxc-stapshot --name="${container}" -L -C`, {
            strict: true,
        });
    }
    else if (action == "create") {
        const state = await getState(container);

        if (state != "stopped")
            await stop(container);  

        await shell(
            `lxc-stapshot --name="${container}"`, {
            strict: true,
        });

        if (state == "running")
            await start(container);
    }
    else if (action == "restore") {
        const state = await getState(container);

        if (state != "stopped")
            await stop(container);

        await shell(
            `lxc-stapshot --restore="${snapshot}" --name="${container}"`, {
            strict: true,
        });

        if (state == "running")
            await start(container);
    }
    else if (action == "destroy") {
        await shell(
            `lxc-stapshot --destroy="${snapshot}" --name="${container}"`, {
            strict: true,
        });
    }
    else
        throw new Error("Invalid snapshot action");
}