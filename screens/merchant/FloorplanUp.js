import React, {Component} from "react";
import {Button, View,Image,Picker,Text,TextInput,ScrollView} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
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
const default_ipfs = "127.0.0.1:5001";
export default class FloorplanUp extends Component {
  state = {
    image: null,
    advance_setting:1,
    ipfs:default_ipfs,
    desc:null,
    cubes:[],
    floormap_items:[],
    editorVisible:false,
    removerVisible:false,
    selected_floormap_id:null
  };

  _pickImage(){
    const __this =this;
    Utils._pickImage(this.state.ipfs).then(function(value){
      console.log("hash",value);
      __this.setState({image_uri:value.uri,image:value.hash});
    })
  }

  proceed(floormap_id){ //before putting creating floorplan
    var image,desc,ipfs,cubes,image_uri;
    for (var i=0;i<this.state.floormap_items.length;i++){
      if(this.state.floormap_items[i]['id']==floormap_id){
        image=this.state.floormap_items[i]['image'];
        desc=this.state.floormap_items[i]['desc'];
        ipfs = this.state.floormap_items[i]['ipfs'];
        cubes = this.state.floormap_items[i]['cubes'];
        image_uri = this.state.floormap_items[i]["image_uri"];
      }
    }
    this.props.navigation.navigate('FloorplanEditor', {
      cubes: cubes,
      ipfs: ipfs,
      desc:desc,
      image: image,
      image_uri: image_uri
    })
  }
  add(){
    this.setState({editorVisible:true,editorType:"add",desc:"Location A",image:null,ipfs:default_ipfs,cubes:[],image_uri:null})
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
    this.setState({removerVisible:true,desc,selected_floormap_id:floormap_id})
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

    this.setState({editorVisible:true,editorType:"edit",image,desc,ipfs,cubes,image_uri,selected_floormap_id:floormap_id})
  }

  add_floormap(){
    const signer = issuer.address;
    const {desc,image,ipfs} = this.state;
    const __this =this;
    attestation.tx("addFloorplan",[signer,[],desc,image,ipfs]).then(function(){
      __this.refresh();
    })
  }
  edit_floormap(){
    const signer = issuer.address;
    const {desc,image,ipfs,selected_floormap_id} = this.state;
    const __this =this;
    attestation.tx("changeFloorplan",[signer,selected_floormap_id,[],desc,image,ipfs]).then(function(){
      __this.refresh();
    })
  }
  remove_floormap(){
    const signer = issuer.address;
    const {selected_floormap_id} = this.state;
    const __this =this;
    attestation.tx("removeFloorplan",[signer,selected_floormap_id]).then(function(){
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
      });
      console.log("floorItems",floorItems)
      attestation.queryMulti(floorItems).then(function(b_values){
        var floormap_items =[];
        var floormap_promise =[];
        b_values.forEach(function(k,i){
          if (k.isSome ==true){
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
          } 
        })
        if (floormap_promise.length>0){
          Promise.all(floormap_promise).then(function(values){
            floormap_items.map(function(k,i){
              return k["image_uri"]=values[i];
            })
            Promise.all(floormap_promise).then(function(values){
              floormap_items.map(function(k,i){
                return k["image_uri"]=values[i];
              })
              console.log("here");
              __this.setState({floormap_items:floormap_items,editorVisible:false,removerVisible:false,editVisible:false})
            })
          })
        }else{
          console.log("here2");
          __this.setState({floormap_items:floormap_items,editorVisible:false,removerVisible:false,editVisible:false})
        }
        
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
      <Text>Address</Text>
      <GooglePlacesAutocomplete
          placeholder='Enter Location'
          minLength={2}
          autoFocus={false}
          returnKeyType={'default'}
          fetchDetails={true}
          styles={{
            textInputContainer: {
              backgroundColor: 'rgba(0,0,0,0)',
              borderTopWidth: 0,
              borderBottomWidth:0
            },
            textInput: {
              marginLeft: 0,
              marginRight: 0,
              height: 38,
              color: '#5d5d5d',
              fontSize: 16
            },
            predefinedPlacesDescription: {
              color: '#1faadb'
            },
          }}
          currentLocation={false}
        />
        {this.state.advance_setting == 2 && 
        <View><Text>Ipfs Address</Text><TextInput defaultValue={this.state.ipfs.toString()} onChangeText={(ipfs) => this.setState({ipfs})}/></View>
        }
      <Button
        title="Select Floormap"
        onPress={__this._pickImage.bind(__this)}
      />
      { this.state.image_uri && <Image source={{ uri: this.state.image_uri }} style={{ width: 200, height: 200 }} />}
      {this.state.image_uri && this.state.editorType=="add" ? <Button title="Proceed to add" onPress={()=>__this.add_floormap()}/>:null}
      {this.state.image_uri && this.state.editorType=="edit" ? <Button title="Proceed to edit" onPress={()=>__this.edit_floormap()}/>:null}
      <Button title="close" onPress={()=>__this.setState({editorVisible:false,desc:null,cubes:[],image_uri:null})} />
    </View>)
  }
  floormap_remover(){
    const __this =this;
    var image_uri,desc;
    for (var i=0;i<this.state.floormap_items.length;i++){
      if (this.state.floormap_items[i].id==this.state.selected_floormap_id){
        image_uri = this.state.floormap_items[i]["image_uri"];
        desc= this.state.floormap_items[i]["desc"];
      }
    }
    return (<View style={{ flex: 1 }}>
      <Text>Are you sure you want to remove {this.state.selected_floormap_id}?</Text>
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
      <ScrollView vertical={true}>
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
        </ScrollView>
    )
  }
}