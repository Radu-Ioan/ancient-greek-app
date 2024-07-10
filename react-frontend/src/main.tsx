import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import Root from "./routes/root";
import SignIn from "./routes/SignIn";
import SignUp from "./routes/SignUp";
import LessonList from "./routes/LessonList";
import LessonPage from "./routes/LessonPage";

import { loader as lessonsLoader } from "./routes/LessonList";
import { loader as lessonPageLoader } from "./routes/LessonPage";
import RegistrationSuccessful from "./routes/RegistrationSuccessful";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<Root />}></Route>
      <Route path="signup" element={<SignUp />}></Route>
      <Route
        path="registration-successful"
        element={<RegistrationSuccessful />}></Route>
      <Route path="signin" element={<SignIn />}></Route>
      <Route
        path="lessons"
        element={<LessonList />}
        loader={lessonsLoader}></Route>
      <Route
        path="lessons/:lessonId"
        element={<LessonPage />}
        loader={lessonPageLoader}></Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
