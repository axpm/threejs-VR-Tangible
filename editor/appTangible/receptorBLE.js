export const receptorBLE = (function () {

  const BLUE_SERVICE = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
  const BLUE_CHAR_RX = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

  // Selected device object cache
  let deviceCache = null;

  let counter = 0;

  let sensors = ["", "", "", "", ""];

  // sirve para almacenar los valores parciales y controlar errores al recibir los datos
  let sensoresIte = ["", "", "", "", ""]; 
  let error = false;

  let connected = false;

  let receivedNotifications = false;

  // Launch Bluetooth device chooser and connect to the selected
  function connect() {
    return (deviceCache ? Promise.resolve(deviceCache) :
        requestBluetoothDevice()).
        then(device => connectDeviceAndCacheCharacteristic(device)).
        then(characteristic => startNotifications(characteristic)).
        catch(error =>{
          console.log(error)
          alert("Couldn't connect!! Try again in a few seconds.")
        } );
  }

  function requestBluetoothDevice() {
    console.log('Requesting bluetooth device...');

    return navigator.bluetooth.requestDevice({
      filters: [{services: [BLUE_SERVICE]}],
    }).
        then(device => {
          console.log('"' + device.name + '" bluetooth device selected');
          deviceCache = device;

          return deviceCache;
        });
  }

  function handleDisconnection(event) {
    let device = event.target;

    console.log('"' + device.name +
        '" bluetooth device disconnected, trying to reconnect...');

    connectDeviceAndCacheCharacteristic(device).
        then(characteristic => startNotifications(characteristic)).
        catch(error => console.log(error));
  }


  // Characteristic object cache
  let characteristicCache = null;

  // Connect to the device specified, get service and characteristic
  function connectDeviceAndCacheCharacteristic(device) {
    if (device.gatt.connected && characteristicCache) {
      return Promise.resolve(characteristicCache);
    }

    console.log('Connecting to GATT server...');

    return device.gatt.connect().
        then(server => {
          console.log('GATT server connected, getting service...');

          return server.getPrimaryService(BLUE_SERVICE);
        }).
        then(service => {
          console.log('Service found, getting characteristic...');

          return service.getCharacteristic(BLUE_CHAR_RX);
        }).
        then(characteristic => {
          console.log('Characteristic found');
          characteristicCache = characteristic;

          connected = true;

          return characteristicCache;
        });
  }


  // Enable the characteristic changes notification
  function startNotifications(characteristic) {
    console.log('Starting notifications...');

    return characteristic.startNotifications().
        then(() => {
          console.log('Notifications started');
          // Added line
          characteristic.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged);

          // Comprobar si funcionan las notificaciones
          setTimeout( checkNotifications, 1000);

        });
  }

  function disconnect() {
    if (deviceCache) {
      console.log('Disconnecting from "' + deviceCache.name + '" bluetooth device...');
      deviceCache.removeEventListener('gattserverdisconnected',
          handleDisconnection);

      if (deviceCache.gatt.connected) {
        deviceCache.gatt.disconnect();
        connected = false;
        console.log('"' + deviceCache.name + '" bluetooth device disconnected');
      }
      else {
        console.log('"' + deviceCache.name +
            '" bluetooth device is already disconnected');
      }
    }
    
    // Added condition
    if (characteristicCache) {
      characteristicCache.removeEventListener('characteristicvaluechanged',
      handleCharacteristicValueChanged);
      characteristicCache = null;
    }
    
    receivedNotifications = false;
    deviceCache = null;
  }

  // Data receiving
  function handleCharacteristicValueChanged(event) {
    
    let receivedData = [];
    console.log(event.target.value.byteLength);
    if(event.target.value.byteLength == 20){

      // se ha recibido datos
      // console.log("HA LLEGADO ALGO");
      receivedNotifications = true; 

      for (let i = 0; i < event.target.value.byteLength; i++) {
        receivedData[i] = event.target.value.getUint8(i);
      }
  
      const receivedString = String.fromCharCode.apply(null, receivedData);
      // console.log("receivedString: ", receivedString , "length ", receivedString.length);
  
      let object = {};
      object[`${getNameFromStr(receivedString)}`] = getValueFromStr(receivedString)
      sensoresIte[counter] = object;

    }// si los datos son menores de 20 caracteres ha habido un error en esta iteración
    else{
      error = true
    }
    counter += 1
    if(counter == 5){
      // si NO hay error en los datos, se guardan
      if(!error){
        sensors = sensoresIte;
        // console.log("NO ERROR");
        // console.log("sensors");
        // console.log(sensors);
      }
      counter = 0;
    }
   
  }

  function getNameFromStr(str){
    return str.split(":")[0];
  }

  function getValueFromStr(str){
    // console.log(parseFloat(str.split(":")[1]));
    return parseFloat(str.split(":")[1]);
  }

  function getSensors(){
    // console.log("GET SENSORS");
    // console.log(sensors);
    return sensors;
  }

  // Se encarga de comprobar si 
  function checkNotifications() {
    // console.log("HOLAAAAAA");
    // console.log(receivedNotifications);
    // si no se ha conectado, se desconecta y salta error
    if(!receivedNotifications){
      alert("Error with the device.\nRefresh the page");
      disconnect();
    }
  }


  return {
      getSensors: function () {
        return getSensors();
      },
      connect: function(){
        connect();
      },
      disconnect: function(){
        disconnect();
      },
      getConnected: function(){
        return connected;
      }
  };

})();

