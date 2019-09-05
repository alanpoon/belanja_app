import React, { Component } from 'react';
import Svg, {G, Defs,Stop,Pattern,RadialGradient,Rect,Circle} from "react-native-svg";
import {PanResponder,View,Picker,Button} from 'react-native';
import * as scale from "d3-scale";
import * as shape from "d3-shape";
import * as array from "d3-array";
import Layer from './Layer';

const d3 = {
  scale,
  shape,
  array
};
function calcDistance(x1, y1, x2, y2) {
   const dx = x1 - x2;
   const dy = y1 - y2;
   return Math.sqrt(dx * dx + dy * dy);
 }
 
 function middle(p1, p2) {
   return (p1 + p2) / 2;
 }
 
 function calcCenter(x1, y1, x2, y2) {
   return {
     x: middle(x1, x2),
     y: middle(y1, y2),
   };
 }

class Floorplan extends Component{
   state = {
      xScale: d3.scale.scaleLinear().domain([0,50.0]).range([0,50]),
      yScale:d3.scale.scaleLinear().domain([0,33.79]).range([0,38]),
      left: 0,
      top: 0,
      zoom: 1,
      //_panResponder:this.generatePan(),
      _panResponder:{
         panHandlers:[]
      },
      floormapscheme:"zoom"
      };
  constructor(props){
    super(props)
    this.panZoomEnabled=true;
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
  processPinch(x1, y1, x2, y2) {
      const distance = calcDistance(x1, y1, x2, y2);
      const { x, y } = calcCenter(x1, y1, x2, y2);

      if (!this.state.isZooming) {
      const { top, left, xScale,yScale,zoom } = this.state;
      this.setState({
         isZooming: true,
         initialX: x,
         initialY: y,
         initialTop: top,
         initialLeft: left,
         xScale: xScale,
         yScale:yScale,
         initialZoom:zoom,
         initialDistance: distance,
      });
      } else {
      const {
         initialX,
         initialY,
         initialTop,
         initialLeft,
         xScale,
         yScale,
         initialDistance,
         initialZoom,
      } = this.state;
      /*
      const touchZoom = distance / initialDistance;
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
      });*/
      const touchZoom = distance / initialDistance;
      const dx = x - initialX;
      const dy = y - initialY;

      const left = (initialLeft + dx - x) * touchZoom + x;
      const top = (initialTop + dy - y) * touchZoom + y;
      const zoom = initialZoom * touchZoom;
      this.setState({
        zoom,
        left,
        top,
      });
      }
   }
   save(){
    
   }
   generatePan(){
      const __this =this;
      return PanResponder.create({
         onPanResponderGrant: () => {},
         onPanResponderTerminate: () => {},
         onMoveShouldSetPanResponder: () => true,
         onStartShouldSetPanResponder: () => true,
         onShouldBlockNativeResponder: () => true,
         onPanResponderTerminationRequest: () => true,
         onMoveShouldSetPanResponderCapture: () => true,
         onStartShouldSetPanResponderCapture: () => true,
         onPanResponderMove: evt => {
            const touches = evt.nativeEvent.touches;
            const length = touches.length;
            if (length === 1) {
               const [{ locationX, locationY }] = touches;
               __this.processTouch(locationX, locationY);
            } else if (length === 2) {
               const [touch1, touch2] = touches;
               __this.processPinch(
               touch1.locationX,
               touch1.locationY,
               touch2.locationX,
               touch2.locationY
               );
            }
         },
         onPanResponderRelease: () => {

            __this.setState({
               isZooming: false,
               isMoving: false,
            });
         },
         });
   }
   floormapSchemechange(itemValue){
      console.log("change",itemValue);
      if (itemValue=="zoom"){
         this.setState({
            _panResponder:this.generatePan(),
            floormapscheme:itemValue
         })
      }else{
         this.setState({
            _panResponder:{
               panHandlers:[]
            },
            floormapscheme:itemValue
         })
      }
      
   }
  render(){
   const viewBoxSize = 65;
   const width= this.props.navigation.getParam("width",200);
   const height= this.props.navigation.getParam("height",200);
   const resolution = viewBoxSize / Math.min(height, width);
   const { left, top, zoom } = this.state;

    const __this= this;
    // {...__this.state._panResponder.panHandlers}
    return (<View><Picker
      selectedValue={this.state.floormapscheme}
      style={{height: 50, width: 150}}
      onValueChange={(itemValue, itemIndex) =>
         this.floormapSchemechange(itemValue)
      }>
      <Picker.Item label="Zoom" value="zoom" />
      <Picker.Item label="Move tables" value="move" />
    </Picker>
    <Svg height={height} width={width} preserveAspectRatio="xMinYMin meet" viewBox="0 0 65 65">
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
        {this.layers.map(function(l,m){
           return (<Layer key={l.type+"_"+m} type={l.type} data={l.data} x={__this.state.xScale} y={__this.state.yScale} resolution={resolution} width={width} height={height}/>)
        })}
      </G>
    </Svg><Button
          title="Save"
          onPress={this.save.bind(this)}
        />
    </View>)
  }
}

export default Floorplan;