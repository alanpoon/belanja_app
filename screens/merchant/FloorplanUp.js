import React, {Component} from "react";
import {Button, View,Image,Picker,Text,TextInput,TouchableHighlight} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Utils from '../../utils';
import attestation from "../../cennzapp/utils/attestation";
import {issuer} from "../../cennzapp/utils/cennnznet";
import Modal from "modal-react-native-web"
//import { TextInput } from "react-native-gesture-handler";
//
import { u8aToHex, stringToU8a,hexToU8a, isHex,u8aToString } from '@cennznet/util';
const stringToHex = str => u8aToHex(stringToU8a(str));
const hexToString = str =>u8aToString(hexToU8a(str.toHex())).substr(1);
export default class FloorplanUp extends Component {
  state = {
    image: null,
    advance_setting:1,
    ipfs_add:"127.0.0.1:5001",
    desc:null,
    cubes:[],
    floormap_items:[],
    editorVisible:false,
    removerVisible:false
  };

  _pickImage(){
    const __this =this;
    Utils._pickImage(this.state.ipfs_add).then(function(value){
      console.log("hash",value);
      __this.setState({image:value.uri,image:value.hash});
    })
  }

  proceed(){ //before putting creating floorplan
    this.props.navigation.navigate('FloorplanEditor', {
      cubes: this.state.cubes,
      ipfs: this.state.ipfs_add,
      desc:this.state.desc,
      image: this.state.image,
      image_uri: this.state.image_uri
    })
  }
  add(){
    this.setState({editorVisible:true,editorType:"add",desc:"Location A",image:null,ipfs:null,cubes:[]})
  }
  remove(floormap_id){
    console.log("floormap_id_arr",this.state.floormapIds_arr,"floormap_id",floormap_id)
    var desc;
    for (var i=0;i<this.state.floormap_items.length;i++){
      if(this.state.floormap_items['id']==floormap_id){
        desc = this.state.floormap_items["desc"];
      }
    }
    console.log("desc",desc);
    this.setState({removerVisible:true,desc})
  }
  edit(floormap_id){
    var image,desc,ipfs,cubes,image_uri;
    for (var i=0;i<this.state.floormap_items.length;i++){
      if(this.state.floormap_items[i].id==floormap_id){
        image=this.state.floormap_items[i]['image'];
        desc=this.state.floormap_items[i]['desc'];
        ipfs = this.state.floormap_items[i]['ipfs'];
        cubes = this.state.floormap_items[i]['cubes'];
        image_uri = this.state.floormap_items[i]["image_uri"];
      }
    }

    this.setState({editorVisible:true,editorType:"edit",image,desc,ipfs,cubes,image_uri})
  }

  add_floormap(){
    const signer = issuer.address;
    const {desc,image,ipfs} = this.state;
    const __this =this;
    attestation.tx("addFloorplan",[signer,[],desc,image,ipfs]).then(function(){
      __this.refresh();
    })
  }
  refresh(){
    const __this= this;
    attestation.query("ownerFloormapIds",[issuer.address]).then(function(values){
      console.log("values",values)
      var floorItems =values.map(function(v){
        var id = v.toNumber();
        return ["floorplans",id];
      })
      attestation.queryMulti(floorItems).then(function(b_values){
        var floormap_items =[];
        var floormap_promise =[];
        b_values.forEach(function(k,i){
          let j = k.unwrap();
          let m ={
            cubes:j.cubes,
            image:hexToString(j.image),
            ipfs:hexToString(j.ipfs),
            desc:hexToString(j.desc),
            id:floorItems[i][1]
          };
          floormap_promise.push(Utils._getImage(m.ipfs,m.image));
          floormap_items.push(m);
        })
        Promise.all(floormap_promise).then(function(values){
          floormap_items.map(function(k,i){
            return k["image_uri"]=values[i];
          })
          __this.setState({floormap_items:floormap_items,addVisible:false,removerVisible:false,editVisible:false})
        })
      })
    })
  }
  componentDidMount(){
    this.refresh();
  }
  floormap_editor(){
    const __this =this;
    return (<View style={{ flex: 1 }}>
      {this.state.editorType=="add" ? <Text>Add Floormap</Text>:<Text>Edit Floormap</Text>}
      <Picker
        selectedValue={this.state.advance_setting}
        style={{height: 50, width: 100}}
        onValueChange={(itemValue, itemIndex) =>
          this.setState({advance_setting: itemValue})
        }>
        <Picker.Item label="Basic" value={1} />
        <Picker.Item label="Advance" value={2} />
      </Picker>
      <Text>Description of the image</Text><TextInput defaultValue={this.state.desc} onChangeText={(desc)=>this.setState({desc})}/>
        {this.state.advance_setting == 2 && 
        <View><Text>Ipfs Address</Text><TextInput defaultValue={this.state.ipfs_add.toString()} onChangeText={(ipfs_add) => this.setState({ipfs_add})}/></View>
        }
      <Button
        title="Select Floormap"
        onPress={__this._pickImage.bind(__this)}
      />
      { this.state.image_uri && <Image source={{ uri: this.state.image_uri }} style={{ width: 200, height: 200 }} />}
      {this.state.image_uri && this.state.editorType=="add" ? <Button title="Proceed" onPress={()=>__this.add_floormap()}/>:null}
      {this.state.image_uri && this.state.editorType=="edit" ? <Button title="Proceed" onPress={()=>__this.edit_floormap()}/>:null}
      <Button title="close" onPress={()=>__this.setState({editorVisible:false,desc:null,cubes:[],image_uri:null})} />
    </View>)
  }
  floormap_remover(floormap_id){
    const __this =this;
    var image_uri,desc;
    for (var i=0;i<this.state.floormap_items.length;i++){
      if (this.state.floormap_items[i]==floormap_id){
        image_uri = this.state.floormap_items[i]["image_uri"];
        desc= this.state.floormap_items[i]["desc"];
      }
    }
    return (<View style={{ flex: 1 }}>
      <Text>Are you sure you want to remove {floormap_id}?</Text>
      <Text>Description of the image: {desc}</Text>
      { image_uri && <Image source={{ uri: image_uri }} style={{ width: 200, height: 200 }} />}
      {image_uri && <Button title="Remove" onPress={()=>__this.remove_floormap()}/>}
      <Button title="close" onPress={()=>__this.setState({removerVisible:false,desc:null,cubes:[],image_uri:null})} />
    </View>)
  }
  render(){
    let { floormap_items } = this.state;
    const __this = this;
    const floormap_selection2=[];
    console.log("floormap_items",floormap_items)
    for (let i=0;i<floormap_items.length;i++){
      floormap_selection2.push(<tr key={i}>
        <td><Text>{floormap_items[i].desc}</Text></td>
        <td><Image
            style={{width:100, height: 100}}
            source={{uri:floormap_items[i]["image_uri"]}}
          /></td>
        <td><Button title="Proceed" onPress={()=>__this.proceed(floormap_items[i].id)}/></td>
        <td><Button title="Remove" onPress={()=>__this.remove(floormap_items[i].id)}/></td>
        <td><Button title="Edit" onPress={()=>__this.edit(floormap_items[i].id)}/></td>
      </tr>)
    }
    const floormap_editor  = this.floormap_editor();
    const floormap_remover = this.floormap_remover();
    return (
      <View>
        <table>
          <tbody>
          {floormap_selection2}
          <tr><td colSpan="3"><Button title="add" onPress={()=>__this.add()}/></td></tr>
          </tbody>
        </table>
        <Modal visible={this.state.editorVisible} key="editor" ariaHideApp={false}>
          {floormap_editor}
        </Modal>
        <Modal visible={this.state.removerVisible} key="remover" ariaHideApp={false}>
          {floormap_remover}
        </Modal>
        </View>
    )
  }
}