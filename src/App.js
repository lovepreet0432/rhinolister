import React, { useEffect, useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "./Global.css";
import {
  Home,
  Subscription,
  Login,
  Registration,
  MyProfile,
  ForgotPassword,
  BarcodeScan,
  ScanDetail,
  Payment,
  NotFound,
  Thankyou,
  PrivacyPolicy,
  AdminLogin,
  EmailVerify,
  ResetPassword,
  ServerError
} from "./pages";
import { Header } from "./components";
import { Footer } from "./components";
import {
  setToken,
  setUser,
  setIsAuthenticated,
  setUserProfile,
  setUserSubscription
} from "./redux/slices/authSlice";
import { setHomepage } from "./redux/slices/homeSlice";
import {
  setOption,
} from "./redux/slices/accountSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { TailSpin } from "react-loader-spinner";
import ThemeProvider from './ThemeProvider';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { getHomePageData, getUser } from "./utils/API/auth";

function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const authToken = localStorage.getItem("access_token");
  const user = useSelector(state => state.auth.user);
  const isAdmin = user && user.is_admin;
  const isSupport = user && user.role === "support";
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const stripePromise = loadStripe('pk_test_51Nl0ofCIGTiBaMcZjk1vgad7YnFRUs84tNRqqpsHcyrL1rTVMwTs79Z2oi8PjMhzxEg97mO0JI89IHvB44uFNySd00qgVwvZyT');

  const homepageData = async () => {
    const result = await getHomePageData();
    if (result && result.status == 200) {
      const decodedData = {
        ...result.data.data,
        services: result.data.data.services ? JSON.parse(result.data.data.services) : [],
        shopify: result.data.data.shopify ? JSON.parse(result.data.data.shopify) : [''],
        ebay: result.data.data.ebay ? JSON.parse(result.data.data.ebay) : [''],
        hibid: result.data.data.hibid ? JSON.parse(result.data.data.hibid) : [''],
        amazon: result.data.data.amazon ? JSON.parse(result.data.data.amazon) : [''],
        whatnot: result.data.data.whatnot ? JSON.parse(result.data.data.whatnot) : [''],
      };
      // Set the formData state with the decoded data
      dispatch(setHomepage(decodedData));
    } else {
      dispatch(setHomepage({
        heading: '',
        content: '',
        scanContent: '',
        services: [
          { heading: '', servicesContent: '' }
        ],
        videoContent: '',
        shopify: [''],
        ebay: [''],
        hibid: [''],
        amazon: [''],
        whatnot: ['']
      }))
    }
  }

  console.log('hiiiiii testing git')
  //fetch user
  const fetchUser = async () => {
    if (authToken) {
      const response = await getUser(authToken);
      if (response && response.status === 200) {
        const { user_profile, ...userData } = response.data.user;
        dispatch(setUser(userData));
        dispatch(setIsAuthenticated(true));
        dispatch(setUserSubscription(response.data.user_subscription));
        if (response.data.user_accounts != null) {
          dispatch(setOption(response.data.user_accounts));
        }
        if (response.data.user_profile != null) {
          dispatch(setUserProfile(response.data.user_profile));
        }
        setIsLoading(false);
      }
      else {
        localStorage.removeItem('access_token');
        dispatch(setUser(null));
        dispatch(setUserProfile(null));
        dispatch(setToken(null));
        dispatch(setUserSubscription(null));
        dispatch(setIsAuthenticated(false));
        dispatch(setOption(null));
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    homepageData();
  }, [])

  useEffect(() => {
    // Set the token in the Redux store if available
    if (authToken) {
      dispatch(setToken(authToken));
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, [authToken]);

  if (isLoading) {
    return (
      <div className="loader-container">
        <TailSpin height={80} width={80} />
      </div>
    );
  }

  return (
    <div className="App">
      <ThemeProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/scan" exact element={<BarcodeScan />} />
            <Route path="/scandetail/:id?" exact element={<ScanDetail />} />
            <Route path="/subscription" exact element={<Subscription />} />
            <Route
              path="/login"
              exact
              element={isAuthenticated ? <Navigate to="/" /> : <Login />}
            />
            <Route
              path="/admin/login"
              exact
              element={isAuthenticated ? <Navigate to="/" /> : <AdminLogin />}
            />
            <Route
              path="/registration"
              exact
              element={isAuthenticated ? <Navigate to="/" /> : <Registration />}
            />
            <Route
              path="/myprofile/profile"
              exact
              element={isAuthenticated ? <MyProfile /> : <Navigate to="/" />}
            />
            <Route
              path="/myprofile/subscription"
              exact
              element={isAuthenticated ? <MyProfile url={'subscriptionplan'} /> : <Navigate to="/" />}
            />
            <Route
              path="/myprofile/password"
              exact
              element={isAuthenticated ? <MyProfile url={'changepassword'} /> : <Navigate to="/" />}
            />
            <Route
              path="/myprofile/account"
              exact
              element={isAuthenticated ? <MyProfile url={'accountsetting'} /> : <Navigate to="/" />}
            />
            {/* <Route
            path="/myprofile/export"
            exact
            element = {isAuthenticated ?<MyProfile url={'exports'}/>: <Navigate to="/" />}
          /> */}
            <Route
              path="/myprofile/admin/homepage"
              exact
              element={isAdmin ? <MyProfile url={'homepage'} /> : <Navigate to="/" />}
            />
            <Route
              path="/myprofile/admin/subscription"
              exact
              element={isAdmin || isSupport ? <MyProfile url={'adminSubscription'} /> : <Navigate to="/" />}
            />
            <Route
              path="/myprofile/admin/userList"
              exact
              element={isAdmin ? <MyProfile url={'userList'} /> : <Navigate to="/" />}
            />
            <Route
              path="/myprofile/admin/contactFormList"
              exact
              element={isAdmin ? <MyProfile url={'contactFormList'} /> : <Navigate to="/" />}
            />
            {/* <Route
            path="/myprofile/admin/inactive-subscriptions"
            exact
            element = {<MyProfile url={'inactiveSubscriptions'}/>}
          /> */}
            <Route
              path="/myprofile/admin/user-subscriptions"
              exact
              element={isAdmin ? <MyProfile url={'userSubscriptions'} /> : <Navigate to="/" />}
            />
            <Route
              path="/payment"
              exact
              element={
                isAuthenticated ? (
                  <Elements stripe={stripePromise}>
                    <Payment />
                  </Elements>
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route path="/privacy-policy" exact element={<PrivacyPolicy />} />
            <Route
              path="/thankyou"
              exact
              element={isAuthenticated ? <Thankyou /> : <Navigate to="/login" />}
            />
            <Route
              path="/forgot-password"
              exact
              element={isAuthenticated ? <Navigate to="/" /> : <ForgotPassword />}
            />
            <Route
              path="/email/verify"
              exact
              element={isAuthenticated ? <Navigate to="/" /> : <EmailVerify />}
            />
            <Route
              path="/reset-password"
              exact
              element={<ResetPassword />}
            />
            <Route
              path="/500"
              exact
              element={<ServerError />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;
