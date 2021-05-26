import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { useEffect } from "react";
import { useHistory } from "react-router";
import { isLoggedInVar, logUserOut } from "../../apollo";

const ME_QUERY = gql`
    query me {
        me {
            id
            username
            avatar
        }
    }
`;

// token을 가지고 있지 않으면 해당 메서드느 실행되지 않음
function useUser(){
    const history = useHistory();
    const hasToken = useReactiveVar(isLoggedInVar);
    const { data } = useQuery(ME_QUERY, {
        skip: !hasToken
    });
    useEffect(() => {

        if(data?.me === null){
            console.log("LocalStorage에 token이 존재하지만, token이 Back-end에서는 작동하지 않음");
            logUserOut(history);
        }
    }, [data]);

    return { data };
}

export default useUser;