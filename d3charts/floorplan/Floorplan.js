import React, { Component } from 'react';
import Svg, {G, Defs,Stop,Pattern,RadialGradient,Rect,Circle} from "react-native-svg";
import * as scale from "d3-scale";
import * as shape from "d3-shape";
import * as array from "d3-array";
import Layer from './Layernew';
const d3 = {
  scale,
  shape,
  array
};


class Floorplan extends Component{
  constructor(props){
    super(props)
    this.panZoomEnabled=true;
    this.maxZoom=5;
    this.xScale = d3.scale.scaleLinear().domain([0,50.0]).range([0,500]);
    this.yScale = d3.scale.scaleLinear().domain([0,33.79]).range([0,380]);
    this.layers=[{type:"overlays",data:[{
      id:0,
      initialTop: 50,
      initialLeft: 50,
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
     ]},{id:1,initialTop: 100,
        initialLeft: 100,
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
  }
  render(){
    var width = this.xScale.range()[1] - this.xScale.range()[0],
    height = this.yScale.range()[1] - this.yScale.range()[0];
    const __this= this;
    return (<Svg height={height} width={width}>
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
           return (<Layer key={l.type} type={l.type} data={l.data} x={__this.xScale} y={__this.yScale}/>)
        })}
      </G>
    </Svg>)
  }
}

export default Floorplan;