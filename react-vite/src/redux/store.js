import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import eventsReducer from "./event";
import userReducer from './user';
import groupReducer from './group';
import friendReducer from './friends';
import eventReducer from "./events";
import rsvpsReducer from "./rsvp";

  const rootReducer = combineReducers({
    session: sessionReducer,
    user: userReducer,
    events: eventsReducer,
    group: groupReducer,
    friends: friendReducer,
    event: eventReducer,
    rsvps: rsvpsReducer,
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
