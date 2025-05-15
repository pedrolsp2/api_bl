const formatString = {
  sanitizeString: (string: string) => {
    let sanitizedString = string.replace(/[`'\/\\]/g, '-');
    sanitizedString = sanitizedString.replace(/[^a-zA-Z0-9-_\.]/g, '');

    return sanitizedString;
  },

  getFileExtension: (fileName: string) => {
    let regex = /(?:\.([^.]+))?$/;
    let match = regex.exec(fileName);
    let extension = match ? match[1] : '';
    return extension;
  },

  capitalize: (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  },

  getWordByIndex: (phrase: string, separator = ' ', index: number) => {
    return phrase.split(separator)[index];
  },

  getFirstWord: (phrase: string, separator = ' ') => {
    return phrase.split(separator)[0];
  },

  getLastWord: (phrase: string, separator = ' ') => {
    const wordArray = phrase.split(separator);

    return wordArray[wordArray.length - 1];
  },

  getWordCount: (phrase: string, separator = ' ') => {
    return phrase.split(separator).length;
  },
};

export default formatString;
