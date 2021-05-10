import { PolarisCli } from './app/polaris-cli';

try {
    const cli = new PolarisCli({
        startupDir: process.cwd(),
    });
    cli.run();
} catch (e) {
    console.error(e);
}
