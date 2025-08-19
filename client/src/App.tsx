import { lazy } from "react";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Layout from "./components/Layout";
import PrivateRoute from "./PrivateRoute/PrivateRoute";

const Auth = lazy(() => import("./pages/Auth"));
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AddCompanyData = lazy(() => import("./pages/EditCompanyData"));
const CreateInvoice = lazy(() => import("./pages/CreateInvoice"));
const CustomersPage = lazy(() => import("./pages/CustomersPage"));
const CustomerDetail = lazy(() => import("./pages/CustomerDetail"));
const Invoices = lazy(() => import("./pages/Invoices"));
const InvoiceDetail = lazy(() => import("./pages/InvoiceDetail"));

const privateRoutes = [
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/customer/:id", element: <CustomerDetail /> },
  { path: "/invoices/:id", element: <InvoiceDetail /> },

  { path: "/add-customer", element: <CustomerDetail /> },
  { path: "/invoices", element: <Invoices /> },

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
