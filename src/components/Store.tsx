import React, { createContext, useReducer, useContext } from "react";
import { NominatimResponse } from "../js/nominatimResponse";

interface State {
  nominatimCache: Record<string, NominatimResponse>;
}

type Action = {
  type: "addToNominatimCache";
  payload: { key: string; value: NominatimResponse };
};

const StoreContext = createContext<
  { state: State; dispatch: React.Dispatch<Action> } | undefined
>(undefined);

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "addToNominatimCache":
      return {
        ...state,
        nominatimCache: {
          ...state.nominatimCache,
          [action.payload.key]: action.payload.value,
        },
      };
    default:
      return state;
  }
}

interface StoreProviderProps {
  children: React.ReactNode;
}

export const StoreProvider = ({ children }: StoreProviderProps) => {
  const [state, dispatch] = useReducer(reducer, { nominatimCache: {} });

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
