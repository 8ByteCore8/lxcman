
import { getContainers } from "../utils";

export default async function (container: string): Promise<boolean> {
    return (await getContainers()).includes(container);
}