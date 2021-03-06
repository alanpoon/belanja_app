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

import { u8aToHex, stringToU8a,hexToU8a, isHex,u8aToString } from '@cennznet/util';
import { createApi,createApiRoot, signAndSend,send } from './cennnznet';
import { Attestation } from '@cennznet/crml-attestation';
const stringToHex = str => u8aToHex(stringToU8a(str));

const createAttestationApi =  async () => {
  console.log("before wallet")
  const api = await createApi();
  console.log("after wallet")
  return api.tx.xpay;
};
const createAttestationApiRoot =  async () => {
  console.log("before wallet")
  const api = await createApiRoot();
  console.log("after wallet")
  return api.tx.xpay;
};
const attestation = {  
  removeClaim: async (holder, topic) => {
    const api = await createAttestationApi();
    const claim = await api.removeClaim(
      holder,
      stringToHex(topic)
    );

    const txHash = await signAndSend(claim);
    return txHash;
  },
  /*
  getClaims: async (holder, issuers, topics) => {
    const api = await createApi();
    const attestationApi = await Attestation.create(api);
    const claims = await attestationApi.getClaims(holder, issuers, topics);
    
    return claims;
  },*/
  getItems: async (holder,topics) => {
    const api = await createApi();
    const attestationApi = await Attestation.create(api);
    const claims = attestationApi.api.query.xPay.items(0);
    return claims;
  },
  addFloorplan: async(acc_to_edit,image,description,ipfs,floorplan)=>{
    const api = await createAttestationApi();
    var claimz = await api.addFloorplan(
      acc_to_edit,stringToHex(image),stringToHex(description),stringToHex(ipfs),floorplan
    );
    const txHash = await signAndSend(claimz);
    return txHash;
  },
  changeFloorplan: async(signer,acc_to_edit,item_id,image,description,ipfs,floorplan)=>{
    const api = await createApi();
    const attestationApi = await Attestation.create(api);
    attestationApi.api.tx.xpay.changeFloorplan(signer,acc_to_edit,item_id,image,description,ipfs,floorplan);
  },
  removeFloorplan: async(signer,acc_to_edit,item_id)=>{
    const api = await createApi();
    const attestationApi = await Attestation.create(api);
    attestationApi.api.tx.xpay.removeFloorplan(signer,acc_to_edit,item_id);
  },
  getFloorplan: async(item_id)=>{
    const api = await createApi();
    const attestationApi = await Attestation.create(api);
    return attestationApi.api.query.xPay.floorplans(item_id);
  },
  addClaims: async(claim)=>{
    const api = await createAttestationApi();
    var claimz = await api.addClaims(
      //new H256(toHash(claim))
      2
    );
    //const txHash = await signAndSend(claimz);
    const txHash = await signAndSend(claimz);
    return txHash;

  },
  addMsg: async(claim,claim2)=>{
    const api = await createAttestationApi();
    var claimz = await api.addMsg(
      stringToHex(claim),
      stringToHex(claim2)
    );
    console.log("stringToHex",stringToHex(claim))
    const txHash = await signAndSend(claimz);
    return txHash;

  },
  getClaims: async(item_id)=>{
    const api = await createApi();
    const attestationApi = await Attestation.create(api);
    return attestationApi.api.query.xPay.msgs(item_id);
  },
  query: async(z,x)=>{
    const api = await createApi();
    const attestationApi = await Attestation.create(api);
    console.log("attestationApi",attestationApi.api.query.xPay);
    return attestationApi.api.query.xPay[z](...x);
  },
  queryMulti: async(z)=>{
    const api = await createApi();
    const attestationApi = await Attestation.create(api);
    var j = z.map(function(n){
      n[0] = attestationApi.api.query.xPay[n[0]];
      return n;
    });
    return attestationApi.api.queryMulti(j);
  },
  tx: async(z,x)=>{
    const api = await createAttestationApi();
    var claimz = await api[z](
      ...x
    );
    signAndSend(claimz)
    console.log("after send");
  }
};

export default attestation;
