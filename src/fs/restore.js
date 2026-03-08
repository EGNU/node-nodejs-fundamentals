import fs from "fs/promises"
import path from "path"

const restore = async () => {
	const snapshotName = 'snapshot.json';
	const snapshotExists = await fs.access(snapshotName, fs.constants.F_OK).then(() => true).catch(() => false);
	if (!snapshotExists) {
		throw new Error(`Snapshot file ${snapshotName} does not exist`);
	}

	const workspaceRestoredName = 'workspace_restored';
	const workspaceRestoredExists = await fs.access(workspaceRestoredName, fs.constants.F_OK).then(() => true).catch(() => false);
	if (workspaceRestoredExists) {
		throw new Error(`Workspace restored directory ${workspaceRestoredName} already exists`);
	}

	const snapshot = await fs.readFile(snapshotName, 'utf8');
	const snapshotData = JSON.parse(snapshot);
	const entries = snapshotData.entries;

	const workspaceRestoredPath = path.resolve(workspaceRestoredName);
	await fs.mkdir(workspaceRestoredPath, { recursive: false });

	for (const entry of entries) {
		if (entry.type === 'directory') {
			await fs.mkdir(path.resolve(workspaceRestoredPath, entry.path), { recursive: false });
		} else if (entry.type === 'file') {
			const content = Buffer.from(entry.content, 'base64');
			await fs.writeFile(path.resolve(workspaceRestoredPath, entry.path), content);
		}
	}
};

await restore();