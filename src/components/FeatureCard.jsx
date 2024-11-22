// FeatureCard.jsx
import React from 'react';
import { Card, Image, Text, Group } from '@mantine/core';
import notebook from '../assets/notebook.jpg'

const FeatureCard = ({ title, altText }) => {
  return (
    <Card
      shadow="sm"
      padding="sm"
      radius="md"
      sx={{
        width: '1250px',
        height: '250px',
      }}
      withBorder
    >
      <Card.Section>
        <Image src={notebook} height={100} width={100} alt={altText} />
      </Card.Section>
      <Group position="apart" mt="sm" mb="xs">
        <Text weight={500} size="sm">
          {title}
        </Text>
      </Group>
    </Card>
  );
};

export default FeatureCard;
