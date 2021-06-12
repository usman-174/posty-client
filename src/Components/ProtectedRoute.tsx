import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAppSelector } from "../redux/hook";

const ProtectedRoute: React.FC<any> = ({ component: Component, ...rest }): any => {
    const user = useAppSelector((state) => state.user)
  return(
  <>
    <Route
      {...rest}
      render={(props: any) => {
        if (user.email && user.username) {
          return <Component {...props} />;
        } else {
          return <Redirect to="/login" />;
        }
      }}
    />
  </>)
};

export default ProtectedRoute;
