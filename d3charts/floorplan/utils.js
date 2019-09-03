import * as ImagePicker from 'expo-image-picker';
import IPFS from 'ipfs-mini';
import {AsyncStorage} from 'react-native';

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
  /*return await ipfs.add(result.uri,(err, res) => {
  if (err) { throw err }
  console.log(res);
  if (!res.cancelled) {
     return result.uri;
  }
  });*/
  try {
    const l = await ipfs.add(result.uri);
    console.log("l",l);
    return {uri:result.uri,hash:l};
  } catch (e){
    return "error"
  }
};
export {
  _retrieveData,
  _pickImage
}