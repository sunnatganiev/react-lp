import { createContext, useEffect, useReducer, useState } from "react";
import {
  createUserDocumentFromAuth,
  onAuthStateChangedListener,
} from "../utils/firebase/firebase.utils";

export const USER_ACTION_TYPES = {
  SET_CURRENT_USER: "SET_CURRENT_USER",
};

export const UserContext = createContext({
  currentUser: null,
});

const INITIAL_STATE = {
  currentUser: null,
};

const userReducer = (state, action) => {
  switch (action.type) {
    case USER_ACTION_TYPES.SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
      };
    default:
      throw new Error(`Unhandled type ${action.type} in userReducer`);
  }
};

export const UserProvider = ({ children }) => {
  const [{ currentUser }, dispatch] = useReducer(userReducer, INITIAL_STATE);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      if (user) {
        createUserDocumentFromAuth(user);
      }

      dispatch({ type: USER_ACTION_TYPES.SET_CURRENT_USER, payload: user });
    });

    return unsubscribe;
  }, []);

  const value = { currentUser };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
