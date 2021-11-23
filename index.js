const { allNetworks } = require('@polkadot/networks');
const { assert, u8aToHex } = require('@polkadot/util');
const { encodeAddress, hdLedger } = require('@polkadot/util-crypto');

async function main () {
  const args = process.argv.slice(2);

  assert(args.length === 4, `Expected 4 arguments.

Usage:

  npm start <app-type> <mnemonic> <account> <address>

  app type - Either polkadot or kusama
  mnemonic - The full 24-word mnemonic (enclose it with " at the start and end)
   account - The index of the account you are using
   address - The index of the address you are using

Example:

  npm start kusama "abandon ... about" 0 0
`);

  const [_appType, _mnemonic, _accountIndex, _addressIndex] = args;
  const accountIndex = parseInt(_accountIndex, 10);
  const addressIndex = parseInt(_addressIndex, 10);
  const appType = _appType.toLowerCase();
  const mnemonic = _mnemonic.trim();
  const ledgerNets = allNetworks.filter(({ hasLedgerSupport }) => hasLedgerSupport);
  const network = ledgerNets.find(({ network }) => network === appType);

  assert(network && network.slip44, `Invalid app type specified, expected one of ${ledgerNets.map(({ network }) => network).join(', ')}`);
  assert(!isNaN(accountIndex) && !isNaN(addressIndex), 'Account and address indexes need to be numeric');

  const pair = hdLedger(mnemonic, `m/44'/${network.slip44}'/${accountIndex}'/0'/${addressIndex}'`);

  console.log('\t ed25519 seed\t', u8aToHex(pair.secretKey.slice(0, 32)));
  console.log();
  // console.log('      public key', u8aToHex(pair.publicKey));
  console.log('\taddress (DOT)\t', encodeAddress(pair.publicKey, 0));
  console.log('\taddress (KSM)\t', encodeAddress(pair.publicKey, 2));
  console.log();
}

main().catch((error) => {
  console.error('ERROR:', error.message);

  process.exit(0);
});
