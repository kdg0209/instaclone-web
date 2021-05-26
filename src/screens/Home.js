import { useQuery, gql } from "@apollo/client";
import { useHistory } from "react-router";
import Photo from "./components/feed/Photo";
import PageTitle  from "../screens/components/PageTitle";

const FEED_QUERY = gql`
    query seeFeed {
        seeFeed {
            id
            user {
                username
                avatar
            }
            file
            caption
            likes
            createdAt
            isMine
            isLiked
        }
    }
`;

function Home() {
    const history = useHistory();
    const { data } = useQuery(FEED_QUERY);

    return (
        <div>
            <PageTitle title="Home" />
            { data?.seeFeed?.map(photo => <Photo key={photo.id} {...photo}/> )}
        </div>
    );
}

export default Home;