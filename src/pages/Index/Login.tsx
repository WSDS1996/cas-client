import { ChangeEvent, ForwardedRef, useContext, useState } from 'react';
import { FormContainer, Form, Input, ForgetPassword, Button } from './style';
import http from '../../utils/http';
import { contextUser, ACTION_TYPE } from '../../store';

export default function Login() {
  type loginFormType = {
    email: string;
    password: string;
    callbackUrlParam?: string;
  };
  const [loginForm, setLoginForm] = useState<loginFormType>({ email: '', password: '' });
  const { dispatchUserStore, userStore } = useContext(contextUser);

  const handleFormChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    setLoginForm((pre) => ({
      ...pre,
      [name]: value,
    }));
  };

  const handleSignIn = () => {
    if (!loginForm.email || !loginForm.password) {
      userStore.showAlert('email and password cannot be empty');
      return;
    }
    const url = window.location.search;
    const regex = /callbackUrl=([^&]+)/;
    const match = url.match(regex);
    const callbackUrlParam = match && match[1];
    if(callbackUrlParam){
      loginForm.callbackUrlParam = callbackUrlParam
    }
    http('post', '/user/login', loginForm).then((res) => {
      if (res.code === 0) {
        console.log(res);
        if(res.callbackUrl!==''){
          window.location.href = res.callbackUrl
        }
        setLoginForm({ email: '', password: '' });
        dispatchUserStore!({ type: ACTION_TYPE.UPDATE_USER, payload: res.data });
      } else {
        userStore.showAlert(res.message);
      }
    });
  };

  return (
    <FormContainer id="sign-in-container">
      <Form>
        <h2>sign in</h2>
        <Input
          type="email"
          name="email"
          id="l-email"
          value={loginForm.email}
          onChange={handleFormChange}
          placeholder="Email..."
        />
        <Input
          type="password"
          name="password"
          id="l-password"
          value={loginForm.password}
          onChange={handleFormChange}
          placeholder="Password..."
        />
        <ForgetPassword href="#" className="forget-password">
          forget password?
        </ForgetPassword>
        <Button id="signIn" onClick={handleSignIn}>
          sign in
        </Button>
      </Form>
    </FormContainer>
  );
}
