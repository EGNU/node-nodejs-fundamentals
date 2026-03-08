import fs from "fs/promises"
import path from "path"

const workspaceName = 'workspace';
const rootPath = path.resolve(workspaceName);
let ext = 'txt';

const findByExt = async () => {
	const directoryExists = await fs.access(rootPath).then(() => true).catch(() => false);
	if (!directoryExists) {
		throw new Error(`Directory ${workspaceName} does not exist`);
	}

	const extIndex = process.argv.lastIndexOf('--ext');
	if (extIndex !== -1 && process.argv[extIndex + 1]) {
		ext = process.argv[extIndex + 1];
	}

	const entries = [];
	try {
		await scanDirectory(rootPath, entries);
	} catch {
		throw new Error('FS operation failed');
	}
	entries.sort();
	entries.forEach(entry => console.log(entry));
};

async function scanDirectory(directoryPath, entries) {
	const files = await fs.readdir(directoryPath);
	for (const element of files) {
		const filePath = path.join(directoryPath, element);
		const isDirectory = (await fs.stat(filePath)).isDirectory();
		const entry = path.relative(rootPath, filePath);
		if (isDirectory) {
			await scanDirectory(filePath, entries);
		} else if (path.extname(element) === '.' + ext) {
			entries.push(entry);
		}
	}
}

await findByExt();