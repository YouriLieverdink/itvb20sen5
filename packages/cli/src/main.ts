#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { Shell } from './services/shell';

yargs(hideBin(process.argv))
    .command('connect [port]', 'Connect to a running node.', (yargs) => {
        return yargs
            .positional('port', {
                describe: 'The host port of the running node.',
                default: 3001,
            })
    }, async (argv) => {
        //
        await Shell.instance(argv.port);
    })
    .parse();