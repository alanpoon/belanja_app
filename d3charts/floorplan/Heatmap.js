import * as scale from "d3-scale";
import * as transition from "d3-transition";
import * as zoom from "d3-zoom";
import * as array from "d3-array";
import {format} from "d3-format";
import * as shape from 'd3-shape';
import React,{Tooltip,Text} from 'react';
import Svg, {G, Defs,Stop,Pattern,RadialGradient,Rect,Circle,Path} from "react-native-svg";
const d3 = {
  scale,
	transition,
	zoom,
	array,
	format,
	shape
};

import Layer from './Layer';

class Heatmap extends Layer{
  constructor(){
    super();
    this.title = "heatmap";
    this.data = {
      "binSize": 3,
      "units": "\u00B0C",
      "map": [
          {"x": 21, "y": 12, "value": 20.2,id:1},
          {"x": 24, "y": 12, "value": 19.9,id:2},
          {"x": 27, "y": 12, "value": 19.7,id:3},
          {"x": 30, "y": 12, "value": 19.7,id:4},
          {"x": 21, "y": 15, "value": 20.5,id:5},
          {"x": 24, "y": 15, "value": 19.3,id:6},
          {"x": 27, "y": 15, "value": 19.4,id:7},
          {"x": 30, "y": 15, "value": 19.9,id:8},
          {"value": 19.9, id:9,"points": [{"x":2.513888888888882,"y":8.0},
                                     {"x":6.069444444444433,"y":8.0},
                                     {"x":6.069444444444434,"y":5.277535934291582},
                                     {"x":8.20833333333332,"y":2.208151950718685},
                                     {"x":13.958333333333323,"y":2.208151950718685},
                                     {"x":16.277777777777825,"y":5.277535934291582},
                                     {"x":16.277777777777803,"y":10.08151950718685},
                                     {"x":17.20833333333337,"y":10.012135523613962},
                                     {"x":17.27777777777782,"y":18.1387679671458},
                                     {"x":2.513888888888882,"y":18.0}]}]
      }
  }
  render(){
    var data =this.data;
    var x = this.x;
    var y = this.y;
    var line = d3.shape.line()
		.x(function(d) { return x(d.x); })
    .y(function(d) { return y(d.y); });
    var width =this.width;
    var height = this.height;
    return (
      <G id="heatmap">
        <Rect style={{opacity:0,fill:'rgb(0,0,255)'}} pointer-events="all" x="0" y="0" width={width} height={height}></Rect>
        {data.map.forEach(function(element) {
            if (! element.points){
              return (<Rect style={{opacity: 0.6}} x={x(element.x)} y={y(element.y)} height={Math.abs(y(data.binSize) - y(0))} width={Math.abs(x(data.binSize) -x(0))}>
                <Text></Text>
              </Rect>);
            }else{
              return(<Path vector-effect="non-scaling-stroke" pointer-events="all" d={line(element.points) + "Z"} style={{cursor: "move"}} fill={element.color}>
                <Tooltip>
                  <Text>Hi</Text>
                </Tooltip>
              </Path>);
            }
        }
        )}
      </G>
    )
  }
}

export default Heatmap;