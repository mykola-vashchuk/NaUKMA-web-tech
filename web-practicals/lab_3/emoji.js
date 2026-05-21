const dictionary = {
  "сонце":    "☀️",
  "хмара":    "☁️",
  "дощ":      "🌧️",
  "сніг":     "❄️",
  "блискавка":"⚡",
  "серце":    "❤️",
  "усмішка":  "😊",
  "сум":      "😢",
  "сміх":     "😂",
  "кава":     "☕",
  "піца":     "🍕",
  "яблуко":   "🍎",
  "собака":   "🐶",
  "кіт":      "🐱",
  "книга":    "📚",
  "телефон":  "📱",
  "комп":     "💻",
};
a = [1, 2, 3]
b = [[4, 5], [6, 7]]

const dictionaryMap = new Map(Object.entries(dictionary))

function translate(text) {
  let result = text;
  for (const word in dictionary) {
    result = result.replaceAll(word, dictionary[word]);

    let capitalized = word.charAt(0).toUpperCase() + word.slice(1);
    result = result.replaceAll(capitalized, dictionary[word]);
    
    let uppercase = word.toUpperCase();
    result = result.replaceAll(uppercase, dictionary[word]);
  }
  return result;
}

function translateMap(text) {
  return Array.from(dictionaryMap.entries()).reduce((result, [word, emoji]) => {
    const capitalized = word.charAt(0).toUpperCase() + word.slice(1)
    const uppercase = word.toUpperCase()

    return result
      .replaceAll(word, emoji)
      .replaceAll(capitalized, emoji)
      .replaceAll(uppercase, emoji)
  }, text)
}


const combinedWithSpread = [...a, ...b]
const nestedArray = [...a, b]


console.log(combinedWithSpread)
console.log(nestedArray)

console.log(translateMap("сьогодні сонце і усмішка"))
console.log(translateMap("СОНЦЕ і Хмара. Дощ?"))


function translateReverse(text) {
  let result = text;
  for (const word in dictionary) {
    const emoji = dictionary[word];
    result = result.replaceAll(emoji, word);
  }
  return result;
}

console.log(translate("сьогодні сонце і усмішка"));
console.log(translate("СОНЦЕ і Хмара. Дощ?"));
console.log(translateReverse("☀️ і ☁️"));

console.log(translateMap("сьогодні сонце і усмішка"));
console.log(translateMap("СОНЦЕ і Хмара. Дощ?"));
console.log(translateReverse("☀️ і ☁️"));