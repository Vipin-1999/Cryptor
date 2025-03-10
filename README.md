# NextGenCryptor

NextGenCryptor is an interactive cryptor tool built with React and Material UI. It demonstrates a secure encryption and decryption mechanism where each encryption uses a **fresh, randomly generated key**. The key is automatically embedded within the ciphertext at a random position, ensuring that only the decryption algorithm can extract it to recover your original message. You do not need to provide a key!

This project doubles as interactive documentation. It includes detailed explanations, examples for both plain text and JSON formats, and live demo functionality.

<!-- Add a disclaimer stating this is only for educational purposes -->

## Features

- **Interactive Readme Style**: Documentation is rendered directly within the application using a custom markdown renderer.
- **Secure Encryption**: Each encryption operation generates a new random key and embeds it in the ciphertext.
- **Automated Decryption**: The decryption tool automatically extracts the embedded key to recover your message.

## Installation

### Prerequisites

- **Node.js** (v18 or above)
- **npm** (v10 or above)

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/Vipin-1999/Cryptor.git
   ```

2. **Navigate to the project directory**

   ```bash
   cd Cryptor
   ```

3. **Install dependencies**

   Using npm:

   ```bash
   npm install
   ```

   or using yarn:

   ```bash
   yarn install
   ```

4. **Configure environment variables**

   Create a `.env` file in the root directory and add:

   ```env
   REACT_APP_BACKEND_URL=https://your-backend-url.com/api
   ```

   Replace `https://your-backend-url.com/api` with the the url where your firebase function is running.

5. **Start the development server**

   Using npm:

   ```bash
   npm start
   ```

   or using yarn:

   ```bash
   yarn start
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```text
nextgencryptor/
├── public/
│   ├── index.html
│   └── cryptor-1.png            # Logo image
├── src/
│   ├── components/
│   │   ├── CryptoTool.js        # Main tool component for encryption and decryption
│   │   ├── Footer.js            # Footer component
│   │   ├── Navbar.js            # Navbar component with theme toggle
│   │   └── MarkdownRenderer.js  # Custom markdown renderer component
│   ├── utils/
│   │   └── axiosInstance.js     # Axios instance configuration
│   ├── theme.js                 # Theme configuration
│   ├── App.js                   # Main application component
│   └── index.js                 # Entry point
├── .env.local                   # Environment variables
├── package.json
└── README.md                    # This file
```

## Usage

- **Encryption**:  
  Navigate to the encryption tool. Enter your message, select the appropriate data type (String or JSON), and click **Encrypt**. A fresh random key will be generated and embedded within the ciphertext.

- **Decryption**:  
  Navigate to the decryption tool. Paste the ciphertext and click **Decrypt** to recover the original message.

## Contributing

Contributions are welcome! Feel free to fork this repository and submit a pull request with any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Built with [React](https://reactjs.org/) and [Material UI](https://mui.com/).
- Inspired by modern cryptography practices and interactive documentation principles.
