import React, {Component} from "react";
import {Button, View,Image,Picker,Text,TextInput} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Utils from '../../utils';


//import { TextInput } from "react-native-gesture-handler";
//
export default class FloorplanUp extends Component {
  state = {
    image: null,
    image_hash:null,
    advance_setting:1,
    ipfs_add:"192.168.0.183:5001"
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
    return (
      <View>
        <Picker
        selectedValue={this.state.advance_setting}
        style={{height: 50, width: 100}}
        onValueChange={(itemValue, itemIndex) =>
          this.setState({advance_setting: itemValue})
        }>
        <Picker.Item label="Basic" value={1} />
        <Picker.Item label="Advance" value={2} />
      </Picker>
      {this.state.advance_setting == 2 && 
      <View><Text>Ipfs Address</Text><TextInput defaultValue={this.state.ipfs_add.toString()} onChangeText={(ipfs_add) => this.setState({ipfs_add})}/></View>
       }
      <Button
          title="Select Floormap"
          onPress={__this._pickImage.bind(__this)}
        />
        { image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
        {image && <Button title="Proceed" onPress={()=>__this.props.navigation.navigate('FloorplanEditor', {
              width: 200,
              height:200,
              //image: "http://"+ipfs_add.split(":")[0]+":8080/ipfs/"+__this.state.image_hash
              image: this.state.image
            })}/>}
        </View>
    )
  }
}