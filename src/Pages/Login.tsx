import { Box, Button, FormControl, FormLabel, Input, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useAppSelector } from '../redux/hook'
import { GetUser } from '../redux/reducers/user'


const LogIn : React.FC<{}> = (): any=> {
  
    const user = useAppSelector((state) => state.user)
  const toast = useToast(); 
  const dispatch = useDispatch()
    
    const history = useHistory()
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const Login = async ()=>{
        try {
            const { data } = await axios.post(
              "http://localhost:4000/login",
              {
                email ,
                password 
      
              }
            );
            if(data.error){
              throw new Error(data.error)
            }else if (data.msg && !data.error){
               dispatch(GetUser())
               return history.goForward()
            }
          } catch (error) {
            toast({
              title: `${error.message}`,
              status: "error",
              position : "top-right",
              isClosable: true,
              duration: 2000,
            });
            return;
          }
    }
    useEffect(() => {
        if( user.email && user.username){
            history.push("/")
        }
        // eslint-disable-next-line
    }, [user])
return  !user.email && !user.username && (
<>
<Box textAlign="center" m="auto" w="40%">
    <Box my="3" as="h2" color="blue.600" fontWeight="bold" fontSize="3xl">
    SignIn
    </Box>
<FormControl id="email"> 
  <FormLabel>Email address</FormLabel>
  <Input type="email" value={email} placeholder="Email..." onChange={(e)=>setemail(e.target.value)}/>
</FormControl>
<FormControl id="password">
  <FormLabel>Password</FormLabel>
  <Input type="password" value={password} placeholder="Password..." onChange={(e)=>setpassword(e.target.value)}/>
</FormControl>
<Button mt="2" colorScheme="messenger" onClick={Login}>
    LogIn
</Button>

</Box>
</>
)
}


export default LogIn