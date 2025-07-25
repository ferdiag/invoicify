import Layout from "./components/Layout";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./PrivateRoute/PrivateRoute";
import AddCompanyData from "./pages/AddCompanyData";
import CreateInvoice from "./pages/CreateInvoice";
import CustomersPage from "./pages/CustomersPage";
import CustomerDetail from "./pages/CustomerDetail";

const privateRoutes = [
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/customer/:id", element: <CustomerDetail /> },
  { path: "/add-customer", element: <CustomerDetail /> },

  { path: "/add-data", element: <AddCompanyData /> },
  {
    path: "/create-invoice",
    element: <CreateInvoice />,
  },
  { path: "/customers", element: <CustomersPage /> },
];

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route element={<PrivateRoute />}>
            {privateRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Route>
          {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
        </Route>
      </Routes>
      <ToastContainer position="bottom-center" autoClose={2000} />
    </Router>
  );
}

export default App;
