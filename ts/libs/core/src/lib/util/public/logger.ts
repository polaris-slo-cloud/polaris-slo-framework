
// ToDo: use a logging framework

interface LogData {
    message: string;
    data?: any[];
}

/**
 * Used for logging within Polaris.
 */
export class Logger {

    static log(message: string, ...data: any[]): void;
    static log(...data: any[]): void;
    static log(messageOrData: string | any[], ...data: any[]): void {
        const logData = this.normalizeLogData(messageOrData, data);
        if (logData.data) {
            console.log(logData.message, ...logData.data);
        } else {
            console.log(logData.message);
        }
    }

    static error(message: string, ...data: any[]): void;
    static error(...data: any[]): void;
    static error(messageOrData: string | any[], ...data: any[]): void {
        const logData = this.normalizeLogData(messageOrData, data);
        if (logData.data) {
            console.error(logData.message, ...logData.data);
        } else {
            console.error(logData.message);
        }
    }

    private static normalizeLogData(messageOrData: string | any[], ...data: any[]): LogData {
        const time = new Date().toISOString();

        let msg: string;
        if (Array.isArray(messageOrData)) {
            msg = time + ': ';
            data = messageOrData;
        } else {
            msg = `${time}: ${messageOrData}`;
        }

        return {
            message: msg,
            data,
        };
    }

}
