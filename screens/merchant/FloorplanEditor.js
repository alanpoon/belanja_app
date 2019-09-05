import React, { Component } from 'react';
import Svg, {G, Defs,Stop,Pattern,RadialGradient,Rect,Circle} from "react-native-svg";
import {Dimensions,Image,Button,TextInput,Text,View} from 'react-native';

import * as scale from "d3-scale";
import * as shape from "d3-shape";
import * as array from "d3-array";
import Layer from './Layer';
import * as Utils from '../../utils';
const d3 = {
  scale,
  shape,
  array
};

class FloorplanEditor extends Component{
   state = {
      xScale: d3.scale.scaleLinear().domain([0,50.0]).range([0,50]),
      yScale:d3.scale.scaleLinear().domain([0,33.79]).range([0,38]),
      left: 0,
      top: 0,
      zoom: 1,
      image: "",
      rerender:0,
      };
  constructor(props){
    super(props)
    this.panZoomEnabled=true;
    this.maxZoom=5;
    const __this = this;
    this.layers=[{type:"image",data:props.navigation.getParam("image",require("../../assets/images/sample_floorplan.png"))},
    {type:"overlays",data:[{
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
       ]}]}];
       if (!this.state.loaded){
         Promise.all([Utils._retrieveData("ipfs_add",this.state.ipfs_add),Utils._retrieveData("ipfs_image","")]).then(function(values){
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
         1:zoom,
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
  save(){
    
  }
  render(){
   const viewBoxSize = 65;
   const width= this.props.navigation.getParam("width",200);
   const height= this.props.navigation.getParam("height",200);
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
           return (<Layer key={l.type} type={l.type} data={l.data} x={__this.state.xScale} y={__this.state.yScale} resolution={resolution} width={width} height={height}/>)
        })}
      </G>
    </Svg>
    <Button
          title="Save"
          onPress={this.save.bind(this)}
        />
    </View>)
  }
}

export default FloorplanEditor;