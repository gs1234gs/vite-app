import { Card } from 'antd';

const { Meta } = Card;
export interface CardData {
  title: string;
  description: string;
  imgUrl: string;
}
export interface CardsProps {
  className: string;
  data: CardData;
}

const ImgCard = ({  className,data}:CardsProps) => {
  // 核心逻辑：解构 data 并设置默认值
  const cardData = data || {
    title: 'Untitled',
    description: 'No description',
    imgUrl: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
  };
 
  
  return (

  <>
    <Card
    hoverable
    className={className}
    cover={<img alt="example" src={cardData.imgUrl} />}
  >
    <Meta title={cardData.title} description={cardData.description} />
  </Card>
  </>

);}

export default ImgCard;