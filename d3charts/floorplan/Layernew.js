import React, { Component } from 'react';
import * as scale from "d3-scale";
import * as shape from "d3-shape";
import {View, StyleSheet,PanResponder, Image} from 'react-native'
import Svg, {
  Circle,
  Ellipse,
  G,
  LinearGradient,
  RadialGradient,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
  Symbol,
  Use,
  Defs,
  Stop
} from 'react-native-svg';
const d3 = {
  scale,
  shape
};
const styles = StyleSheet.create({
  red: {
    //color: '#D73027',
    opacity: 0.4
  },
});
class Layer extends Component{
  state={}
  constructor(props){
    super(props);
    const {x,y,type,data,resolution} = props;
    this.x = x;
    this.y = y;
    this.state.data = data;
    if (type=="overlays"){
      this._panResponder = this.state.data.map((e,index)=>{return PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
        onPanResponderGrant: () => {
          console.log('-------onPanResponderGrant------')
        },
        onPanResponderMove: (evt, gs) => {
          console.log("gs.dx",gs.dx);
          const {resolution} = this.props;
          this.setState(
            state =>{
              const data = state.data.map((item,j)=>{
                if(j==index){
                  var item_c = item;
                  item_c['offsetTop'] = gs.dy*resolution;
                  item_c['offsetLeft'] = gs.dx*resolution;
                  return item_c
                }else{
                  return item;
                }
              })
              return {data,}
            }
           )
        },
        onPanResponderTerminationRequest: (evt, gestureState) => true,
        
        onPanResponderRelease: (evt, gs) => {
          const x  =this.x;
          const y = this.y;
          this.setState(
            state =>{
              const data = state.data.map((item,j)=>{
                
                if(j===index){
                  const{initialLeft,initialTop,offsetTop,offsetLeft}=item;
                  var item_c = item;
                  item_c['offsetTop']=0;
                  item_c['offsetLeft']=0;
                  item_c['initialLeft']=0;
                  item_c['initialTop']=0;
                  item_c["points"] = item_c["points"].map((c)=>{
                    return {
                      x: c.x+x.invert(offsetLeft),
                      y: c.y+ y.invert(offsetTop)
                    }
                  });
                  return item_c
                }else{
                  return item;
                }
              })
              return {data,}
            }
           )
        },
        onShouldBlockNativeResponder: (evt, gestureState) => {
          // Returns whether this component should block native components from becoming
          // the JS responder. Returns true by default. Is currently only supported on
          // android.
          return true;
        }
      })})
    }
    
  }
  render(){
    const {x,y,type,data} = this.props;
    const __this = this;
    const line = d3.shape.line()
		.x(function(d) { return x(d.x); })
      .y(function(d) { return y(d.y); }); 
    if(type=="overlays"){
      return(<G key="overlays">
        {this.state.data.map((element,index)=>{
        const {initialLeft,initialTop,offsetLeft,offsetTop}= element;
        const cx = initialLeft+offsetLeft;
        const cy = initialTop+offsetTop;
        return(
        <G key ={"i"+index} x={cx} y={cy}>
          {element.points.map(function(p,i){
               return(
               <Circle key={"circle_"+i} vectorEffect="non-scaling-stroke" pointerEvents="all" r="1" cx={x(p.x)} cy={y(p.y)} stroke="lime" strokeWidth="2px" fill="none"/>
               );
            })}
          <Path style={styles.red} {...__this._panResponder[index].panHandlers} vectorEffect="non-scaling-stroke" pointerEvents="all" d={line(element.points) + "Z"}  fill={element.color}>
          </Path>
          
        </G>)
      })
      }
      </G>)
    }else if (type=="image"){
      return(<G key="image"><Image source={this.state.data}/>
      </G>)
    }
        
  }
  
  id(){
    return this.id;
  }
  title(t){
    this.name =t;
  }

}

export default Layer;