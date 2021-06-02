import {defaultDataInterface} from './default.js';

// import { firebase } from '../../firebase/app' ;

import { gestorFiguras } from './gestorFiguras.js'

export const gestorBD = (function () {

  // Almacena la información del grafo de conexiones de cada figura
  let figures = {};

  const fileName = "sensorsConfig.json";

  let db;

  function insertElement(uuid){

    // FIREBASE
    return new Promise((resolve, reject) => {
      resolve(
        getAllElements().then((figures)=>{

          if(figures != null){
            
            figures = JSON.parse(figures)

          }else{
            figures = {}
          }
    
          // si no existe lo crea
          if(!(uuid in figures)){
            figures[uuid] = defaultDataInterface;
          }
    
          updateFile(figures);
          return figures[uuid];
        })
      )
    })
  }
  
  function deleteElement(uuid){

    // FIREBASE
    getAllElements().then((figures)=>{

      figures = JSON.parse(figures);

      delete figures[uuid];
      updateFile(figures);
    });
    
  }
  
  function updateElement(uuid, data){

    // FIREBASE
    getAllElements().then((figures)=>{

      figures = JSON.parse(figures)

      // for (const key in figures) {
      //   figures[key].drawflow.Home.data = {... figures[key].drawflow.Home.data}
      // }

      figures[uuid] = data;
      updateFile(figures);
    });
    
  }

  function getElement(uuid){
       
    // FIREBASE
    return new Promise((resolve, reject) =>{
      resolve(
        getAllElements().then((value)=>{

          value = JSON.parse(value)

          // Para evitar la conversión que hace Fireabase
          for (const key in value) {
            value[key].drawflow.Home.data = {... value[key].drawflow.Home.data}
          }

          // console.log(value);
          if(value != null){
            // console.log("No es NULL value");
            if(uuid in value){
  
              return value[uuid]
            }
          }

          // si no existía el elemento, se inserta en la base de datos y se devuelve
          return insertElement(uuid).then(inserted => inserted);
        
        })
      )
    });
    
  }

  // lee del archivo y devuelve los datos en forma de objeto  
  function getAllElements(){

    // Si no se ha iniciado la DB, se inicializa
    if(db === undefined){
      db = firebase.database();
    }

    const figuresRef = db.ref().child('figures'); //db.ref();

    // FIREBASE V2
    return new Promise((resolve, reject) => {
      const onError = error => reject(error);
      const onData = snap => resolve(snap.val());
  
      figuresRef.once("value", onData, onError);
    });

  }

  function updateFile(figures){
    // Si no se ha iniciado la DB, se inicializa
    if(db === undefined){
      db = firebase.database();
    }

    const figuresRef = db.ref();

    figures = JSON.stringify(figures);

    figuresRef.set({ figures });

    // actualizar las conexiones en el gestor de figuras al guardar en la interfaz 
    gestorFiguras.updateConnectionsGestorFiguras();
  }

  return {
      // insertElement: function(uuid){
      //   insertElement(uuid)
      // },
      deleteElement: function(uuid){ 
        deleteElement(uuid)
      },
      updateElement: function(uuid, data){
        updateElement(uuid, data)
      },
      getElement: function(uuid){
        return getElement(uuid)
      },
      getRelations: function(){
        return getAllElements()
      }
  };

})();
