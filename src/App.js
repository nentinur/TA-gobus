import React from "react";
import { Outlet } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";

import { GObusNavBar } from "./component/Home/GObusNavBar";
import { HomePage } from "./component/Home/HomePage";
import DetailHistory from "./component/History/DetailHistory";
import { FilterBus } from "./component/Booking/FilterBus";
import { Login } from "./component/Login";
import { ProfilePage } from "./component/Profile/ProfilePage";
import { SignUp } from "./component/SignUp";
import HistoryPage from "./component/History/HistoryPage";
import { Booking } from "./component/Booking";
import { EditProfile } from "./component/Profile/EditProfile";

const router = createBrowserRouter([
  {
    path: "/in",
    element: <LoginLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "login/signup",
        element: <SignUp />,
      },
    ],
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "history",
        element: <HistoryPage />,
      },
      {
        path: "history/detail",
        element: <DetailHistory />,
      },
      {
        path: "filter-bus",
        element: <FilterBus />,
      },
      {
        path: "booking",
        element: <Booking />,
      },
      {
        path: "profile/edit",
        element: <EditProfile />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "penumpang-detail",
        element: <ProfilePage />,
      },
    ],
  },
]);

const App = () => {
  return (
    <div>
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </div>
  );
};

function LoginLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

function Layout() {
  return (
    <div>
      <Outlet />
      <GObusNavBar />
    </div>
  );
}

export default App;
