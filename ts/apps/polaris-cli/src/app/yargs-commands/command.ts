/* eslint-disable @typescript-eslint/ban-types */
import { ArgumentsCamelCase, CommandBuilder, CommandModule } from 'yargs';

/**
 * Extends the yargs `CommandModule` to allow asynchronous handlers.
 */
export interface Command<T = {}, U = {}> extends Omit<CommandModule<T, U>, 'handler'> {

    /** This handler is passed the parsed arguments. */
    handler: (args: ArgumentsCamelCase<U>) => void | Promise<void>;

}

/**
 * Creates a Yargs `CommandModule` from the specified `Command` object.
 *
 * @note This signature seems to work better with type inference for the handler than
 * the signature with the `Command` object.
 *
 * @param command The command and its positional parameters.
 * @param description The description of the command.
 * @param builder Configures the command and its parameters.
 * @param handler This handler is passed the parsed arguments.
 */
export function createYargsCommand<U>(
    command: string | string[],
    description: string,
    builder: CommandBuilder<{}, U>,
    handler: (args: ArgumentsCamelCase<U>) => void | Promise<void>,
): CommandModule<{}, U>;
/**
 * Creates a Yargs `CommandModule` from the specified `Command` object.
 */
export function createYargsCommand<T = {}, U = {}>(command: Command<T, U>): CommandModule<T, U>;
export function createYargsCommand<T, U>(
    command: (string | string[]) | Command<T, U>,
    description?: string,
    builder?: CommandBuilder<{}, U>,
    handler?: (args: ArgumentsCamelCase<U>) => void | Promise<void>,
): CommandModule<T, U> {
    if (typeof command === 'string' || Array.isArray(command)) {
        return createYargsCommandFromParams(command, description, builder, handler);
    }
    return createYargsCommandFromCommandObj(command);
}

function createYargsCommandFromCommandObj<T = {}, U = {}>(command: Command<T, U>): CommandModule<T, U> {
    const { handler, ...cmd } = command;

    const executeHandler: (args: ArgumentsCamelCase<U>) => void = args => {
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

function createYargsCommandFromParams<U>(
    command: string | string[],
    description: string,
    builder: CommandBuilder<{}, U>,
    handler: (args: ArgumentsCamelCase<U>) => void | Promise<void>,
): CommandModule<{}, U> {
    return createYargsCommandFromCommandObj({
        command,
        describe: description,
        builder,
        handler,
    });
}

