import React, { Component } from 'react';
import Svg, {G, Defs,Stop,Pattern,RadialGradient,Rect,Circle} from "react-native-svg";
import {PanResponder,View,Picker} from 'react-native';
import * as scale from "d3-scale";
import * as shape from "d3-shape";
import * as array from "d3-array";
import Layer from './Layernew';
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
      floormapScheme:"zoom"
      };
  constructor(props){
    super(props)
    this.panZoomEnabled=true;
    const __this = this;
    this.ipfs_add = React.createRef();
    this.layers=[{type:"image",data:this.state.image==""?require("../../assets/images/sample_floorplan.png"): _pickImage(this.state.image)},
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
       ]}]},{type:"image",hash:""}];
       if(this.state.floormapScheme=="zoom"){
         this._panResponder = PanResponder.create({
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
                  this.processTouch(locationX, locationY);
               } else if (length === 2) {
                  const [touch1, touch2] = touches;
                  this.processPinch(
                  touch1.locationX,
                  touch1.locationY,
                  touch2.locationX,
                  touch2.locationY
                  );
               }
            },
            onPanResponderRelease: () => {
               this.setState({
                  isZooming: false,
                  isMoving: false,
               });
            },
            });
       }else{
         this._panResponder={
            "panHandlers":[]
         }
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
  processPinch(x1, y1, x2, y2) {
      const distance = calcDistance(x1, y1, x2, y2);
      const { x, y } = calcCenter(x1, y1, x2, y2);

      if (!this.state.isZooming) {
      const { top, left, xScale,yScale } = this.state;
      this.setState({
         isZooming: true,
         initialX: x,
         initialY: y,
         initialTop: top,
         initialLeft: left,
         xScale: xScale,
         yScale:yScale,
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
      } = this.state;

      const touchZoom = distance / initialDistance;
      const dx = x - initialX;
      const dy = y - initialY;

      const left = (initialLeft + dx - x) * touchZoom + x;
      const top = (initialTop + dy - y) * touchZoom + y;
      const xScale_n = xScale.range([xScale.range()[0],touchZoom*xScale.range()[1]]);
      const yScale_n = yScale.range([yScale.range()[0],touchZoom*yScale.range()[1]]);
      this.setState({
         xScale:xScale_n,
         yScale:yScale_n,
         left,
         top,
      });
      }
   }

  render(){
    const {width,height} = this.props;
    const __this= this;
    return (<View><Picker
      selectedValue={this.state.floormapScheme}
      style={{height: 50, width: 100}}
      onValueChange={(itemValue, itemIndex) =>
        this.setState({floormapScheme: itemValue})
      }>
      <Picker.Item label="Zoom" value="zoom" />
      <Picker.Item label="Move tables" value="move" />
    </Picker>
    <Svg height={height} width={width} preserveAspectRatio="xMinYMin meet" {...__this._panResponder.panHandlers}>
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
      <G height={height} width={width}>
        <Rect pointerEvents="all" style={{opacity:0}}></Rect>
        {this.layers.map(function(l){
           return (<Layer  key={l.type} type={l.type} data={l.data} x={__this.state.xScale} y={__this.state.yScale} resolution={resolution} width={width} height={height}/>)
        })}
      </G>
    </Svg> <Text>Ipfs Address</Text>
    <TextInput  defaultValue={this.state.ipfs_add} onChangeText={(ipfs_add) => this.setState({ipfs_add})}  ref={this.ipfs_add}/>
    </View>)
  }
}

export default Floorplan;