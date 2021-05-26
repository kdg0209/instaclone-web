import { faFacebookSquare, faInstagram, } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import routes from "./routes";
import AuthLayout from "./components/auth/AuthLayout";
import Button from "./components/auth/Button";
import Separator from "./components/auth/Separator";
import Input from "./components/auth/Input";
import FormBox from "./components/auth/FormBox";
import BottomBox from "./components/auth/BottomBox";
import PageTitle from "./components/PageTitle";
import { useForm } from "react-hook-form";
import FormError from "./components/auth/FormError";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { logUserIn } from "../apollo";
import { useLocation } from "react-router";

const FacebookLogin = styled.div`
  color: #385285;
  span {
    margin-left: 10px;
    font-weight: 600;
  }
`;

const Notification = styled.div`
  color: #2ecc71;
`;

const LOGIN_MUTATION = gql`
  mutation login($username:String!, $password:String!) {
    login(username:$username, password:$password) {
      result
      error
      token
    }
  }
`;

function Login() {
  const location = useLocation();
  const { register, handleSubmit, errors, formState, getValues, setError, clearErrors } = useForm({
    mode: "onChange",
    defaultValues: {
      username: location?.state?.username || "",
      password: location?.state?.password || ""
    }
  });

  const onCompleted = (data) => {
    const { login: {result, error, token } } = data;

    if(!result){
      return setError("result", {
        message: error
      });
    }

    if(token){
      logUserIn(token);
    }
  }
  const [login, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted
  });
  const onSubmitValid = (data) => {
    if(loading){
        return;
    }
    const { username, password } = getValues();
    login({
      variables: {
        username,
        password
      }
    })
  }

  const clearLoginError = () => {
    clearErrors("result");
  }

  return (
      <AuthLayout>
          <PageTitle title="Login"/>
          <FormBox>
            <div>
              <FontAwesomeIcon icon={faInstagram} size="3x" />
            </div>
            <Notification>
              {location?.state?.message}
            </Notification>
            <form onSubmit={handleSubmit(onSubmitValid)}>
              <Input ref={register({
                      required: "유저명은 필수입니다.",
                      minLength: {
                        value: 5,
                        message:"유저명이 너무 짧습니다."
                      },
                     })} 
                     onChange={clearLoginError}
                     name="username" 
                     type="text" 
                     placeholder="Username"
                     hasError={Boolean(errors?.username?.message)}
              />
              <FormError message={ errors?.username?.message } /> 
              <Input ref={register({
                      required: "비밀번호는 필수입니다."
                     })} 
                     onChange={clearLoginError}
                     name="password" 
                     type="password" 
                     placeholder="Password" 
                     hasError={Boolean(errors?.password?.message)}
              />
              <FormError message={ errors?.password?.message } /> 
              <Button type="submit" 
                      value={loading ? "Loading...":"Log in"} 
                      disabled={!formState.isValid || loading} />

              <FormError message={ errors?.result?.message } /> 
            </form>
            <Separator />
            <FacebookLogin>
              <FontAwesomeIcon icon={faFacebookSquare} />
              <span>Log in with Facebook</span>
            </FacebookLogin>
          </FormBox>
          <BottomBox cta="Don't have an account?" 
                     link={routes.signUp} 
                     linkText="Sign up" />
      </AuthLayout>
    );
  }
  export default Login;