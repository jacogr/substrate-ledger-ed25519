# sample-ledger-ed25519

A sample to extract a Ledger-compatible ed25519 private key using a known mnemonic.


## Installation

- Clone the repo via `git clone https://github.com/jacogr/sample-ledger-ed25519.git`
- Install the dependencies via `npm install` (or `yarn`)


## Usage

`npm start <polkadot|kusma> "mnemonic seed, quoted" <account> <address>`

Where the 4 arguments are:

- app type - Either polkadot or kusama
- mnemonic - The full 24-word mnemonic (enclose it with " at the start and end)
- account - The index of the account you are using
- address - The index of the address you are using

Example:

  `npm start kusama "abandon ... about" 0 0`
