import { Box, Spinner, Stack, useMediaQuery, 
  // useToast
 } from "@chakra-ui/react";
import React, { useEffect } from "react";
import PostCard from "../Components/PostCard";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { SetMyPosts } from "../redux/reducers/user";


const MyPosts: React.FC<{}> = (): any => {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  
  const { posts } = user;
  const [isLargerThan600px] = useMediaQuery("(min-width: 600px)");
  useEffect(() => {

    dispatch(SetMyPosts());
    // eslint-disable-next-line 
  }, []);
  if ( user.postsLoading) {
    return (
      <Box textAlign="center" m="auto" fontSize="2xl" color="blue.400">
        <Spinner mt="20" size="xl" />
      </Box>
    );
  }
  return posts.length ? (
    <Stack
      mt="5vh"
      align={isLargerThan600px ? "flex-start" : "center"}
      ml={isLargerThan600px ? "18%" : "2%"}
    >
      {posts.map((post) => (
        <span key={post.ID}>
          <PostCard post={post} />
        </span>
      ))}
    </Stack>
  ) : (
    <Box textAlign="center" my="6" mx="auto" fontSize="xl" color="black">
      No posts found.
    </Box>
  );
};

export default MyPosts;
