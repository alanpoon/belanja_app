import React, {Component} from "react";
import {Button, View,Image,Picker,Text,TextInput,ScrollView} from 'react-native';
import * as Utils from '../utils';
import attestation from "../cennzapp/utils/attestation";
import { u8aToHex, stringToU8a,hexToU8a, isHex,u8aToString } from '@cennznet/util';
import { issuer } from "../cennzapp/utils/cennnznet";
const stringToHex = str => u8aToHex(stringToU8a(str));
const hexToString = str =>u8aToString(hexToU8a(str.toHex())).substr(1);
const default_ipfs = "127.0.0.1:5001";
import Modal from "modal-react-native-web"
export default class Profile extends Component {
  state={
    image:null,
    image_uri:null,
    profile_name:"Default_name",
    ipfs:default_ipfs,
    advance_setting:1,
    map_address:null,
    removerVisible:false,

  }
  _pickImage(){
    const __this =this;
    Utils._pickImage(this.state.ipfs).then(function(value){
      console.log("hash",value);
      __this.setState({image_uri:value.uri,image:value.hash});
    })
  }
  _saveProfile(){
    const {image,profile_name,ipfs} = this;
    const __this = this;
    attestation.tx("saveProfile",[issuer.address,profile_name,image,ipfs]).then(function(){
      __this.refresh();
    })
  }
  _removeProfile(){
    this.setState({removerVisible:true})
  }
  _deleteProfile(){
    attestation.tx("removeProfile",[issuer.address]).then(function(){
      __this.refresh();
    })
  }
  refresh(){
    const __this =this;
    attestation.query("profiles",[issuer.address]).then(function(value){
      if (value.isSome ==true){
        let j = value.unwrap();
        Utils._getImage(j.ipfs,j.image).then(function(image_uri){
          __this.setState({image_uri,profile_name:hexToString(j.profile_name),image:null,ipfs:hexToString(j.ipfs),removerVisible:false})
        })
      }else{
        __this.setState({image_uri:null,profile_name:null,image:null,ipfs:default_ipfs,removerVisible:false})
      }
    })
  }
  componentDidMount(){
    this.refresh();
  }
  render(){
    const {image_uri,profile_name}  =this.state;
    const __this = this;
    return(<View>
      <Picker
        selectedValue={this.state.advance_setting}
        style={{height: 50, width: 100}}
        onValueChange={(itemValue, itemIndex) =>
          this.setState({advance_setting: itemValue})
        }>
        <Picker.Item label="Basic" value={1} />
        <Picker.Item label="Advance" value={2} />
      </Picker>
      <Text>Display name: </Text><TextInput defaultValue={profile_name} onChangeText={(profile_name)=>this.setState({profile_name})}/>
      {this.state.advance_setting == 2 && 
        <View><Text>Ipfs Address</Text><TextInput defaultValue={this.state.ipfs.toString()} onChangeText={(ipfs) => this.setState({ipfs})}/></View>
        }
        <table>
          <tbody>
            <tr><td>Profile image</td>
              <td>{ image_uri!=null?<Image source={{ uri: image_uri }} style={{ width: 200, height: 200 }} />:<Button title="Add Image" onPress={()=>this._pickImage()}/>}</td>
            <td><Button title="Edit Image" onPress={()=>__this._pickImage()}/></td></tr>
          </tbody>
        </table>
        <Button title="Save profile" onPress={()=>{__this._saveProfile()}}/>
        <Button title="Remove profile" onPress={()=>{__this._removeProfile()}}/>
        <Modal visible={this.state.removerVisible} key="remover" ariaHideApp={false}>
          <Text>Are you sure that you want to delete this profile?</Text>
          <Button title="Delete" onPress={()=>{__this._deleteProfile()}}/>
        </Modal>
    </View>)
  }

}