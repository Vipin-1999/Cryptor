export const introduction = `
Welcome to the **NextGenCryptor**! This application demonstrates a secure encryption and decryption mechanism where each encryption uses a **fresh, randomly generated key**. The key is automatically embedded within the ciphertext at a random position, ensuring that only the decryption algorithm can extract it to recover your original message. **You do not need to provide a key.**

## How It Works

- **Encryption**: 
  - A fresh random key is generated for every encryption request.
  - The key is embedded at a random position within the ciphertext.
  - Even if you encrypt the same message multiple times, the outputs will differ.

- **Decryption**:
  - The algorithm extracts the embedded key from the ciphertext.
  - It then uses the key to decrypt the ciphertext and recover the original message.

## Data Types

You can choose to encrypt messages in two formats:

- **String**: For plain text.  
  **Example**:  
  \`\`\`
  Hello World
  \`\`\`

- **JSON**: For structured data.  
  **Example**:  
  \`\`\`
  {
  "name": "Alice",
  "age": 30
}
  \`\`\`

Feel free to copy the examples and test them out!
`;

export const toolsConfig = [
  {
    mode: "encrypt",
    inputTitle: "Encrypt Message",
    outputTitle: "Encrypted Message",
    actionLabel: "Encrypt",
    description: `## Encryption

Encrypt your message securely. When you click **Encrypt**, a new random key is generated and embedded within the ciphertext. Use the appropriate data type:

- **String**: For plain text.
- **JSON**: For structured data (ensure your JSON is valid).

**Examples:**

- Plain text:
\`\`\`
Hello World
\`\`\`

- JSON:
\`\`\`
{
"name": "Alice",
"age": 30
}
\`\`\`

Try encrypting your own message using one of these formats.`,
  },
  {
    mode: "decrypt",
    inputTitle: "Decrypt Message",
    outputTitle: "Decrypted Message",
    actionLabel: "Decrypt",
    description: `## Decryption

Decrypt the generated ciphertext here. The function will automatically extract the embedded key from the ciphertext and decrypt your message.

**Example:**

Obtain a cipher text by encrypting a message in the encryption section. Paste it below in the textfield and click **Decrypt** to view the original message.`,
  },
];
