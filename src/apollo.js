import { ApolloClient, createHttpLink, InMemoryCache, makeVar } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";


const TOKEN = "token";
const DARK_MODE = "DARK_MODE";

export const isLoggedInVar = makeVar(Boolean(localStorage.getItem(TOKEN)));

// localStorage에 token 추가
export const logUserIn = (token) => {
    localStorage.setItem(TOKEN, token);
    isLoggedInVar(true);
}

// localStorage에 token 삭제
export const logUserOut = (history) => {
    localStorage.removeItem(TOKEN);
    isLoggedInVar(false);
    history.replace();
    window.location.reload();
}

export const darkModeVar = makeVar(Boolean(localStorage.getItem(DARK_MODE)));

export const enableDarkMode = () => {
    localStorage.setItem(DARK_MODE, "enabled");
    darkModeVar(true);
}

export const disableDarkMode = () => {
    localStorage.removeItem(DARK_MODE);
    darkModeVar(false);
}

const httpLink = createHttpLink({
    uri: "http://localhost:4000/graphql"
});

const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            token:localStorage.getItem(TOKEN),
        }
    }
});

export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});
