import React, {Component,styled} from "react";
import {Button, View,Image,Picker,Text,TextInput} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Utils from '../../utils';
import ItemCard from '../ItemCard';
import attestation from "../../cennzapp/utils/attestation";
import BN from 'bn.js';
//import { TextInput } from "react-native-gesture-handler";
//
const ActionWrapper = styled.div`
  margin-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e4e4e4;
  h2 {
    display: inline-block;
  }
`;
const assets = [
  {
    text: '16000: CENNZ-T',
    value: 16000
  },
  {
    text: '16001: CENTRAPAY-T',
    value: 16001
  }
];
class ItemIDLabel extends Component{
  render(){
    const { itemId } = this.props;
    return attestation.getItems(itemId)
  }
}
export default class FloorMenuUp extends Component {
  state = {
    item: items[0].value,
    quantity: new BN(1),
    asset: assets[0].value,
    price: new BN(0),
    updatePrice: new BN(0),
    itemId: 0,
    image: "",
    ipfs: ""
  };
  onItemChange = (item) => {
    this.setState({ item });
  }

  onQuantityChange = (quantity) => {
    this.setState({ quantity: quantity || new BN(1) });
  }

  onAssetChange = (asset) => {
    this.setState({ asset });
  }

  onPriceChange = (price) => {
    this.setState({ price: price || new BN(0) });
  }

  onUpdatePriceChange = (price) => {
    this.setState({ updatePrice: price || new BN(0) });
  }

  onItemIdChange = (itemId) => {
    this.setState({ itemId });
  }
  _pickImage(){
    const __this =this;
    Utils._pickImage(this.state.ipfs_add).then(function(value){
      console.log("hash",value);
      __this.setState({image:value.uri,image_hash:value.hash});
    })
  }
  createItem(){
    const {item, price,ipfs,image} = this.state;
    attestation.createItem(item,price,ipfs,image); //return itemId
  }
  addItem(){
    const {itemId,floormapitemid} =this.state;
    attestation.addItem(itemId,floormapitemid);
  }
  removeItem(){
    const {itemId,floormapitemid} = this.state;
    attestation.removeItem(itemId,floormapitemid);
  }
  updateItem(){
    const {itemId,price,ipfs,image} = this.state;
    attestation.updateItem(itemId,price,ipfs,image);
  }
  _saveImage(){

  }
  render(){
    const { accountId, itemsCount } = this.props;
    const { item, quantity, asset, price, updatePrice, itemId,accountId } = this.state;
    const itemIds = []; const floormapitemIds =[];
    const items = attestation.items(accountId);
    const floormapItems = attestation.floormaps(accountId);
    const itemPickerItems =[];
    for (let i = 0; i < items.length; ++i) {
      const itemLabel = <ItemIDLabel key={i} itemId={items[i]}/>
      itemIds.push({
        text: itemLabel,
        value: i
      });
      itemPickerItems.push(
        <Picker.Item label={itemLabel} value={i}/>
      )
    }
    for (let i =0; i<floormapItems.length; ++i){
      itemPickerItems.push()
    }
    const __this = this;
    return (
      <section>
        <ActionWrapper>
          <summary>
            <h2>Create Item</h2>
          </summary>
          <div className='ui--row'>
            Description
            <TextInput  onChangeText={this.onDescriptionChange}/>
          </div>
          <div className='ui--row'>
            Price
            <TextInput
              onChangeText={this.onPriceChange}
            />
          </div>
          <div className='ui--row'>
            { image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
          </div>
          <div className='ui--row'>
          <Button
            title="Select Image"
            onPress={__this._pickImage.bind(__this)}
          />
          </div>
          <div className='large'>
            <Button
              label='Create Item'
              onPress={() => __this.createItem()}
            />
          </div>
        </ActionWrapper>
        <ActionWrapper>
          <summary>
            <h2>Add Item to Floormap</h2>
          </summary>
          <div className='ui--row'>
            Item:
            <Picker
              selectedValue={itemId}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({itemId: itemValue})
              }>
              {itemPickerItems}
            </Picker>
          </div>
          <div className='ui--row'>
            Floormap:
            <Picker
              selectedValue={floormapitemId}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({floormapitemId: itemValue})
              }>
              {floormapPickerItems}
            </Picker>
          </div>
          <div className='large'>
            <Button
              label='Add Item'
              onPress={() => __this.addItem()}
            />
          </div>
        </ActionWrapper>
        <ActionWrapper>
          <summary>
            <h2>Remove Item</h2>
          </summary>
          <div className='ui--row'>
            <Dropdown
              value={itemId}
              label='Item ID'
              options={itemIds}
              onChange={this.onItemIdChange}
            />
            <TextInput
              value={quantity}
              label='Remove Quantity'
              onChange={this.onQuantityChange}
              
            />
          </div>
          <div className='large'>
              <Button
                label='Add Item'
                onPress={() => __this.removeItem()}
              />
          </div>
        </ActionWrapper>
        <ActionWrapper>
          <summary>
            <h2>Update Item</h2>
          </summary>
          <div className='ui--row'>
            <Dropdown
              value={itemId}
              label='Item ID'
              options={itemIds}
              onChange={this.onItemIdChange}
            />
            <TextInput
              value={quantity}
              label='Quantity'
              onChange={this.onQuantityChange}
            />
          </div>
          <div className='ui--row'>
            <Dropdown
              value={asset}
              label='Asset'
              options={assets}
              onChange={this.onAssetChange}
            />
            <TextInput
              label='Price'
              onChange={this.onUpdatePriceChange}
            />
          </div>
          <div className='large'>
              <Button
                label='Update Item'
                onPress={() => __this.updateItem()}
              />
          </div>
        </ActionWrapper>
      </section>
    )
  }
}