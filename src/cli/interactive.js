import readline from "readline"

const interactive = () => {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		prompt: "> "
	});

	rl.prompt();

	rl.on("close", () => {
		console.log("Goodbye!");
		process.exit(0);
	});

	rl.on("line", (line) => {
		const cmd = line.trim();

		switch (cmd.toLowerCase()) {
			case "uptime":
				console.log(`Uptime: ${process.uptime().toFixed(2)}s`);
				rl.prompt();
				break;
			case "cwd":
				console.log(process.cwd());
				rl.prompt();
				break;
			case "date":
				console.log(new Date().toISOString());
				rl.prompt();
				break;
			case "exit":
				rl.close();
				return;
			default:
				console.log("Unknown command");
				rl.prompt();
		}
	});
};

interactive();