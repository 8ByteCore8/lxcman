import { BuilderCallback, ArgumentsCamelCase } from "yargs";
import { Command } from ".";
import { ContainerState, getContainers, getState } from "../utils";

type StateArgs = {
    container: string;
    state?: ContainerState;
};
export default class state implements Command<StateArgs> {
    name: string = "state <container> [state]";
    description: string = "Print container state";

    builder: BuilderCallback<StateArgs, StateArgs> = async (yargs) => yargs
        .positional("container", {
            type: "string",
            description: "Container name",
            demandOption: true,
            choices: await getContainers(),
        })
        .positional("state", {
            type: "string",
            description: "Container state",
            choices: [
                "running",
                "stopped",
                "frozen",
            ]
        });
    handler: (args: ArgumentsCamelCase<StateArgs>) => void | Promise<void> = async (args) => {
        const {
            container,
            state,
        } = args;

        if (state)
            console.log((await getState(container)) == state);
        else
            console.log(await getState(container));
    };
};