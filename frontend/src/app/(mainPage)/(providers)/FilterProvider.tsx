"use client";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from "react";
import { FilterData } from "../(model)/types";

export const defaultFilterValues = {
  prices: [],
  brands: [],
  colors: [],
  discounts: [],
};

type ContextType =
  | {
      filter: FilterData;
      setFilter: Dispatch<SetStateAction<FilterData>>;
      setShowFilter: Dispatch<SetStateAction<boolean>>;
      showFilter: boolean;
      toggleFilter: () => void;
    }
  | undefined;
export const FilterContext = createContext<ContextType>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filter, setFilter] = useState<FilterData>(defaultFilterValues);
  const [showFilter, setShowFilter] = useState<boolean>(true);

  const toggleFilter = useCallback(() => {
    setShowFilter((prev) => !prev);
  }, [setShowFilter]);

  return (
    <FilterContext.Provider value={{ filter, setFilter, showFilter, toggleFilter, setShowFilter }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);

  if (!context) {
    throw new Error("useFilter should be used in FilterProvider!");
  }

  return context;
};
