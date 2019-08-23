import attestation from './utils/attestation';
import { issuer } from './utils/cennnznet';
import { topicTypes } from './utils/types';
export default function jj(){
  console.log(attestation.getItems(
    issuer.address, 
    [issuer.address],
    []
  ));
}
