import React from 'react';
import { Card } from 'antd';

interface CardsProps {
  className?: any;
}

const Cards: React.FC<CardsProps> = ({ className }) => (
  <Card title="Card title" variant="borderless" className={className}>
    <p>Card content</p>
    <p>Card content</p>
    <p>Card content</p>
  </Card>
);

export default Cards;