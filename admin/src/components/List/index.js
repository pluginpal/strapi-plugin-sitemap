import React from 'react';
import { useGlobalContext } from 'strapi-helper-plugin';
import { List } from '@buffetjs/custom';

import CustomRow from './Row';

const ListComponent = (props) => {
  const globalContext = useGlobalContext();
  const { items, openModal, title, subtitle, prependSlash } = props;
  const formattedItems = [];

  if (!items) {
    return null;
  }

  items.map((item, key) => {
    const formattedItem = {};
    formattedItem.name = key;
    formattedItem.priority = item.get('priority');
    formattedItem.changefreq = item.get('changefreq');
    formattedItem.onDelete = props.onDelete;

    formattedItems.push(formattedItem);
  });

  const listProps = {
    title,
    subtitle,
    button: {
      color: 'secondary',
      icon: true,
      label: globalContext.formatMessage({ id: 'sitemap.Button.Add' }),
      onClick: () => openModal(),
      type: 'button',
      hidden: items.size === 0,
    },
  };

  return (
    <div style={{ paddingTop: 20, backgroundColor: 'white' }}>
      <List
        {...listProps}
        items={formattedItems}
        customRowComponent={(listRowProps) => <CustomRow {...listRowProps} prependSlash={prependSlash} openModal={openModal} />}
      />
    </div>
  );
};

export default ListComponent;
