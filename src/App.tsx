import { Box, Spinner } from "@chakra-ui/react";
import { useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import NavBar from "./Components/NavBar";
import Home from './Pages/Home';
import Login from "./Pages/Login";
import ProtectedRouter from "./Components/ProtectedRoute"
import CreatePost from "./Pages/CreatePost";
import Register from "./Pages/Register";
import { useAppDispatch, useAppSelector } from "./redux/hook";
import { fetchPosts } from "./redux/reducers/post";
import { GetUser } from "./redux/reducers/user";
import MyPosts from "./Pages/MyPosts";
function App() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.user);
  const post = useAppSelector((state) => state.post);
  useEffect(() => {
    
    dispatch(fetchPosts());
    dispatch(GetUser());
    // eslint-disable-next-line
  }, []);
  if (user?.loading || post?.loading) {
    return (
      <Box textAlign="center" m="auto" fontSize="2xl" color="blue.400">
        <Spinner mt="20" size="xl" />
      </Box>
    );
  }
  return (
    <Router>
      <NavBar/>
    <Route exact path="/" component={Home} />
    <Route exact path="/login" component={Login} />
    <Route exact path="/register" component={Register} />
    <ProtectedRouter path="/post" component={CreatePost} />
    <ProtectedRouter path="/myposts" component={MyPosts} />
  </Router>
  );
}

export default App;
