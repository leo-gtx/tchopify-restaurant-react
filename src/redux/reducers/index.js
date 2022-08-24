import { combineReducers } from 'redux';
import { persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authedUser from './authedUser';
import restaurants from './restaurants';
import categories from './categories';
import app from './app';
import dishes from './dishes';
import staffs from './staffs';
import dashboard from './dashboard';

const rootPersistConfig = {
    key:'root',
    storage,
  }
export default persistReducer(
    rootPersistConfig,
    combineReducers({
    authedUser,
    restaurants,
    categories,
    app,
    dishes,
    staffs,
    dashboard,
    }) 
)
