import { Carousel } from 'antd';

interface CarouselItem {
    id: number;
    content: string;
    image: string;
}

interface HomeCarouselProps {
    carouselItems: CarouselItem[];
    styles?: {
      carousel?: any;
      div?: any;
      div_img?: any;
      div_carousel?: any;
    };
  }

const HomeCarousel = ({ carouselItems, styles={} }: HomeCarouselProps) => (
    <div className={styles.div}>

        <Carousel autoplay={{ dotDuration: true }} autoplaySpeed={4000} className={styles.carousel}>
            {carouselItems.map((item) => (
                <div key={item.id} className={styles.div_carousel}>
                    {<img className={styles.div_img} src={item.image} alt={item.content} /> }
                </div>
            ))}

        </Carousel>


    </div>
);



export default HomeCarousel;


