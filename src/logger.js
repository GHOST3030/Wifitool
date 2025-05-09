import chalk from 'chalk';

export const log = {
    header(toolName) {
        console.log(chalk.cyan("=".repeat(60)));
        console.log(chalk.green(`             ${toolName}`));
        console.log(chalk.cyan("=".repeat(60)));
        console.log(chalk.green("Developed By Ghost Telegram @GHOST_529"));
        console.log(chalk.cyan("=".repeat(50)));
    },
    info: console.log,
    success(msg) {
        console.log(chalk.green(msg));
    },
    error(msg) {
        console.log(chalk.red(msg));
    },
    warn(msg) {
        console.log(chalk.yellow(msg));
    },
    debug(msg) {
        console.log(chalk.magenta(msg));
    },
    gray(msg) {
        console.log(chalk.gray(msg));
    }
};

