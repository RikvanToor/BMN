import { Record } from 'immutable';

class User extends Record({
  userName: '', isLoggedIn: false, isCommittee: false, name: '', id: -1, email:''
}) {
}
export default User;
