import React from 'react';
import {Button} from 'react-native';
import { formatBalance } from '@cennznet/util';
import { assetRegistry } from '@cennznet/crml-generic-asset';
import attestation from '../cennzapp/utils/attestation';
import {ItemImageWrapper,ItemDescWrapper} from './screen_styles';

export default class ItemCard extends React.Component {
  constructor(props){
    const { accountId, itemId, owner,  payingAsset, payingPrice }=props;
    this.item = attestation.getItem(itemId);
  }
  render(){
  if (itemId === undefined || !item || item.isNone) {
    return (
      <Wrapper>
        <ItemImageWrapper>Loading...</ItemImageWrapper>
      </Wrapper>
    );
  }
  const itemObj = this.item.unwrap();
  const itemImage = itemObj.image;
  const [asset, amount] = price ? price.unwrap() : [16000, 0];
  const assetObj = assetRegistry.findAssetById(+asset) || {};
  const assetName = assetObj.symbol || `Asset ${asset}`;
  const quantityValue = quantity ? quantity.toNumber() : 0;
  return (
    <Wrapper>
      <ItemImageWrapper>
        <img src={itemImage} />
      </ItemImageWrapper>
      <ItemDescWrapper>
        <label>ID: {itemId}</label>
        <label>
          Merchant:
          <AddressMini
            value={owner && owner.unwrap()}
          />
        </label>
        <label>Stock: {quantityValue}</label>
        <label>Price: {assetName} {formatBalance(amount.toString())}</label>
        <Button
          title="Buy"
          onPress={__this.purchase.bind(__this)}
        />
      </ItemDescWrapper>
    </Wrapper>
  );
  }
}