import { gestorBD } from './gestorBD.js'
import { defaultDataInterface, nodeNames } from './default.js'

import { gestorFiguras } from './gestorFiguras.js'

export const interfazProg = (function () {

  let interfazProgCanvas;
  let initialize = false;

  function initInterface(){

    initialize = true;
    // Crear el canvas inicialmente
    const id = document.querySelector("#drawflow");
    interfazProgCanvas = new Drawflow(id);
    interfazProgCanvas.reroute = true;
    
    interfazProgCanvas.drawflow = defaultDataInterface;

    interfazProgCanvas.start();

    // LISTENERS
    // botón de cerrar
    const closeMenuButton = document.querySelector("#closeInterface");
    closeMenuButton.addEventListener('click', ()=>{
      const menuSensores = document.querySelector("#menu");
      menuSensores.style.display = 'none';
    });
     // botón de guardar
    const saveMenuButton = document.querySelector("#saveInterface");
    saveMenuButton.addEventListener('click', ()=>{
      
      const figureData = interfazProgCanvas.export();
      // si las conexiones son válidas, se guarda y se cierra
      if(checkValues(figureData)){
        exportFigure();
        const menuSensores = document.querySelector("#menu");
        menuSensores.style.display = 'none';
      } // En el caso de que haya algún error se pone un alert para avisar al usuario
    });
    //botón de zoomOut  
    const zoomOutCanvasButton = document.querySelector("#zoomOutCanvasButton");
    zoomOutCanvasButton.addEventListener('click', ()=>{
      interfazProgCanvas.zoom_out();
    });
    //botón de zoomIn
    const zoomInCanvasButton = document.querySelector("#zoomInCanvasButton");
    zoomInCanvasButton.addEventListener('click', ()=>{
      interfazProgCanvas.zoom_in();
    });
    //botón de zoomReset
    const zoomResetCanvasButton = document.querySelector("#zoomResetCanvasButton");
    zoomResetCanvasButton.addEventListener('click', ()=>{
      interfazProgCanvas.zoom_reset();
    });

    // EVENTOS
    // Controlar que las conexiones sean correctas
    interfazProgCanvas.on('connectionCreated', (event)=> {
      checkConnection(event.output_id, event.input_id);
      resetPaintOptions();
    });

    interfazProgCanvas.on('connectionStart', (event)=>{
      console.log("Connection Start");
      paintOptions(event.output_id);

    });

    interfazProgCanvas.on('nodeSelected', (id)=>{
      console.log("Node Selected");
      paintOptions(id);
    });
    
    interfazProgCanvas.on('connectionCancel', ()=>{
      console.log("Connection Cancel");
      resetPaintOptions();
    });
    
    interfazProgCanvas.on('nodeUnselected', ()=>{
      console.log("Node Unselected");
      resetPaintOptions();
    });

    // gestorFiguras.initGestor();
  }

  // Pinta las opciones de conexión para ese el nodo seleccionado
  function paintOptions(id){
    console.log("TODO: paintOptions");
    console.log(id);
    console.log(typeof id);
    id = parseInt(id)

    // permite seleccionar la parte coloreable del 
    // const test = document.querySelector(`#node-${id}`).childNodes[1].firstChild;

    // test.classList.add("invalidNode");

    // console.log(test);

    if(id < 6){
      for (let i = 6; i < 16; i++) {
        const node = document.querySelector(`#node-${i}`);
        node.childNodes[1].firstChild.classList.add("invalidNode");
      }
    }else{
      // Queda raro 


      // for (let i = 1; i < 6; i++) {
      //   const node = document.querySelector(`#node-${i}`);
      //   node.childNodes[1].firstChild.classList.add("invalidNode");
      // }
    }

    switch(id){
      case 1:
        document.querySelector(`#node-`+6).childNodes[1].firstChild.classList.add("validNode");
        break;
      case 2:
        for (let i = 7; i < 13; i++) {
          const node = document.querySelector(`#node-${i}`);
          node.childNodes[1].firstChild.classList.add("validNode");
        }
        break;
      case 3:
        for (let i = 13; i < 16; i++) {
          const node = document.querySelector(`#node-${i}`);
          node.childNodes[1].firstChild.classList.add("validNode");
        }
        break;
      case 4:
        for (let i = 13; i < 16; i++) {
          const node = document.querySelector(`#node-${i}`);
          node.childNodes[1].firstChild.classList.add("validNode");
        }
        break;
      default:
        for (let i = 13; i < 16; i++) {
          const node = document.querySelector(`#node-${i}`);
          node.childNodes[1].firstChild.classList.add("validNode");
        }
        break;
    }

    // queda raro lo de cambiar el color de los sensores

    // switch(id){
    //   case 1:
    //     document.querySelector(`#node-`+6).childNodes[1].firstChild.classList.add("validNode");
    //     break;
    //   case 2:
    //     for (let i = 7; i < 13; i++) {
    //       const node = document.querySelector(`#node-${i}`);
    //       node.childNodes[1].firstChild.classList.add("validNode");
    //     }
    //     break;
    //   case 3:
    //     for (let i = 13; i < 16; i++) {
    //       const node = document.querySelector(`#node-${i}`);
    //       node.childNodes[1].firstChild.classList.add("validNode");
    //     }
    //     break;
    //   case 4:
    //     for (let i = 13; i < 16; i++) {
    //       const node = document.querySelector(`#node-${i}`);
    //       node.childNodes[1].firstChild.classList.add("validNode");
    //     }
    //     break;
    //   case 5:
    //     for (let i = 13; i < 16; i++) {
    //       const node = document.querySelector(`#node-${i}`);
    //       node.childNodes[1].firstChild.classList.add("validNode");
    //     }
    //     break;
    //   case 6:
    //     document.querySelector(`#node-`+1).childNodes[1].firstChild.classList.add("validNode");
    //     break;
    //   case 7:
    //     document.querySelector(`#node-`+2).childNodes[1].firstChild.classList.add("validNode");
    //     break;
    //   case 8:
    //     document.querySelector(`#node-`+2).childNodes[1].firstChild.classList.add("validNode");
    //     break;
    //   case 9:
    //     document.querySelector(`#node-`+2).childNodes[1].firstChild.classList.add("validNode");
    //     break;
    //   case 10:
    //     document.querySelector(`#node-`+2).childNodes[1].firstChild.classList.add("validNode");
    //     break;
    //   case 11:
    //     document.querySelector(`#node-`+2).childNodes[1].firstChild.classList.add("validNode");
    //     break;
    //   case 12:
    //     document.querySelector(`#node-`+2).childNodes[1].firstChild.classList.add("validNode");
    //     break;
    //   case 13:
    //     for (let i = 3; i < 6; i++) {
    //       const node = document.querySelector(`#node-${i}`);
    //       node.childNodes[1].firstChild.classList.add("validNode");
    //     }
    //     break;
    //   case 14:
    //     for (let i = 3; i < 6; i++) {
    //       const node = document.querySelector(`#node-${i}`);
    //       node.childNodes[1].firstChild.classList.add("validNode");
    //     }
    //     break;
    //   // default = 15, el último nodo vaya
    //   default:
    //     for (let i = 3; i < 6; i++) {
    //       const node = document.querySelector(`#node-${i}`);
    //       node.childNodes[1].firstChild.classList.add("validNode");
    //     }
    //     break;
    // }

  }

  // Elimina las indicaciones que se hayan pintado
  function resetPaintOptions(){
    const figureData = interfazProgCanvas.export().drawflow.Home.data;

    let i = 1;
    for (let key in figureData) {
      const node = document.querySelector(`#node-${i}`);
      node.childNodes[1].firstChild.classList.remove("invalidNode");
      node.childNodes[1].firstChild.classList.remove("validNode");
      i++;
    }
  }

  function exportFigure(){
    const figureData = interfazProgCanvas.export();
    gestorBD.updateElement(editor.selected.uuid, figureData);

    // actualizar las conexiones en el gestor de figuras al guardar en la interfaz 
    gestorFiguras.updateConnectionsGestorFiguras();
  }

  function importFigure(){
    // en el caso de que no se haya iniciado la interfaz, se inicializa
    if(!initialize) initInterface();

    // FIREBASE
    gestorBD.getElement(editor.selected.uuid).then((figureData)=>{
      interfazProgCanvas.import(figureData);
    });
    
  }

  // Se encarga de comprobar que las conexiones son válidas
  function checkValues(figureData){
    let noError = true;
    // se recorren los nodos de sensores
    for(let i = 1; i < 6; i++){
      const connections = figureData.drawflow.Home.data[i].outputs.output_1.connections
      if(connections.length > 0){
        connections.forEach(ele =>{
          // si se detecta un error, se indica en la variable
          if(!checkConnection(i, ele.node)) {
            noError = false
          }
        })
      }
    }
    return noError;
  }

  // comprueba si la conexión entre el outNode e inNode es correcto según las reglas definidas
  function checkConnection(outNode, inNode){
    const errorText = "Connection invalid, please remove it";
    if(outNode == 1 && inNode != 6){
      alert(errorText + "\n" +`Nodes: ${nodeNames[outNode]}, ${nodeNames[inNode]}`);
      return false;
    }
    else if(outNode == 2 && !(inNode == 7 || inNode == 8 || inNode == 9 || inNode == 10 || inNode == 11 || inNode == 12)){
      alert(errorText + "\n" +`Nodes: ${nodeNames[outNode]}, ${nodeNames[inNode]}`);
      return false;
    }
    else if(outNode == 3 || outNode == 4 || outNode == 5){
      if(inNode != 13 && inNode != 14 && inNode != 15){
        alert(errorText + "\n" +`Nodes: ${nodeNames[outNode]}, ${nodeNames[inNode]}`);
        return false
      }
      if(!checkGyros(outNode, inNode)){
        alert(errorText + "\n" +`Nodes: ${nodeNames[outNode]}, ${nodeNames[inNode]}`);
        return false;
      }
    }
    return true;
  }

  function checkGyros(outNode, inNode){
    const figureData = interfazProgCanvas.export();
    // si tiene asociado más de una conexión no es válido
    if(figureData.drawflow.Home.data[parseInt(outNode)].outputs.output_1.connections.length != 1){
      return false
    }
    // Falta comprobar evitar asociar dos gyros al mismo rotation
    if(figureData.drawflow.Home.data[parseInt(inNode)].inputs.input_1.connections.length != 1){
      return false
    }
    return true
  }

  return {
      exportFigure: function() {
        exportFigure();
      },
      importFigure: function(){
        importFigure();
      },
  };

})();


