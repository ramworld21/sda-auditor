#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { auditColors } from "./src/analyzers/colorAuditor.js";

const argv = yargs(hideBin(process.argv))
  .usage("Usage: $0 <url>")
  .demandCommand(1)
  .argv;

const url = argv._[0];
auditColors(url);
