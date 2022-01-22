import axios, { AxiosError, AxiosInstance } from 'axios';
import readline from 'readline';

/**
 * Responsible for providing an interactive shell for the user to interact
 * with the node that they have running.
 */
export class Shell {
    /**
     * The instance for making http requests.
     */
    private http: AxiosInstance;

    /**
     * Creates an instance of the
     * 
     * @param port The port on which the node is.
     */
    public static async instance(port: number): Promise<void> {
        try {
            const http = axios.create({
                baseURL: `http://0.0.0.0:${port}/api`,
            });

            // Ping the node to see if it is available.
            await http.get('/ping');

            new Shell(http);
        } //
        catch (e) {
            //
            const error: AxiosError = e;

            if (error.response) {
                // The node returned an error.
                Shell.response.error(error.message);
            }
            else if (error.request) {
                // The node could not be reached.
                Shell.response.error('Connection refused.');
                process.exit(1);
            }
        }
    }

    /**
     * Class constructor.
     * 
     * @param port The port on which the node is located.
     */
    constructor(
        http: AxiosInstance,
    ) {
        //
        this.http = http;

        Shell.response.clear();

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const ask = () => rl.question(
            '\x1b[0mtritium> ',
            async (request) => {
                await this.handle(request);
                ask();
            },
        );

        ask();
    }

    /**
     * Handle all incoming shell commands.
     * 
     * @param request The incoming line.
     */
    private async handle(request: string): Promise<void> {
        const args = request.trim().split(' ');
        const command = args.shift();

        try {
            // Attempt to call the provided command.
            await (this.commands[command](args));
        }
        catch (e) {
            //
            if (e.name === 'TypeError') {
                // The command was not found.
                Shell.response.error('Invalid command');
                Shell.response.log('Enter \'help\' to display command line options.\n');
            } //
            else if (e.name === 'AxiosError') {
                const error: AxiosError = e;

                if (error.response) {
                    // The node returned an error.
                    Shell.response.error(error.message);
                } //
                else if (error.request) {
                    // The node could not be reached.
                    Shell.response.error('Connection refused.');
                    process.exit(1);
                }
            } //
            else {
                // An unknown error occured.
                Shell.response.error(e.message);
            }
        }
    };

    /**
     * Default responses.
     */
    private static readonly response = {
        /**
         * Logs a message.
         * 
         * @param message The message to display.
         */
        log: (message: string): void => {
            console.log(`  ${message}`);
        },
        /**
         * Displays a "bad syntax" message.
         */
        bad: (): void => {
            Shell.response.error('Wrong syntax');
            Shell.response.log('Enter \'help\' to display command line options.');
        },
        /**
         * Displays an indented message in red.
         * 
         * @param message The message to display.
         */
        error: (message: string): void => {
            Shell.response.log(`\x1b[31m${message}\x1b[0m`);
        },
        /**
         * Clear the screen and display the logo.
         */
        clear: (): void => {
            console.clear();
            Shell.response.log('\n' +
                '████████╗ ██████╗  ██╗ ████████╗ ██╗ ██╗   ██╗ ███╗   ███╗\n' +
                '╚══██╔══╝ ██╔══██╗ ██║ ╚══██╔══╝ ██║ ██║   ██║ ████╗ ████║\n' +
                '   ██║    ██████╔╝ ██║    ██║    ██║ ██║   ██║ ██╔████╔██║\n' +
                '   ██║    ██╔══██╗ ██║    ██║    ██║ ██║   ██║ ██║╚██╔╝██║\n' +
                '   ██║    ██║  ██║ ██║    ██║    ██║ ╚██████╔╝ ██║ ╚═╝ ██║\n' +
                '   ╚═╝    ╚═╝  ╚═╝ ╚═╝    ╚═╝    ╚═╝  ╚═════╝  ╚═╝     ╚═╝\n' +
                '\n Enter \'help\' to display command line options.\n'
            );
        }
    };

    /**
     * The available commands.
     */
    private readonly commands = {
        exit: async (): Promise<void> => {
            process.exit(0);
        },
    };
}