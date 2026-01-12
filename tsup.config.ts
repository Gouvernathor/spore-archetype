import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ["src/*.ts"],
    format: ["esm", "cjs"],
    dts: true,
    // splitting: false,
    noExternal: [/.*/], // force tsup to bundle all dependencies
    sourcemap: true,
    clean: true,
});
