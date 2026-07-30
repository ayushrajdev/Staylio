import os from 'os';
import logger from '../../config/logger.config.ts';

type StartupInfo = {
    port: number;
    nodeEnv: string;
};

export function logStartupInfo(info: StartupInfo) {
    console.table({
        Environment: info.nodeEnv,
        Port: info.port,
        'Node Version': process.version,
        Platform: process.platform,
        'CPU Cores': os.cpus().length,
        Memory: `${Math.round(os.totalmem() / 1024 / 1024 / 1024)} GB`,
        PID: process.pid,
    });
}
