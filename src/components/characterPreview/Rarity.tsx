import React from 'react';
import PropTypes from 'prop-types';
import { Flex } from 'antd';

import { Assets } from 'lib/assets';

const Rarity = ({
  rarity = 0,
}) => {
  const children = []
  for (let i = 0; i < rarity; i++) {
    children.push(
      <img src={Assets.getStar()} key={i} style={{ width: 20, height: 20 }} />
    )
  }
  return (
    <Flex gap={0} align='center'>
      {children}
    </Flex>
  )
}

Rarity.propTypes = {
  rarity: PropTypes.number,
};

export default Rarity;