import React, {Component} from "react";
import {Button, View,Image,Picker,Text,TextInput} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Utils from '../../utils';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button'
import attestation from "../../cennzapp/utils/attestation";
import {issuer} from "../../cennzapp/utils/cennnznet";
//import { TextInput } from "react-native-gesture-handler";
//
import { u8aToHex, stringToU8a,hexToU8a, isHex,u8aToString } from '@cennznet/util';
const stringToHex = str => u8aToHex(stringToU8a(str));
const hexToString = str =>u8aToString(hexToU8a(str.toHex())).substr(1);
export default class FloorplanUp extends Component {
  state = {
    image: null,
    image_hash:null,
    advance_setting:1,
    ipfs_add:"127.0.0.1:5001",
    description:null,
    floormapIds_arr:[],
    floormap_images:[],
    floormap_items:[],
    selected_floormap:null
  };
  _pickImage(){
    const __this =this;
    Utils._pickImage(this.state.ipfs_add).then(function(value){
      console.log("hash",value);
      __this.setState({image:value.uri,image_hash:value.hash});
    })
  }

  onSelect(index, value){
    this.setState({
      selected_floormap: value
    })
  }
  _saveImage(){

  }
  componentDidMount(){
    const __this= this;
    attestation.query("ownerFloormapIds",[issuer.address]).then(function(values){
      console.log("values",values)
      var floorItems =values.map(function(v){
        var id = v.toNumber();
        return ["floorplans",id];
      })
      attestation.queryMulti(floorItems).then(function(b_values){
        console.log("b_values",b_values)
        var floormap_items =[];
        var floormap_promise =[];
        b_values.forEach(function(k){
          let j = k.unwrap();
          let m ={
            image:hexToString(j.image),
            ipfs:hexToString(j.ipfs),
            desc:hexToString(j.desc)
          };
          floormap_promise.push(Utils._getImage(m.ipfs,m.image));
          floormap_items.push(m);
        })
        Promise.all(floormap_promise).then(function(values){
          __this.setState({floormap_items:floormap_items,floormap_images:values,floormap_ids:floorItems})
        })
      })
    })

  }
  render(){
    let { image,ipfs_add,floormap_items,floormap_images,floormap_ids } = this.state;
    const __this = this;
    const floormap_selection=[];
    for (var i=0;i<floormap_images.length;i++){
      <RadioButton value={floormap_ids[i][1]} >
          <Text>{floormap_items[i].desc}</Text>
          <Image
            style={{width:100, height: 100}}
            source={{uri:floormap_images[i]}}
          />
        </RadioButton>
    }
    return (
      <View>
        <RadioGroup
        onSelect = {(index, value) => this.onSelect(index, value)}
      >
        {floormap_selection}
      </RadioGroup>
        <Picker
        selectedValue={this.state.advance_setting}
        style={{height: 50, width: 100}}
        onValueChange={(itemValue, itemIndex) =>
          this.setState({advance_setting: itemValue})
        }>
        <Picker.Item label="Basic" value={1} />
        <Picker.Item label="Advance" value={2} />
      </Picker>
      <Text>Description of the image</Text><TextInput defaultValue="Location A" onChangeText={(description)=>this.setState({description})}/>
      {this.state.advance_setting == 2 && 
      <View><Text>Ipfs Address</Text><TextInput defaultValue={this.state.ipfs_add.toString()} onChangeText={(ipfs_add) => this.setState({ipfs_add})}/></View>
       }
      <Button
          title="Select Floormap"
          onPress={__this._pickImage.bind(__this)}
        />
        { image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
        {image && <Button title="Proceed" onPress={()=>__this.props.navigation.navigate('FloorplanEditor', {
              ipfs: this.state.ipfs_add,
              description:this.state.description,
              //image: "http://"+ipfs_add.split(":")[0]+":8080/ipfs/"+__this.state.image_hash
              image_hash: this.state.image_hash
            })}/>}
        </View>
    )
  }
}