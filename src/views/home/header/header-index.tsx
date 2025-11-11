//头部布局
import ContextTop from "./top/context/context-top"
import ContextFooter from "./footer/context-footer"
import styles from '../../../styles/home/header-layout.module.scss'
import HomePageLayout from "../../../components/layout/home-page-layout"
const HeaderIndex = () =>{

return(

      <HomePageLayout
  HeaderTop={<ContextTop />} 
  ContentCenter={<ContextFooter />}
  styles={styles}
  />
)

}

export default HeaderIndex