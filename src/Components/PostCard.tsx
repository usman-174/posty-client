import { Icon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Heading,
  Kbd,
  Spacer,
  Spinner,
  Text, Tooltip,




  useMediaQuery
} from "@chakra-ui/react";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { IPOST, RemovePost, SetPosts } from "../redux/reducers/post";
import { RemoveMyPost, UpdatePosts } from "../redux/reducers/user";
import DropMenu from "./DropMenu";
dayjs.extend(relativeTime);
interface IPoPropstCard {
  post: IPOST;
}

const PostCard: React.FC<IPoPropstCard> = ({
  post: {
    title,
    body,
    userid: creatorId,
    CreatedAt,
    UpdatedAt,
    likes,
    ID: postId,
    User
  },
  ...rest
}): any => {
  const [loading, setloading] = useState(false);
  const { pathname } = useLocation();
  const [isLargerThan600px] = useMediaQuery("(min-width: 600px)");
  const [like, setlike] = useState<boolean>(false);
  const user = useAppSelector((state) => state.user);

  useEffect(() => {
    if (user.email && user.username && likes) {
      const liked = likes.find((like) => {
        return like.userid === user.id;
      });

      if (liked) {
        setlike(true);
        return;
      }
    }
    // eslint-disable-next-line
  }, []);

  const dispatch = useAppDispatch();
  const deletePost = async () => {
    const { data } = await axios.post(
      "http://localhost:4000/x/deletepost",
      {
        id: postId,
      },
      { withCredentials: true }
    );
    if (!data.error) {
      dispatch(RemovePost(postId));
      dispatch(RemoveMyPost(postId));
    }
  };
  const likeUnLikePost = async () => {
    setloading(true);
    const { data }: { data: { error: string; msg: string } } = await axios.post(
      "http://localhost:4000/x/likepost",
      {
        id: postId,
      }
    );
    if (!data.error && data.msg) {
      const { data: response } = await axios.get(
        " http://localhost:4000/getposts"
      );
      if (!response?.error) {
        dispatch(SetPosts(response));

        if (pathname.includes("myposts")) {
          const updatedPosts = (response as IPOST[]).filter(
            (post) => post.userid === user.id
          );
          console.log("updatedPosts=", updatedPosts);

          dispatch(UpdatePosts(updatedPosts));
        }

        if (data.msg.includes("Unliked")) {
          setloading(false);

          return setlike(false);
        } else {
          setloading(false);

          return setlike(true);
        }
      }
    }
  };
  return (
    <Box
      w={isLargerThan600px ? "48vw" : "84vw"}
      my="5"
      cursor="pointer"
      _hover={{
        transform: "translateY(-6px)",
      }}
      p={5}
      shadow="lg"
      borderWidth="1px"
      bg={user.id === creatorId ? "yellow.300" : "yellow.200"}
      css={{
        transition: "all 0.4s ease",
      }}
      {...rest}
    >
      <Heading
        isTruncated
        fontSize="2xl"
        color="blue.600"
        textTransform="uppercase"
      >
        {title}
      </Heading>
      {User.username && (
        <Text as="small">
          By <span style={{ color: "red" }}>{User.username.toUpperCase()}</span>
        </Text>
      )}
      <Text as="small" mx="1">
        published {dayjs(UpdatedAt).fromNow()}
      </Text>
      <Text mt={4} isTruncated>
        {body}
      </Text>
      <Flex alignItems="center" w="100%" mt="4">
        <Box textAlign="left">
          <Tooltip
            bg="gray.400"
            hasArrow
            color={like ? "blackAlpha.600" : ""}
            label={like ? "UnLike" : "Like"}
            aria-label="A tooltip"
          >
            <Kbd onClick={likeUnLikePost}>
              {!loading ? (
                <>
                  {likes?.length}{" "}
                  <Icon
                    color={like ? "red.500" : ""}
                    as={FaThumbsUp}
                    w="3"
                    h="3"
                  />
                </>
              ) : (
                <Spinner size="xs" color="blue.300" />
              )}
            </Kbd>
          </Tooltip>
        </Box>
        {user.id === creatorId && (
          <>
            <Spacer />
            <Box textAlign="right">
           

              <DropMenu
                deletePost={deletePost}
                post={
                  {
                    title,
                    body,
                    userid: creatorId,
                    UpdatedAt,
                    likes,CreatedAt,
                    ID: postId,
                    User
                  }
                  
                }
                />
               
            </Box>
          </>
        )}
      </Flex>
    </Box>
  );
};

export default PostCard;
