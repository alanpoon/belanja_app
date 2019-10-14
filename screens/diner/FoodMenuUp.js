import React, {Component} from "react";
import styled from "styled-components";
import {Button, View,Image,Picker,Text,TextInput} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Utils from '../../utils';
import ItemCard from '../ItemCard';

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
export default class FloorplanUp extends Component {
  state = {
    
  };
  _pickImage(){
    const __this =this;
    Utils._pickImage(this.state.ipfs_add).then(function(value){
      console.log("hash",value);
      __this.setState({image:value.uri,image_hash:value.hash});
    })
  }
  _saveImage(){

  }
  render(){
    let { image,ipfs_add } = this.state;
    const __this = this;
    const items = [];
    const count = itemsCount.toNumber();
    let diner_url = this.getParameterByName('diner');
    diner_url = (diner_url=="")?"0":diner_url;
    for (let i = 0; i < count; ++i) {
      if (diner == parseInt(diner_url)){
        items.push(
          <ItemCard
            key={i}
            itemId={i}
            payingAsset={asset}
            payingPrice={price}
            accountId={accountId}
          />
        );
      }
    }
    return (
      <View>
        items
      </View>
    )
  }
}