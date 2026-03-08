const dynamic = async () => {
	try {
		const pluginName = process.argv[2];
		const plugin = await import(`./plugins/${pluginName}.js`);
		if (!plugin.run || typeof plugin.run !== 'function') {
			throw new Error();
		}
		console.log(plugin.run());
	} catch {
		console.error('Plugin not found');
		process.exit(1);
	}
};

await dynamic();