# substrate-ledger-ed25519

Extract Substrate and Polkadot-compatible ed25519 private keys from a known Ledger mnemonic. This allows you to recover the private key that is normally locked in the Ledger hardware.


## Installation

- Clone the repo via `git clone https://github.com/jacogr/substrate-ledger-ed25519.git`
- Change into the folder `cd substrate-ledger-ed25519`
- Install the dependencies via `npm install` (or `yarn`)


## Usage

`npm start <polkadot|kusma> <mnemonic> <account> <address>`

Where the 4 arguments are:

- app type - Either `polkadot` or `kusama`, e.g. `kusama`
- mnemonic - The full quoted 24-word/25-word mnemonic (enclose it with " at the start and end), e.g. `"abandon ... about"`
- account - The index of the account you are using, e.g `0`
- address - The index of the address you are using, e.g. `0`

Mac OS / Linux:

- `history -c` once completed to delete terminal history

Example:

  `npm start kusama "abandon ... about" 0 0`

Full example (known seed):

```
npm start "kusama" "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about" 0 0

	 ed25519 seed	 0x98cb4e14e0e08ea876f88d728545ea7572dc07dbbe69f1731c418fb827e69d41

	address (DOT)	 15F8gp3or2mLW8yiJAZ9C3ZFpvEA8SPJDq4RXVpVjcXtdxJq
	address (KSM)	 GpTCo8cccWnpFne7EKBwr677tWkEoeLbiAgks76fKisCUWP
```
