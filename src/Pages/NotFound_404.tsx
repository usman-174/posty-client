import {
    Box,
    Button, Text
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

const NotFound_404 = () => {
    const history = useHistory();
    
    return (
        <Box mt="5" mx="auto" textAlign="center">
            <Text as="h1" my="10" fontSize="8xl" color="red.400"> PAGE NOT FOUND </Text>
                <Button onClick={()=>history.goBack()} fontSize="3xl"mt="6" mx="auto" variant="ghost" colorScheme="red">
                    Go BACK
                </Button>
        </Box>
    )

}

export default NotFound_404
