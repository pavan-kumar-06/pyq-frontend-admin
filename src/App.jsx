import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import College from "./pages/College/College";
import CreateCollege from "./pages/College/CreateCollege";
import Test from "./pages/Test/Test";
import CreateTest from "./pages/Test/CreateTest";
import UpdateTest from "./pages/Test/UpdateTest";
import UpdateQuestions from "./pages/Question/UpdateQuestions";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        {/* <Route path='/sign-up' element={<SignUp />} /> */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          {/* <Route path="/college" element={<College />} />
          <Route path="/create-college" element={<CreateCollege />} /> */}
          {/* Routes for Test */}
          <Route path="/test" element={<Test />} />
          <Route path="/create-test" element={<CreateTest />} />
          <Route path="/update-test/:id" element={<UpdateTest />} />

          <Route path="/question/:testId" element={<UpdateQuestions />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
