// cool function I made for development to change terminal colors ✨🌈✨
const colorTerminal = terminalColor => {
  terminalColor = terminalColor.toLowerCase()
  const acceptedColors = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan']

  const checkColorReturnCode = color => {
    const colorMap = {
      red: 31,
      green: 32,
      yellow: 33,
      blue: 34,
      magenta: 35,
      cyan: 36
    }

    return colorMap[color]
  }

  const verifiedColor = acceptedColors.find(color => color === terminalColor)

  const colorModel = acceptedColors.reduce((obj, items) => {
    if (verifiedColor) {
      obj[items] = {
        isColor: items === verifiedColor,
        color: items,
        colorCode: checkColorReturnCode(items)
      }
    } else {
      obj['error'] = {
        isColor: false,
        message: `sorry ${terminalColor} is not available 😕\n`
      }
    }
    return obj
  }, {})

  const model = verifiedColor ? colorModel[verifiedColor] : colorModel['error']

  const { colorCode, message } = model

  return colorCode ? `\x1b[${colorCode}m%s\x1b[0m` : message
}

module.exports = colorTerminal
