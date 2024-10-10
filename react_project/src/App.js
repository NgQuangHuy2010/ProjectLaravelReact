import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { publicRoutes } from "~/routes/routes.js";
import DefaultLayout from "~/layouts/DefaultLayout/DefaultLayout";
import Category from "~/components/Goods/Category";
import Products from "~/components/Goods/Products";
import { ProductProvider as MyProvider } from "./components/Provider/MyProvider";
// App Component
function App() {
  return (
    <MyProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/admin" />} />

            {publicRoutes.map((route, index) => {
              const Layout = route.layout || DefaultLayout;
              const Page = route.component;
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}

            <Route
              path="/categories"
              element={
                <DefaultLayout>
                  <Category />
                  <Products />
                </DefaultLayout>
              }
            />
          </Routes>
        </div>
      </Router>
    </MyProvider>
  );
}
export default App;
