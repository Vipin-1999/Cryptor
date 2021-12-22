const alphabetArray = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];
const specialCharacterArray = [
  "!",
  '"',
  "#",
  "$",
  "%",
  "&",
  "'",
  "(",
  ")",
  "*",
  "+",
  ",",
  "-",
  ".",
  "/",
  ":",
  ";",
  "<",
  "=",
  ">",
  "?",
  "@",
  "[",
  "\\",
  "]",
  "^",
  "_",
  "`",
  "{",
  "|",
  "}",
  "~",
];
const numberArray = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

export const EncryptionAlgorithm = (message) => {
  let encrypted_message_word = [];

  const wordset = alphabetArray.concat(numberArray);

  message.split("").forEach((word, index) => {
    if (word !== " ") {
      encrypted_message_word.push(
        `${wordset[(word.charCodeAt(0) + index) % wordset.length]}${
          alphabetArray[parseInt((word.charCodeAt(0) + index) / wordset.length)]
        }`
      );
    } else {
      encrypted_message_word.push(
        `${specialCharacterArray[index % specialCharacterArray.length].replace(
          /[\s!"#$%&'()*+,-./:;<=>?@[]^_`{|}~]/g,
          "\\$&"
        )}${alphabetArray[index % alphabetArray.length]}`
      );
    }
  });
  encrypted_message_word = encrypted_message_word.join("");
  return encrypted_message_word;
};

export const DecryptionAlgorithm = (encrypted_message_word) => {
  let decrypted_message_word = [];

  const wordset = alphabetArray.concat(numberArray);

  encrypted_message_word.split("").forEach((character, index) => {
    if (index % 2 === 0) {
      var format = /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;
      if (
        format.test(
          encrypted_message_word.charAt(index) +
            encrypted_message_word.charAt(index + 1)
        )
      ) {
        decrypted_message_word.push(" ");
      } else {
        const getQuotient = alphabetArray.indexOf(
          encrypted_message_word.charAt(index + 1)
        );
        decrypted_message_word.push(
          String.fromCharCode(
            wordset.indexOf(character) +
              wordset.length * getQuotient -
              index +
              index / 2
          )
        );
      }
    }
  });
  decrypted_message_word = decrypted_message_word.join("");
  return decrypted_message_word;
};
