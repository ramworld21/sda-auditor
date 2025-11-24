#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { auditColors } from "./src/analyzers/colorAuditor.js";

const argv = yargs(hideBin(process.argv))
  .usage("Usage: $0 <url>")
  .option('fast', { type: 'boolean', description: 'Skip responsive screenshots to speed up scan' })
  .demandCommand(1)
  .argv;

const url = argv._[0];
const fastMode = !!argv.fast;
auditColors(url, fastMode);
