import React, {Component} from "react";
import {Button, View,Image,Picker,Text,TextInput,ScrollView} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Utils from '../../utils';
import ItemCard from '../ItemCard';
import attestation from "../../cennzapp/utils/attestation";
import {issuer} from "../../cennzapp/utils/cennnznet";
import BN from 'bn.js';
import {ActionWrapper} from '../screen_styles';
//import { TextInput } from "react-native-gesture-handler";
//
import { u8aToHex, stringToU8a,hexToU8a, isHex,u8aToString } from '@cennznet/util';
const stringToHex = str => u8aToHex(stringToU8a(str));
const hexToString = str =>u8aToString(hexToU8a(str.toHex())).substr(1);



export default class FloorMenuUp extends Component {
  state = {
    item: null,
    itemId: 0,
    create:{
      desc:"",
      floormapId:0,
      image:"",
      ipfs:"",
      price:new BN(0)
    },
    add:{
      itemId:0,
      floormapId:0
    },
    remove:{
      itemId:0,
      floormapId:0,
    },
    update:{
      itemId:0,
      desc:"",
      floormapId:0,
      image:"",
      ipfs:"",
      price:new BN(0)
    },
    itemIds_arr:[],
    floormapIds_arr:[],
    items_arr:[],
    floormaps_arr:[]
  };
  constructor(props){
    super(props)
    this.state.create['ipfs'] = props.navigation.getParam("default_ipfs","127.0.0.1:5001")
  }
  componentDidMount(){
    const __this= this;
    attestation.queryMulti([["ownerItemIds",issuer.address],["ownerFloormapIds",issuer.address]]).then(function(values){
    
      var ownerItems = values[0].map(function(v){
        var id = v.toNumber();
        return ["items",id];
      });
      
      var floorItems =values[1].map(function(v){
        var id = v.toNumber();
        return ["floorplans",id];
      })
      console.log("ownerItems",ownerItems);
      __this.setState({"itemIds_arr":ownerItems,"floormapIds_arr":floorItems})
      Promise.all([attestation.queryMulti(ownerItems),attestation.queryMulti(floorItems)]).then(function(b_values){
        
        var items =[]; var floormap_items =[];
        b_values[0].forEach(function(k){
          let j = k.unwrap();
          let m ={
            image:hexToString(j.image),
            ipfs:hexToString(j.ipfs),
            desc:hexToString(j.desc)
          };
          items.push(m);
        })
        console.log("b_values[1]",b_values[1]);
        b_values[1].forEach(function(k){
          let j = k.unwrap();
          
          let m ={
            image:hexToString(j.image),
            ipfs:hexToString(j.ipfs),
            desc:hexToString(j.desc)
          };
          floormap_items.push(m);
        })
        console.log("items_arr",items);
        console.log("floormaps_arr",floormap_items);
        __this.setState({"items_arr":items,"floormaps_arr":floormap_items})
      })
    })

  }
  onItemChange = (item) => {
    this.setState({ item });
  }

  onPriceChange = (price) => {
    this.setState({ price: price || new BN(0) });
  }
  onGChange = (type,field,value)=>{
    var n = this.state[type];
    n[field]=value;
    var obj={};
    obj[type]=n;
    this.setState(obj);
  }
  onUpdatePriceChange = (price) => {
    this.setState({ updatePrice: price || new BN(0) });
  }

  onItemIdChange = (itemId) => {
    this.setState({ itemId });
  }
  _pickImage(){
    const __this =this;
    Utils._pickImage(this.state.create.ipfs).then(function(value){
      var create = __this.state.create;
      create["image"] = value.hash;
      console.log("create",create);
      __this.setState({create:create,image:value.uri});
    })
  }
  createItem(){
    const {desc,image, price,ipfs} = this.state.create;
    console.log("create image",image)
    console.log("Create",this.state.create,stringToHex(image));
    attestation.tx("createItem",[stringToHex(desc),16001,price,stringToHex(image),stringToHex(ipfs)]).then(function(){})
  }
  addItem(){
    const {itemId,floormapitemid} =this.state.add;
    attestation.tx("addItem",[itemId,floormapitemid,1]).then(function(){})
  }
  removeItem(){
    const {itemId,floormapitemid} = this.state.remove;
    attestation.tx("removeItem",[itemId,floormapitemid]);
  }
  updateItem(){
    const {itemId,desc,price,ipfs,image} = this.state.update;
    attestation.tx("updateItem",[itemId,desc,16001,price,image,ipfs])
  }
  _saveImage(){

  }
  render(){
    
    const {  price, updatePrice, itemId,accountId,create,image,itemIds_arr,floormapIds_arr,items_arr,floormaps_arr } = this.state;
    const itemPicker =[]; const floormapPicker=[];
    
    for (let i = 0; i < items_arr.length; ++i) {
      console.log("mm",items_arr[i].desc,"items",itemIds_arr[i][1]);
      itemPicker.push(
        <Picker.Item key={i} label={items_arr[i].desc} value={itemIds_arr[i][1]}/>
        //<Picker.Item key={i} label={items_arr[i].desc} value={itemIds_arr[i][1].toString()}/>
      );
    }
    
    for (let i =0; i<floormaps_arr.length; ++i){
      floormapPicker.push(
        <Picker.Item key={i} label={floormaps_arr[i].desc} value={floormaps_arr[i][1]}/>
      )
    }
    const __this = this;
    return (
      <ScrollView vertical={true}>
      <section>
        <ActionWrapper>
          <summary>
            <h2>Create Item</h2>
          </summary>
          <div className='ui--row'>
            Description
            <TextInput  onChangeText={(v)=>this.onGChange("create","desc",v)}/>
          </div>
          <div className='ui--row'>
            Price
            <TextInput
              onChangeText={(v)=>this.onGChange("create","price",v)}
            />
          </div>
          <div className='ui--row'>
            IPFS
            <TextInput
              onChangeText={(v)=>this.onGChange("create","ipfs",v)}
              value={this.state.create.ipfs}
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
              title='Create Item'
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
              selectedValue={this.state.add.itemId}
              onValueChange={(itemValue, itemIndex) =>
                this.onGChange("add","itemId",itemValue)
              }>
              {itemPicker}
            </Picker>
          </div>
          <div className='ui--row'>
            Floormap:
            <Picker
              selectedValue={this.state.add.floormapId}
              onValueChange={(itemValue, itemIndex) =>
                this.onGChange("add","floormapId",itemValue)
              }>
              {floormapPicker}
            </Picker>
          </div>
          <div className='large'>
            <Button
              title='Add Item'
              onPress={() => __this.addItem()}
            />
          </div>
        </ActionWrapper>
        <ActionWrapper>
          <summary>
            <h2>Remove Item</h2>
          </summary>
          <div className='ui--row'>
            Item:
            <Picker
              selectedValue={this.state.remove.itemId}
              onValueChange={(itemValue, itemIndex) =>
                this.onGChange("remove","itemId",itemValue)
              }>
              {itemPicker}
            </Picker>
          </div>
          <div className='ui--row'>
            Floormap:
            <Picker
              selectedValue={this.state.remove.floormapId}
              onValueChange={(itemValue, itemIndex) =>
                this.onGChange("remove","floormapId",itemValue)
              }>
              {floormapPicker}
            </Picker>
          </div>
          <div className='large'>
              <Button
                title='Remove Item'
                onPress={() => __this.removeItem()}
              />
          </div>
        </ActionWrapper>
        <ActionWrapper>
          <summary>
            <h2>Update Item</h2>
          </summary>
          <div className='ui--row'>
            Item:
            <Picker
              selectedValue={this.state.update.itemId}
              onValueChange={(itemValue, itemIndex) =>
                this.onGChange("update","itemId",itemValue)
              }>
              {itemPicker}
            </Picker>
          </div>
          <div className='ui--row'>
            Description
            <TextInput  onChangeText={(v)=>this.onGChange("update","desc",v)}/>
          </div>
          <div className='ui--row'>
            Price
            <TextInput
              onChangeText={(v)=>this.onGChange("update","price",v)}
            />
          </div>
          <div className='ui--row'>
            IPFS
            <TextInput
              onChangeText={(v)=>this.onGChange("update","ipfs",v)}
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
              title='Update Item'
              onPress={() => __this.updateItem()}
            />
          </div>
        </ActionWrapper>
      </section>
      </ScrollView>
    )
  }
}