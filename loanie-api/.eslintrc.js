module.exports = {
	env: {
		es6: true,
		node: true,
	},
	extends:
		"airbnb",
	parserOptions: {
		sourceType:
			"module",
	},
	rules: {
		indent: [
			"error",
			"space",
		],
		"linebreak-style": [
			"error",
			"windows",
		],
		quotes: [
			"error",
			"double",
		],
		semi: [
			"error",
			"always",
		],
	},
};
