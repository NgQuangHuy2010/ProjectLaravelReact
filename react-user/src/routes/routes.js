import config from '~/config'
import Home from '~/pages/Home'
import Following from '~/pages/Following'
import Profile from '~/pages/Profile'
import Search from '~/components/Search/Search'
const publicRoutes =[
{path : config.routes.home , component:Home },
{path : config.routes.following , component:Following },
{path : config.routes.profile , component:Profile }, //ko can @ van tu match
{path : config.routes.search , component:Search,layout: null },


]
const privateRoutes =[
   // router privateRoutes này có thể dùng để ko login ko coi dc 
]
export {publicRoutes,privateRoutes}