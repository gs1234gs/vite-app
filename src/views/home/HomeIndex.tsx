
import HomePageLayout from "../../components/layout/home-page-layout"
import HeaderIndex from "./header/header-index"
import style from '../../styles/home/home-index.module.scss'
import CarouselIndex from "./carousel/carousel-index"
import styles from '../../styles/home/home_page_layout.module.scss'
import styleFooter from '../../styles/home/home-layout-footer.module.scss'
// import ContentsIndex from "./content/contents/contents-index"



// import HomePageLayout1 from "../../components/layout/home-page-layout1"
const HomeIndex = () => {
    return (
        <>
<div className={style.dv_container}>
       <HomePageLayout
            HeaderTop={<HeaderIndex />}
            ContentCenter={<CarouselIndex />}
            styles={styles}
        ></HomePageLayout>
</div>
<div className={styles.dv_container}>
       <HomePageLayout
       styles={styleFooter}
            // HeaderTop={<HeaderIndex />}
            // ContentCenter={<ContentIndex />}
            
        ></HomePageLayout>
</div>

</>
 
    )
}

export default HomeIndex