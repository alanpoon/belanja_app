import React, { PureComponent } from 'react';
import * as scale from "d3-scale";
const d3 = {
  scale,
};
type Props={

}
class Layer extends PureComponent <Props>{
  constructor(props){
    super(props)
    this.x = d3.scale.scaleLinear();
    this.y = d3.scale.scaleLinear();
  }
  render(){
    return(<View></View>)
  }
  xScale(scale){
    this.x = scale;
  }
  yScale(scale){
    this.y = scale;
  }
  colorSet(scaleName){
    this.colors =scaleName;
  }
  colorMode(scaleType){
    this.scaleType = scaleType;
  }
  customThresholds(val){
    this.customThresholds = val;
  }
  id(){
    return this.id;
  }
  title(t){
    this.name =t;
  }

}

export default Layer;