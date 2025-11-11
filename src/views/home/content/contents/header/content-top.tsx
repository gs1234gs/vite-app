import ImgCard from "../../../../../components/card/img-card";
import styles from '..\/styles/img-card.module.scss'
import {type CardData } from "../../../../../components/card/img-card";

const cardData : CardData={
        title: "Europe Street beat",
        description: "www.instagram.com",
        imgUrl: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
    }


const CardsContentIndex = () => (
  <div className={styles.div_container}>
    <ImgCard
    className={styles.navCard}
    data={cardData}
  
    />
  </div>
);

export default CardsContentIndex;