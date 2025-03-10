# NextGenCryptor Backend

NextGenCryptor is a custom-designed cryptographic demonstration tool that showcases innovative encryption and decryption techniques. This backend employs a multi-layered approach that combines a traditional XOR one-time pad with non-linear interleaving and outer-layer nonce masking. The result is a robust obfuscation mechanism where even encryptions of identical plaintext produce entirely different ciphertexts. Although this design is intended for educational and demonstration purposes only, it highlights important concepts such as random key generation, permutation-based interleaving, and nonce-based masking. For any production-level security, it is strongly recommended to use well-established cryptographic libraries and protocols.

## Cryption Techniques

### Encryption Algorithm

1. **Preparation**

   - **Message Conversion:**  
     The plaintext is taken and each character is converted to its byte value (using its character code).
   - **One-Time Pad (Key) Generation:**  
     A random key is generated with the same length as the message. Each key byte is a random number between 0 and 255.

2. **Inner Encryption (XOR and Interleaving)**

   - **XOR Operation:**  
     Each plaintext byte is XOR‑ed with the corresponding key byte to produce a ciphertext byte. This is the basic XOR encryption step.
   - **Random Permutation Generation:**  
     A random permutation of indices for the message length is generated. For a message of length _M_, this gives a random reordering of the numbers from 0 to _M_‑1.
   - **Interleaving Ciphertext and Key Bytes:**  
     An array `Y` of size 2\*M is created. For each original message index _i_:
     - The ciphertext byte is placed at position `2 * r[i]` in `Y`.
     - The corresponding key byte is placed at position `2 * r[i] + 1` in `Y`.  
       This interleaving scrambles the key and ciphertext pairs according to the random permutation.
   - **Header Construction:**  
     A header is created that contains:
     - The message length (encoded as 4 hexadecimal digits).
     - The permutation array (each number of the permutation is encoded as 4 hexadecimal digits).  
       The header lets the decryption process know how many bytes to expect and how to reassemble the original order.
   - **Inner Ciphertext Assembly:**  
     The inner ciphertext is the header concatenated with the hexadecimal representation of the interleaved array `Y`.

3. **Outer Layer Encryption (Nonce Masking)**
   - **Nonce Generation:**  
     A random 16-byte nonce is generated.
   - **XOR Masking with the Nonce:**  
     The inner ciphertext (converted from its hex string to bytes) is XOR‑ed with the nonce repeated cyclically over the entire length. This outer layer randomizes the result further, ensuring that even if you encrypt the same plaintext twice, the final output will be completely different.
   - **Final Output:**  
     The nonce (in hexadecimal) is prepended to the masked ciphertext. The final encrypted message is:  
     **nonceHex (32 hex characters) + outer masked ciphertext (hex string)**.

---

### Decryption Algorithm

1. **Outer Layer Removal**

   - **Nonce Extraction:**  
     The first 32 hex characters of the encrypted message are extracted and converted back to a 16-byte nonce.
   - **Undo Outer XOR Masking:**  
     The remainder of the encrypted message (after the nonce) is converted to bytes. Each byte is XOR‑ed with the corresponding byte from the repeated nonce to recover the inner ciphertext.

2. **Inner Decryption (Header and Interleaved Data)**
   - **Header Parsing:**  
     The first 4 hex characters of the inner ciphertext provide the message length _M_. The next _M_ numbers (each 4 hex digits) represent the permutation array. This permutation tells us where each ciphertext/key pair was placed.
   - **Extracting Interleaved Data:**  
     After the header, the rest of the inner ciphertext is the interleaved array `Y` (of 2\*M bytes).
   - **Reassembling Ciphertext and Key Bytes:**  
     For each index _i_ from 0 to _M_‑1, use the stored permutation value to find the positions in `Y`:
     - The ciphertext byte is at position `2 * r[i]`.
     - The key byte is at position `2 * r[i] + 1`.
   - **XOR Decryption:**  
     For each byte pair, XOR the ciphertext byte with the key byte to recover the original plaintext byte.
   - **Message Reconstruction:**  
     The plaintext bytes are converted back to characters to reconstruct the original message.

---

### Security Considerations

- **Randomness & Nonce:**  
  The outer layer with the nonce ensures that every encryption of the same plaintext produces a completely different ciphertext, even if the inner structure (header and interleaving) remains similar.
- **Interleaving & Permutation:**  
  By scattering the ciphertext and key bytes based on a random permutation, the algorithm avoids having a contiguous block for the key. However, the permutation is stored in the header, so while this scheme adds obfuscation, it is not equivalent to a secure, standard cryptographic protocol.
- **Demonstration Purpose:**  
  This custom design is for demonstration and educational purposes only. For any sensitive data, it’s recommended to use well-tested cryptographic libraries and protocols.

---

Feel free to use NextGenCryptor to explore advanced concepts in cryptography, experiment with different techniques, and better understand the trade-offs involved in designing secure systems.
