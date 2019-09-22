import * as ImagePicker from 'expo-image-picker';
import IPFS from 'ipfs-mini';
import {AsyncStorage} from 'react-native';
//import * as ipfsClient from 'ipfs-http-client';

async function _retrieveData(key,cannotfind) {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      // We have data!!
      return value;
    }else{
      return cannotfind;
    }
  } catch (error) {
    return cannotfind;
  }
};

async function _pickImage(ipfs_add){
  let result = await ImagePicker.launchImageLibraryAsync({
  allowsEditing: true,
  aspect: [4, 3],
  });
  var ipfs = new IPFS({host:ipfs_add.split(":")[0],port: ipfs_add.split(":")[1], protocol: 'http'} ) // leaving out the arguments will default to these values
  
  try {
    const l = await ipfs.add(Buffer.from(result.uri, 'base64'));
    console.log("l",l);
    return {uri:result.uri,hash:l};
  } catch (e){
    return "error"
  }
};

function string_to_u8(str){
  const textEncoder = new TextEncoder();
  return textEncoder.encode(str);
}
function u8_to_string(v){
  const textDecoder = new TextDecoder();
  return textDecoder.decode(v);
}
/*
async function _pickImage(ipfs_add){
  let result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    aspect: [4, 3],
    });
    var ipfs = ipfsClient(ipfs_add.split(":")[0],ipfs_add.split(":")[1],{ protocol: 'http'} ) // leaving out the arguments will default to these values
    
    const data = {
      path:"test.png",
      //file:ipfsClient.Buffer.from(result.uri)
      file: new Buffer(result.uri)
    }
    console.log("result",data.file)
    try {
      const l = await ipfs.add(data.file);
      //, { recursive: true , ignore: ['subfolder/to/ignore/**']}
      console.log("l",l[0].hash);
      
      return {uri:result.uri,hash:l[0].hash};
    } catch (e){
      return "error"
    }
}*/
export {
  _retrieveData,
  _pickImage,
  string_to_u8,
  u8_to_string
}