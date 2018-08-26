import {Record} from 'immutable';

class User extends Record({userName: '', isLoggedIn: false, isCommittee: false, name:'', id:-1}){
}
export default User;