import {BrowserRouter as Router, Routes,Route,Navigate} from 'react-router-dom'
import { publicRoutes } from '~/routes/routes.js'
import DefaultLayout from '~/layouts/DefaultLayout/DefaultLayout';


function App() {
  return (
    <Router>
      <div className="App">
         <Routes>
          {/* dùng naviagte đẻ chuyển hướng từ / sang /admin như cấu hình route */}
         <Route path="/" element={<Navigate to="/admin" />} />
           {publicRoutes.map((route,index)=>{
            const Layout = route.layout || DefaultLayout
            const Page = route.component
            return <Route  key={index} path={route.path}  element={<Layout><Page /></Layout>}/>
           })}
         </Routes>
      </div>
    </Router>
  );
}

export default App;
