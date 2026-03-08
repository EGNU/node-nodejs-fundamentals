import { spawn } from "child_process";

const execCommand = () => {
	const arg = process.argv[2];

	if (arg === undefined || arg === '') {
		console.error("No argument provided");
		process.exit(1);
	}

	const childProcess = spawn(arg, {
		shell: true,
		env: process.env
	});

	childProcess.stdout.pipe(process.stdout);
	childProcess.stderr.pipe(process.stderr);

	childProcess.on("close", (code) => {
		process.exit(code);
	});
};

execCommand();