import { dirname } from "path";
import { resolvePath, shell } from "../utils";

export default async function (source: string, dest: string, parents: boolean = true, rewrite: boolean = false): Promise<void> {
    [source, dest] = await Promise.all([
        resolvePath(source),
        resolvePath(dest),
    ]);

    if (parents)
        await shell(`mkdir -p "${dirname(dest)}"`, {
            strict: true,
        });

    if (rewrite)
        await shell(`rm -rf "${dest}"`, {
            strict: true,
        });

    await shell(`cp -av "${source}" "${dest}"`, {
        strict: true,
    });
}