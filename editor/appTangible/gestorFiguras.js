import { gestorBD } from './gestorBD.js'
import { receptorBLE } from './receptorBLE.js'

import { nodeNumbers, nodeNames } from './default.js'

export const gestorFiguras = (function () {

  let sensors;
  let lastSensors;
  // let figConnections = {};
  let figConnections;
  let figures;

  let playing;


  function initGestor(){
    sensors = receptorBLE.getSensors()
    figures = editor.scene.children

    if(!figConnections){
      gestorBD.getRelations().then((value)=>{
        
        figConnections = JSON.parse(value);
        //console.log("hola");
        //console.log(figConnections);

        setInterval(playGestor, 100);
        
      });
    }
  }

  function updateGestor(){
    
    sensors = receptorBLE.getSensors();

    figures = editor.scene.children;
  
    let i = 0;
    
    let toDeleteList = [];
    for(const uuid in figConnections){
      let found = false

      figures.forEach(fig =>{
        if(fig.uuid == uuid){
          found = true
        }
      })
      if(!found) toDeleteList.push(uuid)
    };

    toDeleteList.forEach( uuid =>{
      gestorBD.deleteElement(uuid)
    });

  }

  function updateAttributeFigure(uuid, data, attributeName){

    figures = editor.scene.children
    let object;

    figures.forEach(element =>{
      if(element.uuid === uuid){

        object = element

        if(attributeName === "scaleX"){
          element.scale.x = tranformDataToScaleData(data);
        }else if(attributeName === "scaleY"){
          element.scale.y = tranformDataToScaleData(data);
        }else if(attributeName === "scaleZ"){
          element.scale.z = tranformDataToScaleData(data);
        }else if(attributeName === "rotationX"){
          element.rotation.x = tranformDataToRotationData(data);
        }else if(attributeName === "rotationY"){
          element.rotation.y = tranformDataToRotationData(data);
        }else if(attributeName === "rotationZ"){
          element.rotation.z = tranformDataToRotationData(data);
        }else if(attributeName === "visibility"){
          element.visible = transformDataToVisibilityData(data);
        }else if(attributeName === "positionX"){
          element.position.x = tranformDataToPositionData(data);
        }else if(attributeName === "positionY"){
          element.position.y = tranformDataToPositionData(data);
        }else if(attributeName === "positionZ"){
          element.position.z = tranformDataToPositionData(data);
        }
        return 
      } 
    })

    if(object){
      editor.signals.objectChanged.dispatch( object );
    }
    //editor.scene = figures;

    // Para hacer cambios en la reproducción 
    if(player.player.scene !== undefined ) player.player.scene.children = figures 
    
  }

  function updateConnectionsGestorFiguras(){
    gestorBD.getRelations().then((value)=>{
      figConnections = JSON.parse(value);
    });
  }

  function tranformDataToScaleData(data){
    if(data < 100) return 1;
    return data / 100;
  }

  function tranformDataToPositionData(data){
    if(data < 100) return 1;
    return data / 100;
  }

  // convierte los grados a radianes
  function tranformDataToRotationData(data){
    return (Math.PI*data) /180
  }

  function transformDataToVisibilityData(data){
    return data == 0 ? false : true;
  }

  function playGestor(){

    updateGestor();
    // console.log("play");
    // console.log("SENSORS");
    // console.log(sensors);
    if(typeof sensors != 'undefined' && sensors[0] != ""){
      // console.log("sensors");
      // console.log(sensors);
      for(let i = 0; i < sensors.length; i++){
        if(typeof lastSensors != 'undefined'){
          // si ha cambiado el estado del sensor producirá cambios
          
          for(const uuid in figConnections){
            const data = figConnections[uuid]
            const nodeNumber = nodeNumbers[`${Object.keys(sensors[i])[0]}`]

            if(nodeNumber > 0){

              const connections = data.drawflow.Home.data[nodeNumber].outputs.output_1.connections
              if(connections.length > 0){
                // por cada conexión del sensor[i], se actualiza el atributo
                connections.forEach(ele =>{
                  updateAttributeFigure(uuid, Object.entries(sensors[i])[0][1], nodeNames[ele.node])// uuid, data, nombreAtributo
                })
              }
            }
          }
        }
      }
  
      lastSensors = sensors
    }

  }

  return {
    initGestor: function(){
      initGestor()
    },
    updateConnectionsGestorFiguras: function(){
      updateConnectionsGestorFiguras()
    }
  };

})();

