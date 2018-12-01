import { Store } from 'flux/utils';
import AppDispatcher from '@Services/AppDispatcher.js';

export default class BmnStore extends Store{
  constructor(dispatcher, storeName){
    super(dispatcher);
    this.flashes = {};
    this.storeName = storeName;
    this.FLASH_ACTION = storeName + '_UPDATE_FLASH';
  }
  handleFlashUpdate(payload){
    this[payload.key] = payload.val;
    this.__emitChange();
  }
  
  setFlash(key, value, timeTillResetInSeconds, resetValue='', doEmitChange=true){
    //Clear previous
    if(key in this.flashes){
      clearTimeout(this.flashes[key]);
    }
    
    this.flashes[key] = setTimeout(()=>{
      this[key] = resetValue;
      AppDispatcher.dispatch({action: this.FLASH_ACTION, key: key, val: resetValue});
    },
      timeTillResetInSeconds*1000
    );
    
    //Set the value on the store
    this[key] = value;
    
    //Emit change if required. Helpful when setting multiple flashes
    if(doEmitChange) this.__emitChange();
  }
};