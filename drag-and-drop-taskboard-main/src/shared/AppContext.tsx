import React, { Dispatch, SetStateAction } from 'react';

type Context = {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
  allJobTitles: string[];
  setAllJobTitles: Dispatch<SetStateAction<string[]>>;
  filteredJobTitles: string[];
  setFilteredJobTitles: Dispatch<SetStateAction<string[]>>;
};

const initialContext: Context = {
  isLoading: false,
  setIsLoading: (): void => {
    throw new Error('setIsLoggedIn function must be overridden');
  },
  isLoggedIn: false,
  setIsLoggedIn: (): void => {
    throw new Error('setIsLoggedIn function must be overridden');
  },
  allJobTitles: [],
  setAllJobTitles: (): void => {
    throw new Error('setAllJobTitles function must be overridden');
  },
  filteredJobTitles: [],
  setFilteredJobTitles: (): void => {
    throw new Error('setAllJobTitles function must be overridden');
  },
};

const AppContext = React.createContext(initialContext);

export default AppContext;
