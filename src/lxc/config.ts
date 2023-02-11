import { access, constants } from "fs/promises";
import { Config } from "../utils";

export default async function (container: string): Promise<string>;
export default async function (container: string, option: string): Promise<string>;
export default async function (container: string, option: string, value: string): Promise<void>;
export default async function (container: string, option?: string, value?: string): Promise<string | void> {
    const path = `/var/lib/lxc/${container}/config`;

    await access(path, constants.R_OK | constants.W_OK);

    const config = await Config.load(path);

    if (option && value) {
        config.set(option, value);
        await config.save(path);
    }
    else if (option)
        console.log(
            config.get(option)
        );
    else
        console.log(
            config.print()
        );
}