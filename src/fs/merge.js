import fs from "fs/promises"
import path from "path"

const rootPath = path.resolve('workspace');
const partsPath = path.join(rootPath, 'parts');

const merge = async () => {
	const directoryExists = await fs.access(partsPath).then(() => true).catch(() => false);
	if (!directoryExists) {
		throw new Error(`Directory ${partsPath} does not exist`);
	}

	const args = process.argv;
	const filesArgIndex = args.lastIndexOf("--files");
	let filesToMerge = [];

	if (filesArgIndex !== -1 && args[filesArgIndex + 1]) {
		filesToMerge = args[filesArgIndex + 1].split(",");
	} else {
		const allFiles = await fs.readdir(partsPath);
		filesToMerge = allFiles.filter(f => f.endsWith(".txt")).sort();
		if (filesToMerge.length === 0) {
			throw new Error("No files to merge");
		}
	}

	for (const file of filesToMerge) {
		const filePath = path.join(partsPath, file);
		const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
		if (!fileExists) {
			throw new Error(`File ${file} does not exist`);
		}
	}

	const results = [];
	try {
		await scanDirectory(partsPath, filesToMerge, results);
	} catch {
		throw new Error('FS operation failed');
	}

	if (filesArgIndex === -1) {
		results.sort((a, b) => a.entry.localeCompare(b.entry));
	}

	const mergedContent = results.map(result => result.content).join('');

	try {
		await fs.writeFile(path.join(rootPath, 'merged.txt'), mergedContent);
	} catch {
		throw new Error('FS operation failed');
	}
};

async function scanDirectory(directoryPath, filesToMerge, results) {
	const files = await fs.readdir(directoryPath);
	for (const element of files) {
		const filePath = path.join(directoryPath, element);
		const isDirectory = (await fs.stat(filePath)).isDirectory();
		const entry = path.relative(partsPath, filePath);
		if (isDirectory) {
			await scanDirectory(filePath, filesToMerge, results);
		} else {
			if (filesToMerge.includes(element)) {
				const content = await fs.readFile(filePath, 'utf8');
				results.push({ entry, content });
			}
		}
	}
}

await merge();