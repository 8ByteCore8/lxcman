import { getContainers, getTemplates, shell } from "../utils";

export default async function (container: string, template: string, template_options: string[] = []): Promise<void> {
    if ((await getContainers()).includes(container))
        throw new Error(`Container \"${container}\" was defined`);

    if (!(await getTemplates()).includes(template))
        console.error(`Template \"${template}\" not found`);

    if (template_options.length > 0)
        await shell(`lxc-create --name="${container}" --template="${template}" -- ${template_options.join(" ")}`, {
            strict: true,
        });
    else
        await shell(`lxc-create --name="${container}" --template="${template}"`, {
            strict: true,
        });
}