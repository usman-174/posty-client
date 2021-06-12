import { DeleteIcon, EditIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  Textarea,

  useDisclosure,
  useToast
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { useAppDispatch } from "../redux/hook";
import { EditPost, IPOST } from "../redux/reducers/post";

const DropMenu: React.FC<{ deletePost: Function; post: IPOST }> = ({
  deletePost,
  post,
}): any => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const [title, settitle] = useState(post.title);
  const [body, setbody] = useState(post.body);
  const UpdatePost = async () => {
    if (title.trim() === post.title && body.trim() === post.body) {
      return toast({
        title: `Please Update Atleast one field`,
        status: "error",
        position: "top-right",
        isClosable: true,
        duration: 2000,
      });
    } else if (title.trim().length < 6) {
      return toast({
        title: `Title length must be greater then 5`,
        status: "error",
        position: "top-right",
        isClosable: true,
        duration: 2000,
      });
    } else if (!title.trim() || !body.trim()) {
      return toast({
        title: `Please Fill the required field.`,
        status: "error",
        position: "top-right",
        isClosable: true,
        duration: 2000,
      });
    } else if (body.trim().length < 50) {
      return toast({
        title: `Body length must be atleast 50 characters`,
        status: "error",
        position: "top-right",
        isClosable: true,
        duration: 2000,
      });
    }
    try {
     
      const { data } = await axios.post(
        `${process.env.REACT_APP_URL}/x/updatepost`,
        {
          title: title.trim(),
          body: body.trim(),
          id: String(post.ID),
        }
      );

      if (data.error) {
        throw new Error(data.error);
      } else if (!data.error && data) {

        
        toast({
          title: `Post Updated!`,
          status: "success",
          variant: "top-accent",
          position: "top-right",
          isClosable: true,
          duration: 2000,
        });
        dispatch(EditPost(data));
        return onClose();
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
      <Menu closeOnSelect={true} colorScheme="orange">
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<HamburgerIcon />}
            variant="outline"
            />
        <Portal>
          <MenuList bg="yellow.200" minWidth="11.5vw">
            <MenuItem
              icon={<DeleteIcon />}
              command="⌘D"
              onClick={() => deletePost()}
            >
              Delete.
            </MenuItem>
            <MenuItem
              icon={<EditIcon />}
              command="⌘E"
              ref={btnRef}
              onClick={onOpen}
            >
              Edit.
            </MenuItem>
          </MenuList>
        </Portal>
      </Menu>

      <Drawer
        isOpen={isOpen}
        placement="top"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent textAlign="center">
          <DrawerCloseButton />
          <DrawerHeader color="yellow.400" fontSize="3xl">
            EDIT POST
          </DrawerHeader>

          <DrawerBody>
            <FormControl id="title" mx="auto" w="50%">
              <FormLabel color="yellow.500" fontSize="xl" my="3">
                Title :
              </FormLabel>
              <Input
                placeholder="Title...."
                value={title}
                onChange={(e) => settitle(e.target.value)}
              />
            </FormControl>
            <FormControl id="body" w="50%" mx="auto">
              <FormLabel color="yellow.500" fontSize="xl" my="3">
                Body :
              </FormLabel>
              <Textarea
                placeholder="Body...."
                value={body}
                onChange={(e) => setbody(e.target.value)}
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
          </DrawerBody>

          <DrawerFooter mt="4" mx="auto">
            <Button variant="solid" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="orange" variant="outline" onClick={UpdatePost}>
              Update
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default DropMenu;
