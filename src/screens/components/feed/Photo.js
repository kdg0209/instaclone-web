import PropTypes from "prop-types";
import {
    faBookmark,
    faComment,
    faHeart,
    faPaperPlane,
  } from "@fortawesome/free-regular-svg-icons";
import { faHeart as SolidHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import Avatar from "../Avatar";
import { FatText } from "../shared";
import { gql, useMutation } from "@apollo/client";

const TOGGLE_LIKE_MUTATION = gql`
    mutation toggleLike($id: Int!) {
        toggleLike(id: $id) {
            result
            error
        }
    }
`;

const PhotoContainer = styled.div`
    background-color: white;
    border: 1px solid ${(props) => props.theme.borderColor};
    margin-bottom: 20px;
`;
const PhotoHeader = styled.div`
    padding: 15px 20px;
    display: flex;
    align-items: center;
    max-width: 615px;
`;
const Username = styled(FatText)`
     margin-left: 15px;
`;

const PhotoFile = styled.img`
    min-width: 100%;
`;

const PhotoData = styled.div`
    padding: 15px;
`;

const PhotoActions = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    div {
        display: flex;
        align-items: center;
    }
    svg {
        font-size: 20px;
    }
`;

const PhotoAction = styled.div`
    margin-right: 10px;
    cursor: pointer;
`;

const Likes = styled.div`
    margin-top: 10px;
    display: block;
`;

function Photo({id, user, file}){
    const updateToggleLike = (cache, result) => {
        const data = result.data.toggleLike.result;
        
        if(data){
            const fragmentId = `Photo:${id}`;
            const fragment = gql`
                fragment BSName on Photo {
                    isLiked
                    likes
                }
            `;
            cache.readFragment({
                id: fragmentId,
                fragment
            }),
            // cache.writeFragment({
            //     id: fragmentId,
            //     fragment: fragment,
            //     data: {
            //         isLiked: !isLiked,
            //         likes: isLiked ? (likes -1) : (likes +1)
            //     }
            // });
        }

    }
    const [toggleLikeMutation, { loading }] = useMutation(TOGGLE_LIKE_MUTATION, {
        variables: {
            id
        },
        update: updateToggleLike,
    });
    return (
        <PhotoContainer key={ id }>
            <PhotoHeader>
                <Avatar lg url={user.avatar}/>
                <FatText>{ user.username }</FatText>
            </PhotoHeader>
            <PhotoFile src={file} />
            <PhotoData>
                <PhotoActions>
                    <div>
                        <PhotoAction onClick={toggleLikeMutation}>
                            <FontAwesomeIcon style={{color: isLiked ? "tomato":"inherit"}}
                                                icon={isLiked ? SolidHeart:faHeart} 
                            />
                        </PhotoAction>
                        <PhotoAction>
                            <FontAwesomeIcon icon={faComment} />
                        </PhotoAction>
                        <PhotoAction>
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </PhotoAction>
                    </div>
                    <div>
                        <FontAwesomeIcon icon={faBookmark} />
                    </div>
                </PhotoActions>
                <Likes>{likes === 1 ? "1 like" :`${likes} likes`}</Likes>
            </PhotoData>
        </PhotoContainer>
    );
}

Photo.propTypes = {
    id: PropTypes.number.isRequired,
    user: PropTypes.shape({
        avatar: PropTypes.string,
        username: PropTypes.string.isRequired
    }),
    file: PropTypes.string.isRequired,
    isLiked: PropTypes.bool.isRequired,
    likes: PropTypes.number.isRequired
}

export default Photo;