import attestation from './utils/attestation';
import { issuer } from './utils/cennnznet';
import { topicTypes } from './utils/types';
export default function jj(){
  const { claims, selectedClaim } = issuer;
      const { holder, topic } = selectedClaim;
  console.log(attestation.getClaims(
    holder, 
    [issuer.address],
    []
  ));
}
