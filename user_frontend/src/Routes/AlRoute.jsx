import BaseLayout from "../Layout/BaseLayout";
import Contact from "../Pages/Contact";
import Home from "../Pages/Home";
import SingleProduct from "../Pages/SingleProduct";
import Register from "../Pages/Authentication/Register";
import Cart from "../Pages/Cart";
import Login from "../Pages/Authentication/Login";
import Shipping from "../Pages/Shipping";
import Payment from "../Pages/Payment";
import OurStore from "../Pages/OurStore";
import OurOrder from "../Pages/OurOrder";
import OrderDeatils from "../Components/OrderDeatils";
import Profile from "../Pages/Profile";
import OtpVerification from "../Pages/Authentication/OtpVerification";
import AuthLayout from "../Pages/Authentication/AuthLayout.jsx";
import SearchResult from "../Pages/SearchResult.jsx";
import { forgotPassword } from "../Redux/Slices/AuthSlice.jsx";
import ForogtPassword from "../Pages/Authentication/ForogtPassword.jsx";
import ResetPassword from "../Pages/Authentication/ResetPassword.jsx";

const AllRoutes = [
    // Public Routes
    {
      path: '/',
      exact: true,
      layout: BaseLayout,
      component: Home,
    },
    // {
    //   path: '/category',
    //   layout: BaseLayout,
    //   component: Category,
    // },
    {
      path: '/store',
      layout: BaseLayout,
      component: OurStore,
    },
    {
      path:"/product/:productId",
      layout: BaseLayout,
      component: SingleProduct,
      exact: true,
    },
    {
      path: '/contact',
      layout: BaseLayout,
      component: Contact,
      exact: true,
    },
    {
      path: '/login',
      layout: AuthLayout,
      component: Login,
      exact: true,
    },
    {
      path: '/register',
      layout: AuthLayout,
      component: Register,
      exact: true,
    },
    {
      path: '/verify-otp',
      layout: AuthLayout,
      component: OtpVerification,
      exact: true,
    },
    {
      path: '/forgot-password',
      layout: AuthLayout,
      component:ForogtPassword,
      exact: true,
    },
    {
      path: '/new-password',
      layout: AuthLayout,
      component:ResetPassword,
      exact: true,
    },
    // Private Routes
    {
      path: '/cart',
      layout: BaseLayout,
      component: Cart,
      exact: true,
      isPrivate: true, // Marking this route as private
    },
    {
      path: '/shipping',
      layout: BaseLayout,
      component: Shipping,
      exact: true,
      isPrivate: true, // Marking this route as private
    },
    {
      path: '/payment',
      layout: BaseLayout,
      component: Payment,
      exact: true,
      isPrivate: true, // Marking this route as private
    },
    {
      path: '/myOrder',
      layout: BaseLayout,
      component: OurOrder,
      exact: true,
      isPrivate: true, // Marking this route as private
    },
    {
      path: '/myOrder/:orderId',
      layout: BaseLayout,
      component: OrderDeatils,
      // exact: true,
      isPrivate: true, // Marking this route as private
    },
    {
      path: '/product-details:productId',
      layout: BaseLayout,
      component: SingleProduct,
    },
    {
      path: '/search-results',
      layout: BaseLayout,
      component: SearchResult,
    },
    {
      path: '/profile',
      layout: BaseLayout,
      component: Profile,
      exact: true,
      isPrivate: true, // Marking this route as private
    },
  ];
  
  export default AllRoutes;