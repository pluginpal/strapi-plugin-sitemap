import React from 'react';
import { useHistory } from 'react-router-dom';
import { useGlobalContext } from 'strapi-helper-plugin';
import { isEmpty } from 'lodash';

import CustomRow from './Row';
import { List } from '@buffetjs/custom';

const ListComponent = (props) => {
  const globalContext = useGlobalContext();
  const { items, openModal, title, subtitle, prependSlash } = props;
  const formattedItems = [];

  if (!items) {
    return null;
  }

  items.map((item, key) => {
    let formattedItem = {};
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
      onClick: openModal,
      type: 'button',
      hidden: items.size === 0,
    },
  };

  return (
    <div style={{ paddingTop: 20, backgroundColor: 'white' }}>
      <List 
        {...listProps} 
        items={formattedItems}  
        customRowComponent={listProps => <CustomRow {...listProps} prependSlash={prependSlash} />}
      />
    </div>
  );
}
 
export default ListComponent;