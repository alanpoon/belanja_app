import React from "react";
import Svg, {G, Line, Path, Text,Defs,Stop,Pattern,RadialGradient,Rect,Circle} from "react-native-svg";
import * as scale from "d3-scale";
import * as shape from "d3-shape";
import * as array from "d3-array";
import PropTypes from "prop-types";
import Layer from './Layer';
const d3 = {
  scale,
  shape,
  array
};
const {number, string, arrayOf, instanceOf} = PropTypes;
const object = PropTypes.shape;


const Floorplan = (props) => {
  const {layers,panZoomEnabled,maxZoom,xScale,yScale} = prop;
  var width = xScale.range()[1] - xScale.range()[0],
        height = yScale.range()[1] - yScale.range()[0];
  layers = layers.map(function(l){
    l.xScale(xScale);
    l.yScale(yScale);
  });
  return (<Svg height={height} width={width}>
    <Defs>
      <RadialGradient id="metal-bump" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <Stop offset="0%" style={{"stop-color": 'rgb(170, 170, 170)', 'stop-opacity': 0.6}}></Stop>
        <Stop offset="100%" style={{'stop-color': 'rgb(204, 204, 204)', 'stop-opacity': 0.5,}}></Stop>
      </RadialGradient>
      <Pattern patternUnits="userSpaceOnUse" x="0" y="0" width="3" height="5">
        <Rect height="3" width="3" stroke="none" fill="rgba(204,204,204,0.5)"></Rect>
        <Circle cx="1.5" cy="1.5" r="1" stroke="none" fill="url(#metal-bump)"></Circle>
      </Pattern>
    </Defs>
    <G height={height} width={width}>
      <Rect pointer-events="all" style={{opacity:0}}></Rect>
      {layers}
    </G>
  </Svg>)

};

Floorplan.propTypes = {
  layers: arrayOf(Layer),
  panZoomEnabled: Boolean,
  maxZoom: number,
  xScale:instanceOf(any),
  yScale:instanceOf(any)
};
Floorplan.defaultProps ={
  layers: [],
	panZoomEnabled: true,
	maxZoom: 5,
	xScale: d3.scale.linear(),
	yScale: d3.scale.linear()
}

export default Floorplan;