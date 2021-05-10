/* eslint-disable @typescript-eslint/ban-types */
import { Arguments, CommandModule } from 'yargs';

/**
 * Extends the yargs `CommandModule` to allow asynchronous handlers.
 */
export interface Command<T = {}, U = {}> extends Omit<CommandModule<T, U>, 'handler'> {

    /** This handler is passed the parsed arguments. */
    handler: (args: Arguments<U>) => void | Promise<void>;

}

/**
 * Creates a Yargs `CommandModule` from the specified `Command`.
 */
export function createYargsCommand<T = {}, U = {}>(command: Command<T, U>): CommandModule<T, U> {
    const { handler, ...cmd } = command;

    const executeHandler: (args: Arguments<U>) => void = args => {
        const result = command.handler(args);
        if (result) {
            result
                .then(() => {})
                .catch(err => console.error(err));
        }
    };

    return {
        ...cmd,
        handler: args => executeHandler(args),
    };
}


