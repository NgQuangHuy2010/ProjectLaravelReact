import config from '~/config'
import Home from '~/pages/Home'
import Products from '~/pages/Products'
import Profile from '~/pages/Profile'
import Search from '~/components/Search/Search'
import ProductDetails from '~/pages/ProductDetails'
const publicRoutes =[
{path : config.routes.home , component:Home },
{path : config.routes.products , component:Products },
{path : config.routes.profile , component:Profile }, //ko can @ van tu match
{path : config.routes.search , component:Search,layout: null },
{path : config.routes.productDetails , component:ProductDetails },


]
const privateRoutes =[
   // router privateRoutes này có thể dùng để ko login ko coi dc 
]
export {publicRoutes,privateRoutes}