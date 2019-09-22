import attestation from './utils/attestation';
import { issuer } from './utils/cennnznet';

export default function jj(){
  attestation.getItems(issuer.address,
    0
  ).then((z) => console.log("z",z.unwrap().toNumber()));
}
