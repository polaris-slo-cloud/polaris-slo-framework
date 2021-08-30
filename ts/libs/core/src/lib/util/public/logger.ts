
// ToDo: use a logging framework

/**
 * Used for logging within Polaris.
 */
export class Logger {

    static log(message: string, ...data: any[]): void;
    static log(...data: any[]): void;
    static log(messageOrData: string | any[], ...data: any[]): void {
        const time = new Date().toISOString();

        let msg: string;
        if (Array.isArray(messageOrData)) {
            msg = time + ': ';
            data = messageOrData;
        } else {
            msg = `${time}: ${messageOrData}`;
        }

        if (data) {
            console.log(msg, ...data);
        } else {
            console.log(msg);
        }
    }

}
