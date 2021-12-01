#!/usr/bin/env node

import { PolarisCliImpl } from './app/polaris-cli.impl';

try {
    const cli = new PolarisCliImpl({
        startupDir: process.cwd(),
    });
    cli.run();
} catch (e) {
    console.error(e);
}
