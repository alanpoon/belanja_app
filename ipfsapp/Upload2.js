import React, {PureComponent, Fragment} from "react";
import {Button, View,Image} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import IPFS from 'ipfs-mini';
type Props={

}
export default class Upload extends PureComponent <Props>{
  state = {
    image: null,
  };
  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });
    //var ipfs = ipfsClient('0.0.0.0', '5001', { protocol: 'http' }) // leaving out the arguments will default to these values
    var ipfs = new IPFS({host:'192.168.1.194',port: '5001', protocol: 'http'} ) // leaving out the arguments will default to these values
    console.log("result",result);
    ipfs.add(result.uri,(err, res) => {
      if (err) { throw err }
      console.log(res);
      if (!res.cancelled) {
        this.setState({ image: result.uri });
      }
    })
    
  };
  render(){
    let { image } = this.state;
    return (
      <View>
      <Button
          title="Select Floormap"
          onPress={this._pickImage}
        />
        { image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
        </View>
    )
  }
}