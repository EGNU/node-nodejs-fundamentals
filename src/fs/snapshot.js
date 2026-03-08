import fs from "fs/promises"
import path from "path"

const workspaceName = 'workspace';
const rootPath = path.resolve(workspaceName);

const snapshot = async () => {
	const directoryExists = await fs.access(workspaceName, fs.constants.F_OK).then(() => true).catch(() => false);
	if (!directoryExists) {
		throw new Error(`Directory ${workspaceName} does not exist`);
	}
	const entries = [];
	await scanDirectory(rootPath, entries);
	await saveSnapshot(entries);
};

async function scanDirectory(directoryPath, entries) {
	const files = await fs.readdir(directoryPath);
	for (const element of files) {
		const filePath = path.resolve(directoryPath, element);
		const isDirectory = (await fs.stat(filePath)).isDirectory();
		const entry = {
			path: path.relative(workspaceName, filePath),
			type: isDirectory ? 'directory' : 'file'
		};
		if (isDirectory) {
			entries.push(entry);
			await scanDirectory(filePath, entries);
		} else {
			entry.size = await fs.stat(filePath).size;
			entry.content = await fs.readFile(filePath, 'base64');
			entries.push(entry);
		}
	}
}

async function saveSnapshot(entries) {
	const output = {
		rootPath: rootPath,
		entries: entries
	};
	await fs.writeFile('snapshot.json', JSON.stringify(output, null, 2));
}

await snapshot();