export default function hookLogger() {
  const methods = ["log", "error", "warn", "info", "debug"] as const;

  methods.forEach(method => {
    const orig = console[method];
    console[method] = (...args: unknown[]) => {
      const stack = new Error().stack
        ?.split("\n")
        .slice(2)
        .filter(line => !line.includes("hook-logger.ts"));

      orig.call(console, `\n[console.${method}]`, ...args);
      orig.call(console, "Stack trace:\n" + (stack?.join("\n") ?? "no stack"));
    };
  });
}
