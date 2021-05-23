import { Spin, Typography } from 'antd';
import Layout, { Content, Header } from 'antd/lib/layout/layout';
import styled from 'styled-components';
import Aside from '../sidebar/Aside';
import Taskbar from '../taskboard/Taskbar';
//import { colors } from '../shared/SharedUtSils';
import Taskboard from '../taskboard/Taskboard';
import '../styles/style.scss';
import AppContext from '../shared/AppContext';
import { Dispatch, SetStateAction, useState } from 'react';

const StyledLayout = styled(Layout)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const StyledHeader = styled(Header)`
  display: flex;
  align-items: center;
  background-color: #fff;
`;

const StyledContent = styled(Content)`
  background-color: #fff;
  height: 100%;
`;

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

function App() {
  let [isLoading, setIsLoading] = useState(false);
  let [isLoggedIn, setIsLoggedIn] = useState(false);
  let [allJobTitles, setAllJobTitles] = useState([] as string[]);
  let [filteredJobTitles, setFilteredJobTitles] = useState([] as string[]);

  const userValues: Context = {
    isLoading,
    setIsLoading,
    isLoggedIn,
    setIsLoggedIn,
    allJobTitles,
    setAllJobTitles,
    filteredJobTitles,
    setFilteredJobTitles,
  };
  return (
    <AppContext.Provider value={userValues}>
      <StyledLayout>
        <div className="app">
          <Aside></Aside>
          <div className="drag-drop-container">
              <StyledHeader>
                <Typography.Title level={3}>Track</Typography.Title>
              </StyledHeader>
              <StyledContent>
                <Spin style={{
                  height: '100%'
                }} size="large" spinning={userValues.isLoading}>
                  <Taskbar />
                  <Taskboard />
                </Spin>
              </StyledContent>
            
          </div>
        </div>
      </StyledLayout>
    </AppContext.Provider>
  );
}

export default App;
