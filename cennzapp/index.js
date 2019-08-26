import attestation from './utils/attestation';
import { issuer } from './utils/cennnznet';
import { topicTypes } from './utils/types';
export default function jj(){
  attestation.getItems(issuer.address,
    0
  ).then((z) => console.log(z.unwrap().toNumber()));
}
