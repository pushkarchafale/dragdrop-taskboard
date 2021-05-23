import { Button } from 'antd';
import { useContext } from 'react';
import styled from 'styled-components';
import AppContext from '../shared/AppContext';
import { TaskFilterSelect } from './TaskFilterSelect';

const TaskbarMenu = styled.div`
  border-top: 1px solid #e9eef2;
  border-bottom: 1px solid #e9eef2;
  padding: 5px 0px;
  width: 100%;
  margin: auto;
`;

function Taskbar() {
  let appContext = useContext(AppContext);

  const onLoginClick = () => {
    appContext.setIsLoggedIn(!appContext.isLoggedIn);
  };
  return (
    <TaskbarMenu>
      <TaskFilterSelect></TaskFilterSelect>
      <Button id="loginBtn" type="primary" onClick={onLoginClick}>
        {appContext.isLoggedIn ? 'Logout' : 'Login'}
      </Button>
    </TaskbarMenu>
  );
}

export default Taskbar;
