import React, { PureComponent } from 'react';
import Svg, {G, Defs,Stop,Pattern,RadialGradient,Rect,Circle} from "react-native-svg";
import * as scale from "d3-scale";
import * as shape from "d3-shape";
import * as array from "d3-array";
import Layer from './Layer';
import Heatmap from './Heatmap';
const d3 = {
  scale,
  shape,
  array
};

type Props={

}
class Floorplan extends PureComponent <Props>{
  constructor(props){
    super(props)
    this.panZoomEnabled=true;
    this.maxZoom=5;
    this.xScale = d3.scale.scaleLinear().domain([0,50.0]).range([0,500]);
    this.yScale = d3.scale.scaleLinear().domain([0,33.79]).range([0,380]);
    this.layers=[new Heatmap().xScale(this.xScale).yScale(this.yScale)];
  }
  render(){
    var width = this.xScale.range()[1] - this.xScale.range()[0],
    height = this.yScale.range()[1] - this.yScale.range()[0];
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
           return l.render()
        })}
      </G>
    </Svg>)
  }
}

export default Floorplan;