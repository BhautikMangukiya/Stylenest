import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserLayout from "./componets/Layout/UserLayout/UserLayout";
import "./app.css";
import Home from "./pages/Home/Home";
import { Toaster } from "sonner";

function App() {
  return (
    <BrowserRouter>
    <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
        </Route>
        <Route>{/* Admin Layout */}</Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

