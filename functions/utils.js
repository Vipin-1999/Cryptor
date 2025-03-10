// utils.js

/**
 * Generates a random permutation of numbers 0..n-1 using Fisher-Yates shuffle.
 * @param {number} n 
 * @returns {number[]} Random permutation array.
 */
function generateRandomPermutation(n) {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Converts an array of bytes to a hexadecimal string.
 * @param {number[]} arr 
 * @returns {string}
 */
function bytesToHex(arr) {
  return arr.map(b => ('00' + b.toString(16)).slice(-2)).join('');
}

/**
 * Converts a hexadecimal string to an array of bytes.
 * @param {string} hex 
 * @returns {number[]}
 */
function hexToBytes(hex) {
  const bytes = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.substr(i, 2), 16));
  }
  return bytes;
}

/**
 * Generates an array of n random bytes (0-255).
 * @param {number} n 
 * @returns {number[]}
 */
function randomBytes(n) {
  const bytes = [];
  for (let i = 0; i < n; i++) {
    bytes.push(Math.floor(Math.random() * 256));
  }
  return bytes;
}

/**
 * newEncryptionAlgorithm:
 * Encrypts a message using a one-time pad and then interleaves each ciphertext-key pair
 * nonlinearly based on a random permutation. Then, an outer layer is applied by XOR-ing
 * the inner ciphertext (header + interleaved data) with a random 16-byte nonce.
 *
 * Inner encryption steps:
 * 1. Generate a random key (one-time pad) of length M (message length).
 * 2. Compute ciphertext bytes by XOR-ing each plaintext byte with the key.
 * 3. Generate a random permutation r of indices [0, M-1].
 * 4. Create an array Y of length 2*M. For each i (0 <= i < M), place:
 *      - ciphertext[i] at position (2 * r[i])
 *      - key[i] at position (2 * r[i] + 1)
 * 5. Build a header:
 *      - First 4 hex digits: M (message length, padded to 4 hex digits)
 *      - Next, the permutation array r, each element encoded as 4 hex digits.
 * 6. Let inner = header + hex(Y).
 *
 * Outer layer:
 * 7. Generate a random 16-byte nonce.
 * 8. Convert inner to bytes, then XOR each byte with nonce repeated cyclically.
 * 9. Prepend the nonce (in hex, 32 hex digits) to the outer ciphertext.
 *
 * @param {string} message Plaintext to encrypt.
 * @returns {string} The final encrypted message.
 */
function newEncryptionAlgorithm(message) {
  const M = message.length;
  const keyBytes = [];
  const plaintextBytes = [];
  const ciphertextBytes = [];

  // Generate key and plaintext byte array.
  for (let i = 0; i < M; i++) {
    plaintextBytes.push(message.charCodeAt(i));
    keyBytes.push(Math.floor(Math.random() * 256));
  }
  // XOR to compute ciphertext bytes.
  for (let i = 0; i < M; i++) {
    ciphertextBytes.push(plaintextBytes[i] ^ keyBytes[i]);
  }

  // Generate a random permutation r of indices [0, M-1].
  const permutation = generateRandomPermutation(M);
  const totalLength = 2 * M;
  const Y = new Array(totalLength);
  // Place each ciphertext-key pair into Y at positions defined by the permutation.
  for (let i = 0; i < M; i++) {
    const pos = 2 * permutation[i];
    Y[pos] = ciphertextBytes[i];
    Y[pos + 1] = keyBytes[i];
  }
  const Yhex = bytesToHex(Y);

  // Build header:
  // - First 4 hex digits: message length M.
  const Mhex = M.toString(16).padStart(4, '0');
  // - Next, permutation array: each element as 4 hex digits.
  const permHex = permutation.map(num => num.toString(16).padStart(4, '0')).join('');
  const header = Mhex + permHex;

  const inner = header + Yhex; // Inner ciphertext (hex string)

  // Outer layer: generate a random 16-byte nonce.
  const nonce = randomBytes(16);
  const nonceHex = bytesToHex(nonce);

  // Convert inner hex string to bytes.
  const innerBytes = hexToBytes(inner);
  // XOR each byte with nonce repeated.
  const outerBytes = innerBytes.map((b, i) => b ^ nonce[i % nonce.length]);
  const outerHex = bytesToHex(outerBytes);

  // Final output: nonceHex + outerHex.
  return nonceHex + outerHex;
}

/**
 * newDecryptionAlgorithm:
 * Reverses the process of newEncryptionAlgorithm.
 *
 * Steps:
 * 1. Extract the nonce from the first 32 hex characters (16 bytes).
 * 2. XOR the remainder of the ciphertext with the nonce repeated to recover the inner ciphertext.
 * 3. Parse the header from the inner ciphertext:
 *      - First 4 hex digits: M (message length).
 *      - Next M*4 hex digits: permutation array.
 * 4. Convert the remaining hex string to array Y of length 2*M.
 * 5. For each i from 0 to M-1, using permutation[i]:
 *      - Retrieve ciphertext byte from Y at position (2 * permutation[i])
 *      - Retrieve key byte from Y at position (2 * permutation[i] + 1)
 * 6. XOR to recover the plaintext.
 *
 * @param {string} encryptedMessage The final encrypted message.
 * @returns {string} The decrypted plaintext.
 */
function newDecryptionAlgorithm(encryptedMessage) {
  // Extract nonce (first 32 hex characters = 16 bytes).
  const nonceHex = encryptedMessage.slice(0, 32);
  const nonce = hexToBytes(nonceHex);
  const outerHex = encryptedMessage.slice(32);
  const outerBytes = hexToBytes(outerHex);

  // Recover inner ciphertext by XOR-ing with nonce repeated.
  const innerBytes = outerBytes.map((b, i) => b ^ nonce[i % nonce.length]);
  const innerHex = bytesToHex(innerBytes);

  // Parse header:
  // First 4 hex digits: message length.
  const Mhex = innerHex.slice(0, 4);
  const M = parseInt(Mhex, 16);
  // Next M numbers (each 4 hex digits) are the permutation.
  const permHexStr = innerHex.slice(4, 4 + M * 4);
  const permutation = [];
  for (let i = 0; i < M; i++) {
    const numHex = permHexStr.slice(i * 4, i * 4 + 4);
    permutation.push(parseInt(numHex, 16));
  }
  const headerLength = 4 + M * 4;
  const Yhex = innerHex.slice(headerLength);
  const Y = hexToBytes(Yhex);
  if (Y.length !== 2 * M) {
    throw new Error("Invalid encrypted message length.");
  }

  const plaintextChars = [];
  for (let i = 0; i < M; i++) {
    const pos = 2 * permutation[i];
    const c = Y[pos];
    const k = Y[pos + 1];
    plaintextChars.push(String.fromCharCode(c ^ k));
  }
  return plaintextChars.join('');
}

module.exports = {
  EncryptionAlgorithm: newEncryptionAlgorithm,
  DecryptionAlgorithm: newDecryptionAlgorithm,
};
