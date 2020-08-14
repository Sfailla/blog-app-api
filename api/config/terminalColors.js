// cool function I made for development to change terminal colors ✨🌈✨
const colorTerminal = terminalColor => {
	terminalColor = terminalColor.toLowerCase();
	const acceptedColors = [
		'red',
		'green',
		'yellow',
		'blue',
		'magenta',
		'cyan'
	];

	const RED = 31,
		GREEN = 32,
		YELLOW = 33,
		BLUE = 34,
		MAGENTA = 35,
		CYAN = 36;

	const checkColorReturnCode = color => {
		if (color === 'red') return RED;
		if (color === 'green') return GREEN;
		if (color === 'yellow') return YELLOW;
		if (color === 'blue') return BLUE;
		if (color === 'magenta') return MAGENTA;
		if (color === 'cyan') return CYAN;
	};

	const verifiedColor = acceptedColors.find(
		color => color === terminalColor
	);

	const colorModel = acceptedColors.reduce((obj, items) => {
		if (verifiedColor) {
			obj[items] = {
				isColor: items === verifiedColor,
				color: items,
				colorCode: checkColorReturnCode(items)
			};
		} else {
			obj['error'] = {
				isColor: false,
				message: `sorry ${terminalColor} is not available 😕\n`
			};
		}
		return obj;
	}, {});

	const model = verifiedColor
		? colorModel[verifiedColor]
		: colorModel['error'];

	const { colorCode, message } = model;

	return colorCode ? `\x1b[${colorCode}m%s\x1b[0m` : message;
};

module.exports = colorTerminal;
