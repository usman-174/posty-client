import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  useMediaQuery,
} from "@chakra-ui/react";
import React, { useState } from "react";
import PostCard from "../Components/PostCard";
import { useAppSelector } from "../redux/hook";

const Home: React.FC<{}> = (): any => {
  const [search, setsearch] = useState("");
  const [isLargerThan600px] = useMediaQuery("(min-width: 600px)");
  
  const searchPosts = () => {};
  const postState = useAppSelector((state) => state.post);
  console.log(postState.posts?.length );
  
  return (
    <>
      {postState.posts && postState.posts?.length ? (
        <>
          <Box ml={isLargerThan600px ? "18%" : "2%"} my="10">
            <Heading textColor="yellow.400">Search Posts</Heading>
            <InputGroup w="50%" my="3">
              <InputLeftElement
                pointerEvents="none"
                children={<SearchIcon color="gray.300" />}
              />
              <Input
                type="text"
                placeholder="Search posts"
                value={search}
                onChange={(e) => setsearch(e.target.value)}
                onClick={searchPosts}
              />{" "}
              <Button mx="2" variant="outline" colorScheme="yellow">
                SEARCH
              </Button>
            </InputGroup>
          </Box>
          <Stack
            mt="5vh"
            align={isLargerThan600px ? "flex-start" : "center"}
            ml={isLargerThan600px ? "18%" : "2%"}
          >
            {
              postState.posts.length ?
              postState.posts?.map((post) => 
                 (
                  <span key={post.ID}>
                    <PostCard post={post} />
                  </span>
                )
              ) : null}
          </Stack>
        </>
      ) : (
        <Box textAlign="center" my="6" mx="auto" fontSize="xl" color="black">
          No posts found.
        </Box>
      )}
    </>
  );
};

export default Home;
