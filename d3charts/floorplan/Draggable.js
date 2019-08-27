import React, { Component } from 'react';
import { StyleSheet, View, Text, PanResponder } from 'react-native';
import Svg, {G, Defs,Stop,Pattern,RadialGradient,Rect,Circle,Path} from "react-native-svg";

export default class App extends Component {

  state = {
    dragging: false,
    initialTop: 50,
    initialLeft: 50,
    offsetTop: 0,
    offsetLeft: 0,
  }

  panResponder = {}

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this.handleStartShouldSetPanResponder,
      onPanResponderGrant: this.handlePanResponderGrant,
      onPanResponderMove: this.handlePanResponderMove,
      onPanResponderRelease: this.handlePanResponderEnd,
      onPanResponderTerminate: this.handlePanResponderEnd,
    })
  }

  render() {
    const {dragging, initialTop, initialLeft, offsetTop, offsetLeft} = this.state
    const {data,color,pathd} = this.props;
    // Update style with the state of the drag thus far
    const style = {
      backgroundColor: dragging ? 'skyblue' : 'steelblue',
      top: initialTop + offsetTop,
      left: initialLeft + offsetLeft,
    }

    return (
        <G
          // Put all panHandlers into the View's props
          {...this.panResponder.panHandlers}
          style={[styles.square, style]}
        >
          {data.map(function(p,i){
            return(
              <Circle key={"circle_"+i} vectorEffect="non-scaling-stroke" pointerEvents="all" r="4" cx={p.x} cy={p.y} stroke="lime" strokeWidth="2px" fill="none"/>
            );
          })}
          <Path style={styles.red} vectorEffect="non-scaling-stroke" pointerEvents="all" d={pathd}  fill={color}>
            <Text>Hi</Text>
          </Path>
        </G>
    )
  }

  // Should we become active when the user presses down on the square?
  handleStartShouldSetPanResponder = () => {
    return true
  }

  // We were granted responder status! Let's update the UI
  handlePanResponderGrant = () => {
    this.setState({dragging: true})
  }

  // Every time the touch/mouse moves
  handlePanResponderMove = (e, gestureState) => {

    // Keep track of how far we've moved in total (dx and dy)
    this.setState({
      offsetTop: gestureState.dy,
      offsetLeft: gestureState.dx,
    })
  }

  // When the touch/mouse is lifted
  handlePanResponderEnd = (e, gestureState) => {
    const {initialTop, initialLeft} = this.state

    // The drag is finished. Set the initialTop and initialLeft so that
    // the new position sticks. Reset offsetTop and offsetLeft for the next drag.
    this.setState({
      dragging: false,
      initialTop: initialTop + gestureState.dy,
      initialLeft: initialLeft + gestureState.dx,
      offsetTop: 0,
      offsetLeft: 0,
    })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  square: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 12,
  },
  red: {
    //color: '#D73027',
    opacity: 0.4,
    cursor: "move"
  }
})
