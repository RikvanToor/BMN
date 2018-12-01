import {Record} from 'immutable';

export default class UserDataRecord extends Record({name:'',username:'',password:'',passwordConfirm:'',email:''}){
  toCreatableUser(){
    return {
          username : this.username,
          name: this.name,
          password : this.password,
          email: this.email,
          'is_active': true
        };
  }
  setIfExists(data, key, targetKey){
    if(key in data){
      return this.set(targetKey, data[key]);
    }
  }
  arePasswordsConsistent(){
    return this.password === this.passwordConfirm;
  }
};