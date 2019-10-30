import { GLView } from 'expo-gl';
import { Renderer, loadTextureAsync, THREE } from 'expo-three';
import {PanResponder,PixelRatio,TextInput,KeyboardAvoidingView,Alert,View,Button} from 'react-native';
import * as React from 'react';
import './BallSpinerLoader';
import attestation from '../../cennzapp/utils/attestation';
import { issuer } from '../../cennzapp/utils/cennnznet';
import { u8aToString,hexToU8a } from '@cennznet/util';
import jj from '../../cennzapp';
import BN from 'bn.js';
global.THREE = THREE;

const hexToString = str =>u8aToString(hexToU8a(str.toHex())).substr(1);
export default class FloorplanEditor extends React.Component {
  state={timeout:null,
  isUserInteracting:false,
  onMouseDownMouseX: 0, onMouseDownMouseY : 0,
  lon :0, onMouseDownLon : 0,
  lat : 0, onMouseDownLat : 0,
  phi : 0, theta : 0,
  objects:[],
  textObjects:[],
  texts:[],
  selectedIndex:null,
  scene:new THREE.Scene(),
  text_box:"none",
  cubes:[]
  };
  cubeGeo=null;
  redCubeMaterial=null;
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
  frame= 0;
  
  constructor(props){
     super(props)
     //jj();
     this.address = props.navigation.getParam("address","")
     this.image = props.navigation.getParam("image","hi")
     this.image_uri = props.navigation.getParam("image_uri",
     require("../../assets/images/IMG20190914110954.jpg"));
     this.desc = props.navigation.getParam("desc","Floormap Panoroma");
     this.ipfs = props.navigation.getParam("ipfs","")
  }
  create_cube(intersect){
    var voxel = new THREE.Mesh(this.cubeGeo, this.redCubeMaterial);
    voxel.position.copy(intersect);
    this.state.scene.add(voxel);
    this.state.objects.push(voxel);
  }

  unhighlight_cubes(){
    const __this = this;
    this.state.objects.forEach(function(e){
      e.material= __this.redCubeMaterial;
    })
  }
  add_cube(){
    if(this.selectedIndex!=null){
      this.state.scene.remove(this.state.textObjects[this.selectedIndex])
      const point = this.state.textObjects[this.selectedIndex].position;
      const textedit = this.state.texts[this.selectedIndex];
      const {text,mesh}  = this.create_text(point,textedit)
      this.state.textObjects[this.selectedIndex] = mesh
      this.state.scene.add(this.state.textObjects[this.selectedIndex])
      const cube_pos = this.state.objects[this.selectedIndex].position;
      this.table_add_element(textedit,cube_pos)
    }
  }
  delete_cube(){
    if(this.selectedIndex!=null){
        const textedit = this.state.texts[this.selectedIndex];
        this.state.texts.splice(this.selectedIndex,1)
        this.state.scene.remove(this.state.textObjects[this.selectedIndex])
        this.state.textObjects.splice(this.selectedIndex,1);
        this.state.scene.remove(this.state.objects[this.selectedIndex])
        this.state.objects.splice(this.selectedIndex,1)
        this.selectedIndex = null;
        this.setState({text_box:"none"});
        for (var i = 0;i<this.state.cubes.length;i++){
          if (this.state.cubes[i][0]==textedit){
            this.state.cubes.splice(i,1);
            break;
          }
        }
    }
  }
  save_map(){
    console.log("h")
    const signer = issuer.address;
    const address = this.address;
    const image = this.image;
    const desc = this.desc;
    const ipfs = this.ipfs;
    console.log("signer",signer);
    console.log("image",image,this.image);
    console.log("desc",desc);
    console.log("ipfs",ipfs);
    console.log("fo",this.state.cubes);
    attestation.tx("addFloorplan",[signer,address,this.state.cubes,desc,image,ipfs]).then(function(){})

  }
  query_map(){
    const item_id = 0;
    attestation.tx("getFloorplan",[item_id]).then((z)=> {
    const k = z.unwrap();
    console.log("image",hexToString(k.image))
    console.log("desc",hexToString(k.desc))
    console.log("cubes",k.cubes);
    console.log("usize",k.cubes[0][0].toNumber())
    console.log("i16",k.cubes[0][1].toNumber())
    }
    )
  }
  table_add_element(table_num,pos){
    this.state.cubes.push([parseInt(table_num),Math.round(pos.x),Math.round(pos.y),Math.round(pos.z)]);
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
            
            this.spinnerNow = new Date();
            this.spinLoader = new THREE.BallSpinerLoader({ groupRadius:20 ,intersect:intersect,camera:this.camera});
            this.state.scene.add(this.spinLoader.mesh);
            this.unhighlight_cubes()
            this.setState({text_box:"none"})
          }else{
            var intersect = intersects_cube[0];
            if(this.state.objects.indexOf(intersect)==this.selectedIndex){
              
              //intersect.object.material.color.setHex( 0xff0000 );
              intersect.object.material = this.redCubeMaterial;
              this.selectedIndex = null;
            }else{
              this.unhighlight_cubes()
              //intersect.object.material.color.setHex( 0x93C47D );
              intersect.object.material = this.greenCubeMaterial;
              this.selectedIndex = this.state.objects.indexOf(intersect.object);
              const text_edit = this.state.texts[this.selectedIndex]
              this.setState({text_box:"inline"})
            }
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
  refresh_text=(textedit)=>{
    
    if(this.selectedIndex!=null){
      
      this.state.texts[this.selectedIndex] = textedit;
      
      this.table_add_element()
    }
    this.setState({text_box:"inline"})
  }
  face_camera =(mesh)=>{
    const {x,y,z} = (typeof mesh.position=="undefined")?mesh:mesh.position;

   mesh.rotation.y = Math.atan2( ( this.camera.position.x - x ), ( this.camera.position.z - z ) );
   return mesh;

  }
  create_text = (intersect_point,text)=> {
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
    
    var textGeo = new THREE.TextGeometry( text, {

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

    var textMesh = new THREE.Mesh( textGeo, materials );
    textMesh.position.copy(intersect_point)
    return {text:text,mesh:this.face_camera(textMesh)}

  }
  
  render(){
    const __this = this;
      return (
        
    <KeyboardAvoidingView
    behavior={'padding'}
          style={{ height: '100%'}}>
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
        const texture = await loadTextureAsync({asset:this.image_uri});
        console.log("texture",this.image_uri)
        var material = new THREE.MeshBasicMaterial( { map: texture } );
        var mesh1 = new THREE.Mesh(geometry,material);
        this.state.scene.add(mesh1);
        this.cubeGeo = new THREE.BoxGeometry(50, 50, 50);
        this.redCubeMaterial =  new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.5, transparent: true } );
        this.greenCubeMaterial =  new THREE.MeshBasicMaterial( { color: 0x93C47D, opacity: 0.5, transparent: true } );
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
            if (Math.round(timeDiff%60)>1.5){
              this.state.scene.remove(this.spinLoader.mesh);
              this.create_cube(this.spinLoader.mesh.position);
              const count = this.state.textObjects.length;
              const {text,mesh} = this.create_text(this.spinLoader.mesh.position,count.toString());
              this.state.textObjects.push(mesh);
              this.state.texts.push(text);
              this.state.scene.add(mesh);
              this.spinLoader=null;
              this.spinnerNow=null;
            }
          }
          if (this.frame>1){
            this.frame=0;
          }
          
          if (this.frame>=0&&this.frame<0.2){
            if(this.selectedIndex!=null && this.selectedIndex>=0){
              if(this.selectedIndex<=this.state.textObjects.length){
                this.state.textObjects[this.selectedIndex].material.forEach(function(z){
                  if (z.color.getHexString()!="741b47"){
                    z.color.setHex(0x741B47);
                  }else{
                    z.color.setHex(0xffffff);
                  }
                })
                
              }
            }
          }          
          this.frame+=0.2;
          update();
          gl.endFrameEXP();
        };
        render();
      }}
    />
       {this.state.text_box=="inline" ? <View style={{
          position:"absolute",
          top:"50%",
          left:"50%"
       }}><TextInput
            keyboardType="numeric"
            style={{
              height: 40,
              borderTopColor: 'gray',
              borderTopWidth: 1,
              width: 60,
              fontSize: 24,
              color: '#056ECF',
              paddingHorizontal: 12,

              backgroundColor:"#d1d1d1"
              
            }}
            value={this.state.texts[this.selectedIndex]}
            onChangeText={text => {this.refresh_text(text)}}
          /><Button
            title="Add"
            onPress={() => __this.add_cube()}
          /><Button
          title="Delete"
          onPress={() => __this.delete_cube()}
        />
          </View> : null}
          <Button
          title="Save"
          style={{
            position:"absolute",
            top:"90%",
            left:"10%"
          }}
          onPress={()=>__this.save_map()}
          />
          <Button
          title="Query"
          style={{
            position:"absolute",
            top:"90%",
            left:"10%"
          }}
          onPress={()=>__this.query_map()}
          />
    </KeyboardAvoidingView>
    
  );
}
}  
