import { faInstagram, } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import routes from "./routes";
import AuthLayout from "./components/auth/AuthLayout";
import Button from "./components/auth/Button";
import Input from "./components/auth/Input";
import FormBox from "./components/auth/FormBox";
import BottomBox from "./components/auth/BottomBox";
import styled from "styled-components";
import { FatLink } from "./components/shared";
import PageTitle from "./components/PageTitle";
import { useForm } from "react-hook-form";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { useHistory } from "react-router";
import FormError from "./components/auth/FormError";

const HeaderContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const SubTitle = styled(FatLink)`
    font-size: 16px;
    text-align: center;
    margin-top: 10px;
`;

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount($firstName:String!, $lastName:String, $username:String!, $email:String!, $password:String!) {
    createAccount(firstName: $firstName, lastName: $lastName, username: $username, email: $email, password: $password) {
      result
      error
    }
  }

`;

function SignUp() {
    const history = useHistory();

    const onCompleted = (data) => {
      const { username, password } = getValues();
      const {createAccount: {result, error}} = data;

      if(!result){
        return;
      }

      //가입 완료 되면 홈으로 redirect
      history.push(routes.home, { 
                  message: "Account created. Plz log in.",
                  username,
                  password
                }); 
    }

    const [createAccount, { loading }] = useMutation(CREATE_ACCOUNT_MUTATION, {
      onCompleted
    });

    const { register, handleSubmit, errors, formState, getValues } = useForm({
      mode: "onChange"
    });
    const onSubmitValid = (data) => {
        if(loading){
            return;
        }

        createAccount({
          variables: {
            ...data
          }
        });
    }
    return (
      <AuthLayout>
          <PageTitle title="Sign Up" />
          <FormBox>
            <HeaderContainer>
              <FontAwesomeIcon icon={faInstagram} size="3x" />
              <SubTitle> 친구들의 사진과 동영상을 보려면 가입하세요. </SubTitle>
            </HeaderContainer>
            <form onSubmit={handleSubmit(onSubmitValid)}>
              <Input ref={register({
                      required: "First Name is required",
                     })} 
                     type="text" 
                     name="firstName" 
                     hasError={Boolean(errors?.firstName?.message)}
                     placeholder="First Name" />
              <FormError message={ errors?.firstName?.message } />
              <Input ref={register()}
                     type="text" 
                     name="lastName" 
                     placeholder="Last Name" />
              <Input ref={register({
                      required: "User Name is required",
                      minLength: {
                        value: 5,
                        message: "유저명이 너무 짧습니다."
                      }
                     })} 
                     type="text" 
                     name="username" 
                     hasError={Boolean(errors?.username?.message)}
                     placeholder="User Name" />
              <FormError message={ errors?.username?.message } />
              <Input ref={register({
                      required: "Email is required",
                     })} 
                     type="text" 
                     name="email" 
                     hasError={Boolean(errors?.email?.message)}
                     placeholder="Email" />
              <FormError message={ errors?.email?.message } />
              <Input ref={register({
                      required: "Password is required",
                     })} 
                     type="password" 
                     name="password" 
                     hasError={Boolean(errors?.password?.message)}
                     placeholder="Password" />
              <FormError message={ errors?.password?.message } />Q
              <Button type="submit" 
                      value={loading ? "Loading...":"Sign Up"} 
                      disabled={!formState.isValid || loading} />
            </form>
          </FormBox>
          <BottomBox cta="Have an acoount?" 
                     link={routes.home} 
                     linkText="Log in" />
      </AuthLayout>
    );
  }
  export default SignUp;