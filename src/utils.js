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
  let quotient_array = [],
    encrypted_message_word = [];

  const wordset = alphabetArray.concat(numberArray);
  console.log(wordset.length);

  message.split("").forEach((word, index) => {
    if (word !== " ") {
      quotient_array.push(
        parseInt((word.charCodeAt(0) + index) / wordset.length)
      );
      encrypted_message_word.push(
        `${wordset[(word.charCodeAt(0) + index) % wordset.length]}${
          alphabetArray[quotient_array[index]]
        }`
      );
    } else {
      quotient_array.push(-1);
      encrypted_message_word.push(
        `${specialCharacterArray[index % specialCharacterArray.length].replace(
          /[\s!"#$%&'()*+,-./:;<=>?@[]^_`{|}~]/g,
          "\\$&"
        )}${alphabetArray[index % alphabetArray.length]}`
      );
    }
  });
  console.log(quotient_array);
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
