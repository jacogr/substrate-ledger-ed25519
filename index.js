const BN = require('bn.js');
const bip39 = require('bip39');
const hash = require('hash.js');
const { assert, u8aToHex } = require('@polkadot/util');
const { encodeAddress, mnemonicValidate, naclKeypairFromSeed } = require('@polkadot/util-crypto');

// create a derivation path
function getPath (chain, account, address) {
  return `m/44'/${chain.toLowerCase() === 'polkadot' ? 0x0162 : 0x01b2}'/${account}'/0'/${address}'`;
}

// performs hard-only derivation on the xprv
function derivePrivate (xprv, index) {
  const kl = xprv.slice(0, 32);
  const kr = xprv.slice(32, 64);
  const cc = xprv.slice(64, 96);

  const data = Buffer.allocUnsafe(1 + 64 + 4);

  data.writeUInt32LE(index, 1 + 64);
  kl.copy(data, 1);
  kr.copy(data, 1 + 32);

  data[0] = 0x00;

  const z = hash.hmac(hash.sha512, cc).update(data).digest();

  data[0] = 0x01;

  const i = hash.hmac(hash.sha512, cc).update(data).digest();
  const chainCode = i.slice(32, 64);
  const zl = z.slice(0, 32);
  const zr = z.slice(32, 64);
  const left = new BN(kl, 16, 'le').add(new BN(zl.slice(0, 28), 16, 'le').mul(new BN(8))).toArrayLike(Buffer, 'le', 32);
  let right = new BN(kr, 16, 'le').add(new BN(zr, 16, 'le')).toArrayLike(Buffer, 'le').slice(0, 32);

  if (right.length !== 32) {
    right = Buffer.from(right.toString('hex') + '00', 'hex');
  }

  return Buffer.from([...left, ...right, ...chainCode]);
}

// gets an xprv from a mnemonic
function getLedgerMasterKey (mnemonic) {
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const chainCode = hash.hmac(hash.sha256, 'ed25519 seed').update(new Uint8Array([1, ...seed])).digest();
  let priv;

  while (!priv || (priv[31] & 0b0010_0000)) {
    priv = hash.hmac(hash.sha512, 'ed25519 seed').update(priv || seed).digest();
  }

  priv[0]  &= 0b1111_1000;
  priv[31] &= 0b0111_1111;
  priv[31] |= 0b0100_0000;

  return Buffer.from([...priv, ...chainCode]);
}

async function main () {
  const args = process.argv.slice(2);

  assert(args.length === 4, `Expected 4 arguments:

  app type - Either polkadot or kusama
  mnemonic - The full 24-word mnemonic (enclose it with " at the start and end)
   account - The index of the account you are using
   address - The index of the address you are using

Example:

  npm start kusama "abandon ... about" 0 0
`);

  const [appType, _mnemonic, _accountIndex, _addressIndex] = args;
  const accountIndex = parseInt(_accountIndex, 10);
  const addressIndex = parseInt(_addressIndex, 10);
  const mnemonic = _mnemonic.trim();

  assert(['polkadot', 'kusama'].includes(appType.toLowerCase()), `Invalid app type specified, expected one of polkadot or kusama`);
  assert(mnemonicValidate(mnemonic), 'Invalid mnemonic specified');
  assert(!isNaN(accountIndex) && !isNaN(addressIndex), 'Account and address indexes need to be numberic');

  // Just a test to see if we align with the known seed (useful for adjustments here)
  // console.log('   algo valid', getLedgerMasterKey('abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about').toString('hex') === '402b03cd9c8bed9ba9f9bd6cd9c315ce9fcc59c7c25d37c85a36096617e69d418e35cb4a3b737afd007f0688618f21a8831643c0e6c77fc33c06026d2a0fc93832596435e70647d7d98ef102a32ea40319ca8fb6c851d7346d3bd8f9d1492658', '\n');

  const pair = naclKeypairFromSeed(
    getPath(appType, accountIndex, addressIndex)
      .split('/')
      .slice(1)
      .reduce((x, n) => derivePrivate(x, parseInt(n.replace("'", ''), 10) + 0x80000000), getLedgerMasterKey(mnemonic))
      .slice(0, 32)
  );

  console.log('    private seed', u8aToHex(pair.secretKey.slice(0, 32)));
  console.log();
  // console.log('      public key', u8aToHex(pair.publicKey));
  console.log('   address (DOT)', encodeAddress(pair.publicKey, 0));
  console.log('   address (KSM)', encodeAddress(pair.publicKey, 2));
  console.log();
}

main().catch((error) => {
  console.error('ERROR:', error.message);

  process.exit(0);
});
