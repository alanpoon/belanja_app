import React, { Component } from 'react';
import Svg, {G, Defs,Stop,Pattern,RadialGradient,Rect,Circle} from "react-native-svg";
import {Dimensions,Image,Button,TextInput,Text,AsyncStorage,View} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import IPFS from 'ipfs-mini';
import * as scale from "d3-scale";
import * as shape from "d3-shape";
import * as array from "d3-array";
import Layer from './Layernew';

const d3 = {
  scale,
  shape,
  array
};
async function _retrieveData(key,cannotfind) {
   try {
     const value = await AsyncStorage.getItem(key);
     if (value !== null) {
       // We have data!!
       return value;
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
   return await    ipfs.add(result.uri).uri
};
class Floorplan extends Component{
   state = {
      ipfs_add:"192.168.1.194:5001",
      xScale: d3.scale.scaleLinear().domain([0,50.0]).range([0,50]),
      yScale:d3.scale.scaleLinear().domain([0,33.79]).range([0,38]),
      left: 0,
      top: 0,
      isZoom:false,
      zoom: 1,
      image: ""
      };
  constructor(props){
    super(props)
    this.panZoomEnabled=true;
    this.maxZoom=5;
    const __this = this;
    this.ipfs_add = React.createRef();
    this.layers=[{type:"overlays",data:[{
      id:0,
      initialTop: 0,
      initialLeft: 0,
      offsetTop: 0,
      offsetLeft: 0,
      selectedIndex:1,
      color:"#D73027",
      points:[
        {
           "x":2.513888888888882,
           "y":8
        },
        {
           "x":6.069444444444433,
           "y":8
        },
        {
           "x":6.069444444444434,
           "y":5.277535934291582
        },
        {
           "x":8.20833333333332,
           "y":2.208151950718685
        },
        {
           "x":13.958333333333323,
           "y":2.208151950718685
        },
        {
           "x":16.277777777777825,
           "y":5.277535934291582
        },
        {
           "x":16.277777777777803,
           "y":10.08151950718685
        },
        {
           "x":17.20833333333337,
           "y":10.012135523613962
        },
        {
           "x":17.27777777777782,
           "y":18.1387679671458
        },
        {
           "x":2.513888888888882,
           "y":18
        }
     ]},{id:1,initialTop: 10,
        initialLeft: 10,
        offsetTop: 0,
        offsetLeft: 0,
        color:"#D73027",
        selectedIndex:1, points:[
          {
             "x":2.513888888888882,
             "y":8
          },
          {
             "x":6.069444444444433,
             "y":8
          },
          {
             "x":6.069444444444434,
             "y":5.277535934291582
          },
          {
             "x":8.20833333333332,
             "y":2.208151950718685
          },
          {
             "x":13.958333333333323,
             "y":2.208151950718685
          },
          {
             "x":16.277777777777825,
             "y":5.277535934291582
          },
          {
             "x":16.277777777777803,
             "y":10.08151950718685
          },
          {
             "x":17.20833333333337,
             "y":10.012135523613962
          },
          {
             "x":17.27777777777782,
             "y":18.1387679671458
          },
          {
             "x":2.513888888888882,
             "y":18
          }
       ]}]},{type:"image",data:this.state.image==""?require("../../assets/images/sample_floorplan.png"): _pickImage(this.state.image)}];
       if (!this.state.loaded){
         Promise.all([_retrieveData("ipfs_add",this.state.ipfs_add),_retrieveData("ipfs_image","")]).then(function(values){
            const ipfs_add = values[0]; const ipfs_image = values[1];
            __this.setState({ipfs_add,ipfs_image,loaded:true});
          })
       }
       
  }
   processPinch(x, y, scroll) {

      if (!this.state.isZooming) {
      const { top, left, zoom } = this.state;
      this.setState({
         isZooming: true,
         initialX: x,
         initialY: y,
         initialTop: top,
         initialLeft: left,
         initialZoom: zoom,
      });
      } else {
      const {
         initialX,
         initialY,
         initialTop,
         initialLeft,
         initialZoom,
      } = this.state;

      const touchZoom = (scroll<0)?1.25:0.8;
      const dx = x - initialX;
      const dy = y - initialY;


      const zoom = initialZoom * touchZoom;
      const left = (initialLeft + dx - x) * zoom + x;
      const top = (initialTop + dy - y) * zoom + y;
      this.setState({
         zoom,
         left,
         top,
         initialZoom:zoom,
         initialX:x,
         initialY:y
      });
      }
   }

   processTouch(x, y) {
      if (!this.state.isMoving || this.state.isZooming) {
      const { top, left } = this.state;
      this.setState({
         isMoving: true,
         isZooming: false,
         initialLeft: left,
         initialTop: top,
         initialX: x,
         initialY: y,
      });
      } else {
      const { initialX, initialY, initialLeft, initialTop } = this.state;
      const dx = x - initialX;
      const dy = y - initialY;
      this.setState({
         left: initialLeft + dx,
         top: initialTop + dy,
      });
      }
   }
  wheel(e){
     console.log(e);
     this.processPinch(e.clientX,e.clientY,e.deltaY);
  }
  
  render(){
   const viewBoxSize = 65;
   const { width, height } = this.props;
    const { left, top, zoom } = this.state;
    const resolution = viewBoxSize / Math.min(height, width);
    const __this= this;
    
    return (<View><Svg height={height} width={width} onWheel={(e)=>this.wheel(e)} viewBox="0 0 65 65" preserveAspectRatio="xMinYMin meet">
      <Defs>
        <RadialGradient id="metal-bump" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <Stop offset="0%" style={{"stopColor": 'rgb(170, 170, 170)', 'stopOpacity': 0.6}}></Stop>
          <Stop offset="100%" style={{'stopColor': 'rgb(204, 204, 204)', 'stopOpacity': 0.5}}></Stop>
        </RadialGradient>
        <Pattern patternUnits="userSpaceOnUse" x="0" y="0" width="3" height="5">
          <Rect height="3" width="3" stroke="none" fill="rgba(204,204,204,0.5)"></Rect>
          <Circle cx="1.5" cy="1.5" r="1" stroke="none" fill="url(#metal-bump)"></Circle>
        </Pattern>
      </Defs>
      <G scale={zoom} x={left*resolution} y={top*resolution}>
        <Rect pointerEvents="all" style={{opacity:0}}></Rect>
        {this.layers.map(function(l){
           return (<Layer key={l.type} type={l.type} data={l.data} x={__this.state.xScale} y={__this.state.yScale} resolution={resolution}/>)
        })}
      </G>
    </Svg>
    <Text>Ipfs Address</Text>
    <TextInput  defaultValue={this.state.ipfs_add} onChangeText={(ipfs_add) => this.setState({ipfs_add})}  ref={this.ipfs_add}/>
    </View>)
  }
}

export default Floorplan;