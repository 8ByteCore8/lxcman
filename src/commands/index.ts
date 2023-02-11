import type { BuilderCallback, ArgumentsCamelCase, MiddlewareFunction } from "yargs";

type CommandHandler<Args> = ((args: ArgumentsCamelCase<Args>) => void | Promise<void>);

import ls from "./ls";
import ps from "./ps";
import exists from "./exists";
import state from "./state";
import start from "./start";
import stop from "./stop";
import reboot from "./reboot";
import kill from "./kill";
import freeze from "./freeze";
import unfreeze from "./unfreeze";
import destroy from "./destroy";
import create from "./create";
import config from "./config";
import run from "./run";
import script from "./script";
import cp from "./cp";
import build from "./build";

export interface Command<Args = {}> {
    name: string;
    description: string;
    builder: BuilderCallback<Args, Args>;
    handler?: CommandHandler<Args>;
    middlewares?: MiddlewareFunction<Args>[];
    deprecated?: boolean | string;
}

export default [
    new ls(),
    new ps(),
    new exists(),
    new state(),
    new start(),
    new stop(),
    new reboot(),
    new kill(),
    new freeze(),
    new unfreeze(),
    new destroy(),
    new create(),
    new config(),
    new run(),
    new script(),
    new cp(),
    new build(),
] as Command[];