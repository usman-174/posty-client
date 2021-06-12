import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAppSelector } from "../redux/hook";
interface IRegiPropster {}

const Register: React.FC<IRegiPropster> = (): any => {
  const toast = useToast();
  const user = useAppSelector((state) => state.user);

  const history = useHistory();
  const [email, setemail] = useState("");
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const register = async () => {
    try {
      const { data }: any = await axios.post("http://localhost:4000/register", {
        email,
        password,
        username,
      });
      if (data?.error) {
        throw new Error(data.error);
      } else {
        toast({
            title: `Registered Successfully, Login now Please.`,
            status: "success",
            variant: "top-accent",
            position : "top-right",
            isClosable: true,
            duration: 2000,
          });
        return history.push("/login");
      }
    } catch (error) {
      toast({
        title: `${error.message}`,
        status: "error",
        isClosable: true,
        position : "top-right",
        duration: 2000,
      });
      return;
    }
  };
  useEffect(() => {
    if (user.email && user.username) {
      history.push("/");
    }
    // eslint-disable-next-line
  }, [user]);
  return (
    !user.email &&
    !user.username && (
      <>
        <Box textAlign="center" m="auto" w="40%">
          <Box my="3" as="h2" color="blue.600" fontWeight="bold" fontSize="3xl">
            SignUp
          </Box>
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              value={email}
              placeholder="Email..."
              onChange={(e) => setemail(e.target.value)}
            />
          </FormControl>
          <FormControl id="email">
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              value={username}
              placeholder="Username..."
              onChange={(e) => setusername(e.target.value)}
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              placeholder="Password..."
              onChange={(e) => setpassword(e.target.value)}
            />
          </FormControl>
          <Button mt="2" colorScheme="messenger" onClick={register}>
            Register
          </Button>
        </Box>
      </>
    )
  );
};

export default Register;
