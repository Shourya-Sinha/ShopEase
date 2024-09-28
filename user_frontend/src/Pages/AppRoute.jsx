import React from 'react';
import { BrowserRouter as Router, Routes , Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import PageNotFound from '../Pages/NotFound';
import routes from '../Routes/AlRoute';
const  AppRoute = () => {
  return (
   <>
     <Router>
      <Routes>
        {routes.map((route, index) => {
          if (route.isPrivate) {
            return (
              // Use PrivateRoute as a wrapper around the element to handle authentication
              <Route
                key={index}
                path={route.path}
                element={
                  <PrivateRoute layout={route.layout} component={route.component} />
                }
              />
            );
          }

          // Public routes
          return (
            <Route
              key={index}
              path={route.path}
              element={
                <route.layout>
                  <route.component />
                </route.layout>
              }
            />
          );
        })}

        {/* Fallback for undefined routes */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
   </>
  )
}

export default AppRoute;