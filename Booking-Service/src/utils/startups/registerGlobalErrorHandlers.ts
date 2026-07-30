
 function registerGlobalErrorHandlers() {
    process.on('uncaughtException', (error) => {
        process.exit(1);
    });

    process.on('unhandledRejection', (reason) => {
        process.exit(1);
    });
}
export default registerGlobalErrorHandlers