const duration = getArgument('--duration', tryParseInt, 2000);
const interval = getArgument('--interval', tryParseInt, 100);
const length = getArgument('--length', tryParseInt, 10);
const color = getArgument('--color', tryParseColor, null);
const startTime = Date.now();
let timer;

const progress = () => {
	timer = setInterval(() => printProgressBar(), interval);
};

function printProgressBar() {
	const currentProgress = Math.min(100, ((Date.now() - startTime) / duration) * 100);

	const filledLength = Math.round(length * currentProgress / 100);
	const emptyLength = Math.round(length - filledLength);

	const filledString = color !== null ? color + '█'.repeat(filledLength) + '\x1b[0m' : '█'.repeat(filledLength);
	const progressBar = '[' + filledString + ' '.repeat(emptyLength) + '] ' + Math.round(currentProgress) + '%';
	process.stdout.write(`\r${progressBar}`);

	if (currentProgress >= 100) {
		clearInterval(timer);
		process.stdout.write("\nDone!\n");
	}
}

function tryParseInt(value, defaultValue) {
	const result = parseInt(value, 10);
	return (value == null || value === '' || isNaN(result)) ? defaultValue : result;
}

function tryParseColor(color, defaultValue) {
	if (color == null || color === '') {
		return defaultValue;
	}
	color = color.replace('#', '');
	const r = parseInt(color.substring(0, 2), 16);
	const g = parseInt(color.substring(2, 4), 16);
	const b = parseInt(color.substring(4, 6), 16);
	return (r == null || g == null || b == null || isNaN(r) || isNaN(g) || isNaN(b)) ? defaultValue : `\x1b[38;2;${r};${g};${b}m`;
}

function getArgument(name, parseFunction, defaultValue) {
	const index = process.argv.lastIndexOf(name);
	if (index !== -1 && process.argv[index + 1]) {
		return parseFunction(process.argv[index + 1], defaultValue);
	}
	return defaultValue;
}

progress();