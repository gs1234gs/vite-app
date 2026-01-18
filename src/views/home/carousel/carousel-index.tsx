// import Cards from '../../../components/card/card.tsx'
// import Carousel from '../../../components/carousel/carousel.tsx'
import styles from '@/views/home/carousel/styles/content-index.module.scss'
import CardCarousel from '@/views/home/carousel/component/card-carousel'
// import style from './styles/carousel.module.scss'
// import HomeCarousel from './components/top/home-carousel.tsx';
// import CardsIndex from './components/top/home-card.tsx';
// import Cards from '../../../components/card/card.tsx';

// // 引入图片
// import picture1 from '@/assets/picture/1.jpg';
// import picture2 from '@/assets/picture/2.jpg';
// import picture3 from '@/assets/picture/3.jpg';
// import picture4 from '@/assets/picture/4.jpg';
// import picture5 from '@/assets/picture/5.jpg';
// import picture6 from '@/assets/picture/6.jpg';
// import picture7 from '@/assets/picture/7.jpg';


// const carouselItems = [
//     { id: 1, content: '1', image: picture1 },
//     { id: 2, content: '2', image: picture2 },
//     { id: 3, content: '3', image: picture3 },
//     { id: 4, content: '4', image: picture4 },
//     { id: 5, content: '5', image: picture5 },
//     { id: 6, content: '6', image: picture6 },
//     { id: 7, content: '7', image: picture7 },
// ];
const CarouselIndex = () => {
    return (
        <>

            <div className={styles.div}>
                {/* 
           <h1 style={{color:'black',top:100}}>hello react</h1> */}
                {/* <div className={style.carousel}>
                    <Carousel 
                    carouselItems={carouselItems}
                    styles={style}
                    />
                </div> */}
                {/* <div className={styles.carousel}>
  <Carousel/>
           </div> */}
                {/* <HomeCarousel /> */}

                {/* <Cards className={styles.card} /> */}
                {/* <CardsIndex/> */}
                <CardCarousel />
            </div>

        </>
    )
}

export default CarouselIndex