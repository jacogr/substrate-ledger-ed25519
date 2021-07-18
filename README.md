# sample-ledger-ed25519

A sample to extract a Ledger-compatible ed25519 private key using a known mnemonic.


## Installation

- Clone the repo via `git clone https://github.com/jacogr/sample-ledger-ed25519.git`
- Change into the folder `cd sample-ledger-ed25519`
- Install the dependencies via `npm install` (or `yarn`)


## Usage

`npm start <polkadot|kusma> <mnemonic> <account> <address>`

Where the 4 arguments are:

- app type - Either `polkadot` or `kusama`, e.g. `kusama`
- mnemonic - The full quoted 24-word mnemonic (enclose it with " at the start and end), e.g. `"abandon ... about"`
- account - The index of the account you are using, e.g `0`
- address - The index of the address you are using, e.g. `0`

Mac OS / Linux:

- `history -c` once completed to delete terminal history

Example:

  `npm start kusama "abandon ... about" 0 0`
