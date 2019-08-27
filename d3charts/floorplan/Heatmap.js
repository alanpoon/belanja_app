import * as scale from "d3-scale";
import * as transition from "d3-transition";
import * as zoom from "d3-zoom";
import * as array from "d3-array";
import {format} from "d3-format";
import * as shape from 'd3-shape';
import React from 'react';
import { Text, StyleSheet } from 'react-native';
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
const styles = StyleSheet.create({
  red: {
    //color: '#D73027',
    opacity: 0.6
  },
});
class Heatmap extends Layer{
  constructor(){
    super();
    this.title = "heatmap";
    this.data = {
      "binSize": 3,
      "units": "\u00B0C",
      "map": [
          {"x": 21, "y": 12, "value": 20.2,id:1,color:"#D73027"},
          {"x": 24, "y": 12, "value": 19.9,id:2,color:"red"},
          {"x": 27, "y": 12, "value": 19.7,id:3,color:"red"},
          {"x": 30, "y": 12, "value": 19.7,id:4,color:"red"},
          {"x": 21, "y": 15, "value": 20.5,id:5,color:"red"},
          {"x": 24, "y": 15, "value": 19.3,id:6,color:"red"},
          {"x": 27, "y": 15, "value": 19.4,id:7,color:"red"},
          {"x": 30, "y": 15, "value": 19.9,id:8,color:"red"},
          {"value": 19.9, id:9,color:"#D73027","points": [{"x":2.513888888888882,"y":8.0},
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
      <G id="heatmap" key="heatmap">
        <Rect style={{opacity:0,fill:'rgb(0,0,255)'}} pointerEvents="all" x="0" y="0" width={width} height={height}></Rect>
        {data.map.map(function(element,index) {
            if (! element.points){
              return (<Rect key={index} style={styles.red} x={x(element.x)} y={y(element.y)} height={Math.abs(y(data.binSize) - y(0))} width={Math.abs(x(data.binSize) -x(0))} fill={element.color}>
                <Text>Hi{element.x}</Text>
              </Rect>);
            }else{
              return(<Path key={index} styles={styles.red} vectorEffect="non-scaling-stroke" pointerEvents="all" d={line(element.points) + "Z"} style={{cursor: "move"}} fill={element.color}>
                <Text>Hi</Text>
              </Path>);
            }
        }
        )}
      </G>
    )
  }
}

export default Heatmap;