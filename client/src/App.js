import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import IndexPage from "./components/Index/IndexPage";
import Learning from "./components/Learning/Learning";
import Navbar from "./components/Navbar/Navbar";
import Notes from "./components/Notes/Notes";
import CourseUpload from "./components/Admin/CourseUpload/CourseUpload";
import NotesIcon from "./components/NotesIcon/NotesIcon";
import CourseUpdate from "./components/Admin/CourseUpload/CourseUpdate";
import { Auth0Provider } from "@auth0/auth0-react";
import Protected from "./Protected";
import NotFound from "./components/NotFound/NotFound";
import Loading from "./components/Loading/Loading";
import AddTopics from "./components/Admin/AddTopics/AddTopics";

function App() {
  return (
    <Auth0Provider
      domain={process.env.REACT_APP_DOMAIN}
      clientId={process.env.REACT_APP_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="/:id" element={<IndexPage />} />
        <Route path="/learning/:id" element={<Learning />} />
        <Route path="/notes" element={<Notes />} />
        <Route element={<Protected />}>
          <Route path="/admin-upload" element={<CourseUpload />} />
          <Route path="/admin-update/:id" element={<CourseUpdate />} />
          <Route path="/admin-topics" element={<AddTopics />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <NotesIcon />
    </Auth0Provider>
  );
}

export default App;
