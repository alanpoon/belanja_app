/**
 * Copyright 2019 Centrality Investments Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Wallet, SimpleKeyring } from '@cennznet/wallet';
import { hexToU8a, u8aToHex,stringToU8a } from '@cennznet/util';
import { WsProvider } from '@cennznet/api/polkadot';
import { Api } from '@cennznet/api';
//import { waitReady } from '@plugnet/wasm-crypto';
import network from './network';
const stringToHex = str => u8aToHex(stringToU8a(str));
const issuer2 = {
  address: '5C8JSNofegsFjwYHnrG7XtG1hCJ2PEtvQQFPkfeo75aLv6uB',
  seed: '0x6dfc73017eece8dbbf89736abdcefa5dcf9536a3c06da21031108f68f57382f7',
  phrase:"666"
};
const issuer3 = {
  address: '5F4n1HgB8Y78fm3JvHr78woh1fzk9Ctb7BRGxtT6LzkVbego',
  //seed: stringToU8a(('0x5d793af8ed7c36c54f101aa0fe405ef49495d9fb0f44151b15b77f01822d1ec8').padEnd(32, ' '))
  seed: "0x5d793af8ed7c36c54f101aa0fe405ef49495d9fb0f44151b15b77f01822d1ec8",
  phrase:"test"
};

const issuer = {
  address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
  //address:"5DfhGyQdFobKM8NsWvEeAKk5EQQgYe9AydgJ7rMB6E1EqRzV",
  seed: "//Alice",
  phrase:"password"
};
//Alice
let attestationApi = null;

const generateWallet = async () => {
  //await waitReady();
  const simpleKeyring = new SimpleKeyring();
  //simpleKeyring.addFromSeed(issuer.seed);
  //simpleKeyring.addFromSeed(hexToU8a(issuer.seed));
  simpleKeyring.addFromUri(issuer.seed,{},"sr25519")
  const wallet = new Wallet();

  await wallet.createNewVault(issuer.phrase);
  await wallet.addKeyring(simpleKeyring);
  return wallet;
};
const CustomTypes = {
  'ItemId': 'u64',
  'AssetId': 'u32',
  'AssetIdOf': 'u32',
  'Price': '(AssetId, Balance)',
  'PriceOf': '(AssetId, Balance)',
  'Claim':{
    'desc':'Vec<u8>',
    'desc1':'Vec<u8>'
  },
  'Floorplan':{
    'cubes':'Vec<(usize,i16,i16,i16)>',
    'description':'Vec<u8>',
    'image':'Vec<u8>',
    'ipfs':'Vec<u8>'
  },
  'Item':{
    'desc':'Vec<u8>',
    'image':'Vec<u8>',
    'ipfs': 'Vec<u8>'

  }
};
const createApi = async () => {
  if (attestationApi) return attestationApi;

  const provider = new WsProvider(network.url);
  const api = await Api.create({ provider,types: CustomTypes  });
  const wallet = await generateWallet();
  api.setSigner(wallet);

  return api;
};
const createApiRoot = async () => {
  if (attestationApi) return attestationApi;

  const provider = new WsProvider(network.url);
  const api = await Api.create({ provider,types: CustomTypes  });
  return api;
};
const signAndSend = async (claim) => (
  new Promise(resolve => {
    claim.signAndSend(issuer.address, async ({ events, status }) => {
      console.log("%%%%%%%%%%%%%%%%%5");
      if (status.isFinalized && events !== undefined) {
        const txHash = u8aToHex(status.asFinalized);
        console.log('@====blockHash===@:', txHash);
        resolve(txHash);
      }
    });
  })
);
const send = async (claim) => (
  new Promise(resolve => {
    claim.send( async ({ events, status }) => {
      console.log("%%%%%%%%%%%%%%%%%5");
      if (status.isFinalized && events !== undefined) {
        const txHash = u8aToHex(status.asFinalized);
        console.log('@====blockHash===@:', txHash);
        resolve(txHash);
      }
    });
  })
);
export {
  createApi,
  createApiRoot,
  issuer,
  signAndSend,
  send
};
