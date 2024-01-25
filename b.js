import { $ } from "bun";

// to stdout:
await $`ls *.js`;

// to string:
const text = await $`ls *.js`.text();
