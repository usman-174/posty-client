import {
  Box,
  Button,
  FormControl,
  FormLabel, Input, Text, Textarea, useToast
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { fetchPosts } from "../redux/reducers/post";

const CreatePost: React.FC<{}> = (): any => {
  const toast = useToast();
  const dispatch = useDispatch();

  const history = useHistory();
  const [title, settitle] = useState("");
  const [body, setbody] = useState("");
  const Post = async () => {
    if (!title || !body) {
      return toast({
        title: `Please Fill the required field.`,
        status: "error",
        position: "top-right",
        isClosable: true,
        duration: 2000,
      });
    } else if (title.length < 6) {
     return  toast({
        title: `Title length must be greater then 5`,
        status: "error",
        position: "top-right",
        isClosable: true,
        duration: 2000,
      });
    } else if (body.length < 30) {
      return toast({
        title: `Body length must be atleast 50 characters`,
        status: "error",
        position: "top-right",
        isClosable: true,
        duration: 2000,
      });
    }
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_URL}/x/post`, {
        title: title.trim(),
        body
      });

      if (data.error) {
        throw new Error(data.error);
      } else if (!data.error && data) {
        dispatch(fetchPosts());
         history.push("/");
         return toast({
          title: `Post Published!`,
          status: "success",
          variant: "top-accent",
          position : "top-right",
          isClosable: true,
          duration: 2000,
        });
      }
    } catch (error) {
      toast({
        title: `${error.message}`,
        status: "error",
        position: "top-right",
        isClosable: true,
        duration: 2000,
      });
      return;
    }
  };

  return (
    <>
      <Box textAlign="center" m="auto" w="40%">
        <Box my="3" as="h2" color="blue.600" fontWeight="bold" fontSize="3xl">
          Create Post
        </Box>
        <FormControl id="title">
          <FormLabel>Title</FormLabel>
          <Input
            type="text"
            value={title}
            placeholder="Title..."
            onChange={(e) => settitle(e.target.value)}
          />
        </FormControl>
        <FormControl id="body">
          <FormLabel>Body</FormLabel>
          <Textarea
            type="text"
            value={body}
            placeholder="Body..."
            onChange={(e) => {
              setbody(e.target.value);
            }}
          />
          {body.length < 50 && (
            <Text fontSize="sm">
              Atleast{" "}
              <Text as="span" color="red.400">
                {50 - body.length}{" "}
              </Text>
              more words.
            </Text>
          )}
        </FormControl>
        <Button mt="2" colorScheme="messenger" onClick={Post}>
          Publish Post
        </Button>
      </Box>
    </>
  );
};

export default CreatePost;
