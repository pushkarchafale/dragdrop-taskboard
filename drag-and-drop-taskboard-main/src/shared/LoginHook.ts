import { useEffect, useState } from 'react';
import { useSyncedState } from './SharedHooks';

export function LoginState() {
  let [isLoggedIn, setIsLoggedIn] = useSyncedState('isLoggedIn', false, false);
  let [loginState, setLoginState] = useState(isLoggedIn);

  useEffect(() => {
    setIsLoggedIn(loginState);
  }, [loginState, setIsLoggedIn]);

  return [loginState, setLoginState];
}
