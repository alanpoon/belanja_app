import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { Renderer, loadTextureAsync, THREE, renderer,utils } from 'expo-three';
import {PanResponder,PixelRatio,Dimensions,TextInput,KeyboardAvoidingView} from 'react-native';
import * as React from 'react';
import './BallSpinerLoader';
global.THREE = THREE;
export default class FloorplanEditor extends React.Component {
  state={timeout:null,
  isUserInteracting:false,
  onMouseDownMouseX: 0, onMouseDownMouseY : 0,
  lon :0, onMouseDownLon : 0,
  lat : 0, onMouseDownLat : 0,
  phi : 0, theta : 0,
  objects:[],
  scene:new THREE.Scene()
  };
  cubeGeo=null;
  cubeMaterial=null;
  width = 0;
  height = 0;
  raycaster = new THREE.Raycaster();
  camera=null;
  plane=null;
  spinnerNow=null;
  lastFrameTime;
  image;
  text="hellllllll0";
  spinLoader=null;
  constructor(props){
     super(props)
     this.image = props.navigation.getParam("image",
     require("../../assets/images/IMG20190914110954.jpg"))
  }
  create_cube(intersect){
    var voxel = new THREE.Mesh(this.cubeGeo, this.cubeMaterial);
    voxel.position.copy(intersect);
    this.state.scene.add(voxel);
    this.state.objects.push(voxel);
  }
  create_cube2(x,y,z){
    var voxel = new THREE.Mesh(this.cubeGeo, this.cubeMaterial);
    voxel.position.set(x,y,z);
    this.state.scene.add(voxel);
    this.state.objects.push(voxel);
  }
  componentWillMount() {
    this.panResponder = this.buildGestures();
  }
  castPoint = ({ locationX: x, locationY: y }) => {
    let touch = new THREE.Vector2();
    console.log("width",this.width," height",this.height);
    // touch.set( x, y);
    touch.set(((x / this.width) * 2) - 1, - (y / this.height) * 2 + 1);

    return touch;
  }
  buildGestures= () =>  PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
    onPanResponderGrant: ((event, gestureState) => {
      console.log("grant...");
        this.state.isUserInteracting = true;
        
				this.state.onMouseDownMouseX = event.nativeEvent.locationX;
				this.state.onMouseDownMouseY = event.nativeEvent.locationY;

				this.state.onMouseDownLon = this.state.lon;
        this.state.onMouseDownLat = this.state.lat;
        let touch = this.castPoint(event.nativeEvent);
        this.raycaster.setFromCamera(touch, this.camera);
        //this.raycaster.setFromCamera({x:event.nativeEvent.locationX,y:event.nativeEvent.locationY}, this.camera);
        var intersects = this.raycaster.intersectObjects(this.state.scene.children);
        var intersects_cube = this.raycaster.intersectObjects(this.state.objects);
        console.log("intersects",intersects);
        if (intersects.length > 0) {
          if (intersects_cube.length==0){
            var intersect = intersects[0];
            //this.create_cube(intersect);
            this.spinnerNow = new Date();
            this.spinLoader = new THREE.BallSpinerLoader({ groupRadius:20 ,intersect:intersect,camera:this.camera});
            this.state.scene.add(this.spinLoader.mesh);
          }else{
            this.textposition = intersects_cube[0];
            this.create_text()
          }
        }
        
        
    }),
    onPanResponderMove: ((event, gestureState) => {
      if ( this.state.isUserInteracting === true ) {

        const clientX = event.nativeEvent.locationX;
        const clientY = event.nativeEvent.locationY;
        this.state.lon=( this.state.onMouseDownMouseX - clientX ) * 0.1 + this.state.onMouseDownLon;
        this.state.lat=(clientY- this.state.onMouseDownMouseY)*0.1+this.state.onMouseDownLat;
      }

    }),
    onPanResponderRelease: ((event, gestureState) => {
      if (this.spinLoader!=null){
        this.state.scene.remove(this.spinLoader.mesh);
        this.spinLoader = null;
      }
      if(this.spinnerNow!=null){
        this.spinnerNow = null;
      }
      this.setState({
        isUserInteracting:false
      })
    }),
    onPanResponderTerminate: ((event, gestureState) => {
    }),
  })
  configureCamera = ({ width, height }) => {
    // camera
    //let camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    //let camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    this.camera.position.set(0, 0, 0);
    this.camera.lookAt(new THREE.Vector3());
  
  }
  onResize = ({ width, height }) => {
    console.log("onResize");
    this.width = width;
    this.height = height;

  }
  loadFont=()=>{
    this.font = new THREE.Font(require("./three_fonts/neue_haas_unica_pro_medium.json"));
    
  }
  refreshText=()=>{
    this.state.scene.remove(this.textMesh);
    this.create_text()
  }
  face_camera =(mesh)=>{
    const {x,y,z} = (typeof mesh.position=="undefined")?mesh:mesh.position;

   mesh.rotation.y = Math.atan2( ( this.camera.position.x - x ), ( this.camera.position.z - z ) );
   this.state.scene.add( mesh );

  }
  create_text = ()=> {
    const height = 2,
				size = 20,
				hover = 30,

				curveSegments = 4,

				bevelThickness = 2,
				bevelSize = 1.5,
        bevelEnabled = true;
    const materials = [
      new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } ), // front
      new THREE.MeshPhongMaterial( { color: 0xffffff } ) // side
    ];
    var textGeo = new THREE.TextGeometry( this.text, {

      font: this.font,

      size: size,
      height: height,
      curveSegments: curveSegments,

      bevelThickness: bevelThickness,
      bevelSize: bevelSize,
      bevelEnabled: bevelEnabled

    } );

    textGeo.computeBoundingBox();
    textGeo.computeVertexNormals();
    textGeo = new THREE.BufferGeometry().fromGeometry( textGeo );

    this.textMesh = new THREE.Mesh( textGeo, materials );
    this.textMesh.position.copy(this.textposition.point)
    this.face_camera(this.textMesh)

  }

  render(){
    const __this = this;
      return (
    <KeyboardAvoidingView
    behavior={'padding'}
          style={{ height: '100%', flex: 1 }}>
    <GLView
      //style={{ flex: 1 }}
      {...this.panResponder.panHandlers}
      onContextCreate={async (gl) => {
        this.loadFont();
        var { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
        width = width/PixelRatio.get();
        height = height/PixelRatio.get();
        console.log("width",width,"height",height);
        this.onResize({ width, height })
        const sceneColor = 0x6ad6f0;
        const isUserInteracting = __this.state.isUserInteracting;
        // Create a WebGLRenderer without a DOM element
        const renderer = new Renderer({ gl, antialias: true });
        renderer.setSize(width, height);
        renderer.setClearColor(sceneColor);
        console.log("PixelRatio.get",PixelRatio.get());
        renderer.setPixelRatio(PixelRatio.get())
        this.camera = new THREE.PerspectiveCamera(
          75,
          width / height,
          1,
          1100,
        );
        this.configureCamera({width,height});
        //this.camera.lookAt(new THREE.Vector3( 0, 0, 0 ));
        //scene.fog = new THREE.Fog(sceneColor, 1, 10000);
        //scene.add(new THREE.GridHelper(10, 10));

        //var geometry = new THREE.SphereBufferGeometry( 500, 60, 40 );
        var geometry = new THREE.CylinderGeometry( 500, 500, 1000, 64, 1, true );
				// invert the geometry on therenderer x-axis so that all of the faces point inward
        //geometry.scale( -1, 1, 1 );
        geometry.scale( 1, -1, 1 );
        const texture = await loadTextureAsync({asset:this.image});
        console.log("texture",this.image)
        var material = new THREE.MeshBasicMaterial( { map: texture } );
        var mesh1 = new THREE.Mesh(geometry,material);
        this.state.scene.add(mesh1);
         this.cubeGeo = new THREE.BoxGeometry(50, 50, 50);
        this.cubeMaterial =  new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.5, transparent: true } );
        this.create_cube2(-125,-62,0);
        var poleGeo = new THREE.BoxGeometry(5, 375, 5);
        var poleMat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          specular: 0x111111,
          shininess: 100,
        });
        var mesh2 = new THREE.Mesh(poleGeo, poleMat);
        mesh2.position.x = -125;
        mesh2.position.y = -62;
        mesh2.receiveShadow = true;
        mesh2.castShadow = true;
        this.state.scene.add(mesh2);
        this.state.objects.push(mesh2);
        const pointLight = new THREE.PointLight(0xffffff, 2, 1000, 1);
        pointLight.position.set(0, 200, 200);
        this.state.scene.add(pointLight);

        const spotLight = new THREE.SpotLight(0xffffff, 0.5);
        spotLight.position.set(0, 500, 100);
        spotLight.lookAt(this.state.scene.position);
        this.state.scene.add(spotLight);

        function update() {

          if ( isUserInteracting === false ) {
  
            //lon += 0.1;
  
          }
          const lon = __this.state.lon;
          const lat = Math.max( - 85, Math.min( 85, __this.state.lat ) );
          const phi = THREE.Math.degToRad( 90 - lat );
          const theta = THREE.Math.degToRad( lon );
          const x =  500 * Math.sin( phi ) * Math.cos( theta );
          const y =  500 * Math.cos( phi );
          const z = 500 * Math.sin( phi ) * Math.sin( theta );
          __this.camera.lookAt(new THREE.Vector3( x, y, z ));
          
          /*
          // distortion
          camera.position.copy( camera.target ).negate();
          */
  
          renderer.render( __this.state.scene, __this.camera );
  
        }

        // Setup an animation loop
        const render = () => {
          requestAnimationFrame(render);
          if (this.spinLoader!=null){
            this.spinLoader.animate();
          }
          if (this.spinnerNow!=null){
            var timeDiff = new Date() - this.spinnerNow;
            timeDiff /= 1000;
            if (Math.round(timeDiff%60)>3){
              this.state.scene.remove(this.spinLoader.mesh);
              this.create_cube(this.spinLoader.mesh.position);
              this.spinLoader=null;
              this.spinnerNow=null;
            }
          }
          update();
          gl.endFrameEXP();
        };
        render();
      }}
    />
    <TextInput
            style={{
              height: 40,
              borderTopColor: 'gray',
              borderTopWidth: 1,
              width: '100%',
              fontSize: 24,
              color: '#056ECF',
              paddingHorizontal: 12,
            }}
            onChangeText={text => {this.text = text; this.refreshText()}}
          />
    </KeyboardAvoidingView>   
  );
}
}  
