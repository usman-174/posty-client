import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton, DrawerContent,
  DrawerFooter,
  DrawerHeader,Text,
  DrawerOverlay,
  Flex,
  FormControl,
  FormLabel,Avatar,
  Input,
  Link,
  Spacer,
  useDisclosure, useMediaQuery, useToast
} from "@chakra-ui/react";
import {ExternalLinkIcon} from "@chakra-ui/icons"
import axios from "axios";
import React, { useState } from "react";
import { Link as ReactLink, useHistory } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { AddUser, RemoveUser } from "../redux/reducers/user";
interface INavBar {}

const NavBar: React.FC<INavBar> = (): any => {
  const [isLargerThan600px] = useMediaQuery("(min-width: 600px)");
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const user = useAppSelector((state) => state.user);
  const [email, setemail] = useState<string>(user?.email || "");
  const [password, setpassword] = useState<string>("");
  const [username, setusername] = useState<string>(user?.username || "");
  const [oldPass, setOldPass] = useState("");

  const history = useHistory();
  const dispatch = useAppDispatch();
  const UpdateProfile = async () => {
   

    try {
      if (email.trim() === user.email && username.trim() === user.username && !password.trim()) {
    
        return toast({
          title: `Please Update Atleast one field`,
          status: "error",
          position: "top-right",
          isClosable: true,
          duration: 2000,
        });
      }else if(!email.trim().includes("@")){
        return  toast({
          title: `Please Enter a valid Email`,
          status: "error",
          position: "top-right",
          isClosable: true,
          duration: 2000,
        });
      }else if(username.trim().length < 3){
        return toast({
          title: `Username length must be atleast 3 characters long`,
          status: "error",
          position: "top-right",
          isClosable: true,
          duration: 2000,
        });
      }else if(!email.trim() || !username.trim()){
        return toast({
          title:`Email or Username must not be empty`,
          status: "error",
          position: "top-right",
          isClosable: true,
          duration: 2000,
        });
      }else if(password && password.trim().length < 8){
       return toast({
          title: `New Password's length must be atleast 8 characters long`,
          status: "error",
          position: "top-right",
          isClosable: true,
          duration: 2000,
        });
      }else if(!oldPass || oldPass.trim().length < 5)  {
        return toast({
          title: `To Update Profile Please Enter valid old password.`,
          status: "error",
          position: "top-right",
          isClosable: true,
          duration: 2000,
        });
      }
      const {data} = await axios.post("http://localhost:4000/x/updateuser",{
        id : String(user.id),
        email,username,newpassword : password? password : undefined,
        oldpassword : oldPass
      })
      if(data?.error){
        throw new Error(data.error)
      }else if (data){
        toast({
          title: `Profile Updated!`,
          status: "success",
          variant: "top-accent",
          position : "top-right",
          isClosable: true,
          duration: 2000,
        });
        onClose()
        return dispatch(AddUser({email:data.email,username :data.username ,ID:data.ID}))
      }
    } catch (error) {
      toast({
        title: `${error.message}`,
        status: "error",
        position: "top-right",
        isClosable: true,
        duration: 2000,
      });
    }
  }
   
    const logOut = async () => {
      try {
        const { data }: any = await axios.get(
          "http://localhost:4000/x/logout",
          {
            withCredentials: true,
          }
        );
        console.log(data);

        if (data.msg) {
          dispatch(RemoveUser());
          history.push("/");
          return window.location.reload;
        }
        throw new Error("FK UU");
      } catch (error) {
        console.error(error.message);
        return history.push("/login");
      }}
    
    return (
      <>
        <Flex
          align="center"
          justifyContent="center"
          flexDirection={isLargerThan600px ? "row" : "column"}
          w="100%"
          bg="yellow.400"
          color="Scrollbar"
          h="20%"
          p="2"
        >
          <Box
            p="2"
            textAlign="center"
            fontSize="2xl"
            fontWeight="bold"
            color="blue.500"
          >
            <Link textDecoration="none" as={ReactLink} to="/">
              POSTY
            </Link>
          </Box>
          {isLargerThan600px && <Spacer />}
          {!user.email && !user.username ? (
            
              <Box my="2">
                <Link
                  mt={!isLargerThan600px && "5px"}
                  textDecoration="none"
                  as={ReactLink}
                  to="/login"
                >
                  <Button
                    colorScheme="facebook"
                    size="ls"
                    variant="solid"
                    p="2"
                  >
                    LOGIN
                  </Button>
                </Link>
                <Link
                  mt={!isLargerThan600px && "5px"}
                  textDecoration="none"
                  as={ReactLink}
                  to="/register"
                >
                  <Button
                    colorScheme="teal"
                    size="ls"
                    variant="outline"
                    p="2"
                    mx="3"
                  >
                    SignUp
                  </Button>
                </Link>
              </Box>
            
          ) : (
            <>
              <Link
                textDecoration="none"
                mx="3"
                fontSize="lg"
                color="blue.500"
                ref={btnRef}
                colorScheme="teal"
                onClick={onOpen}
                display="inline-flex"
              >
                <Avatar name={user.username+ " "+ user.email.split("@")[0]} src="" bg="blue.300" /><Text mt="2" mx="1" 
                fontSize="20px">{user.username}</Text>
              </Link>
              <Link
                textDecoration="none"
                as={ReactLink}
                to="/post"
                mx="3"
                fontSize="18.6px"
                color="blue.500"
                my={!isLargerThan600px && "12px"}
              >
                Create Post
              </Link>
              <Button
                onClick={logOut}
                mx="3"
                colorScheme="telegram"
                size="ls"
                variant="outline"
                p="2"
              >
                LOGOUT
              </Button>
              <Drawer
                isOpen={isOpen}
                placement="right"
                onClose={onClose}
                finalFocusRef={btnRef}
              >
                <DrawerOverlay />
                <DrawerContent>
                  <DrawerCloseButton />
                  <DrawerHeader>Your Profile</DrawerHeader>

                  <DrawerBody>
                    <FormControl id="email" my="2">
                      <FormLabel>Email</FormLabel>
                      <Input
                        type="text"
                        value={email}
                        placeholder="Email..."
                        onChange={(e) => setemail(e.target.value)}
                      />
                    </FormControl>
                    <FormControl id="username">
                      <FormLabel>Username</FormLabel>
                      <Input
                        type="text"
                        value={username}
                        placeholder="Username..."
                        onChange={(e) => setusername(e.target.value)}
                      />
                    </FormControl>
                     <FormControl id="newPassword">
                      <FormLabel  my="2">New Password</FormLabel>
                      <Input
                        type="password"
                        value={password}
                        placeholder="New Password..."
                        onChange={(e) => setpassword(e.target.value)}
                      />
                      {!password.length && <> <Text as="span" fontSize="xs" mx="2">Leave it empty if dont want to update password.</Text> <br /> </>}
                    </FormControl>
         
                     <FormControl id="oldPassword">
                      <FormLabel  my="2">Old Password</FormLabel>
                      <Input
                      isInvalid={oldPass.length ? false :true}
                        type="password"
                        value={oldPass}
                        placeholder="Old Password..."
                        onChange={(e) => setOldPass(e.target.value)}
                      />
                    </FormControl>
                   {user.posts.length && <><Box mt="10" fontSize="ls">
                      Your total Posts = {user.posts.length}
                    </Box>
                    <Box   my="5">

                     <Link
                     textDecoration="none"
                     as={ReactLink}
                     to="/myposts"
                      onClick={()=>onClose()}
                     fontSize="md"
                     color="blue.500"
                     >
                     Visit Your Posts <ExternalLinkIcon color="yellow.500"  />
                   </Link>
                     </Box>
                    </>}
                  </DrawerBody>
            
                  <DrawerFooter mb="20">
                    <Button variant="outline" mr={3} onClick={onClose}>
                      Cancel
                    </Button>
                    <Button colorScheme="orange" onClick={UpdateProfile}>
                      Update Profile.
                    </Button>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </>
          )}
        </Flex>
      </>
    );
  };
;

export default NavBar;
