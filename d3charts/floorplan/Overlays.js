import * as scale from "d3-scale";
import * as transition from "d3-transition";
import * as zoom from "d3-zoom";
import * as array from "d3-array";
import {format} from "d3-format";
import * as shape from 'd3-shape';
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Svg, {G, Defs,Stop,Pattern,RadialGradient,Rect,Circle,Path} from "react-native-svg";
import Draggable from './Draggable';
const d3 = {
  scale,
	transition,
	zoom,
	array,
	format,
	shape
};
const styles = StyleSheet.create({
  red: {
    //color: '#D73027',
    opacity: 0.4,
    cursor: "move"
  },
});
import Layer from './Layer';
class Overlays extends Layer{
  constructor(){
    super();
    this.title = "overlays";
    this.data = {
      "polygons":[
         {
            "id":"p1",
            "name":"kitchen",
            "color":"#D73027",
            "points":[
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
            ]
         }
      ]
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
      <G id="overlays" key="overlays">
        <Rect style={{opacity:0,fill:'rgb(0,0,255)'}} pointerEvents="all" x="0" y="0" width={width} height={height}></Rect>
        {data.polygons.map(function(element,index) {
          return(
          <Draggable key={"d_"+index} data={element.points} color={element.color} pathd={line(element.points) + "Z"}>
          </Draggable>
          );
        }
        )}
      </G>
    )
  }
}

export default Overlays;