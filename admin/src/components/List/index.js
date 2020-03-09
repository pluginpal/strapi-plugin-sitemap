import React from 'react';
import { useHistory } from 'react-router-dom';
import { useGlobalContext } from 'strapi-helper-plugin';

import CustomRow from './Row';
import { List } from '@buffetjs/custom';

const ListComponent = (props) => {
  const { push } = useHistory();
  const globalContext = useGlobalContext();
  const { settings } = props;
  const items = [];

  if (settings.contentTypes) {
    Object.keys(settings.contentTypes).map((i) => {
      let item = {};
      item.name = i;
      item.priority = settings.contentTypes[i].priority
      item.changefreq = settings.contentTypes[i].changefreq
      item.onClick = () => alert('Ratatouille');
      item.onDelete = props.onDelete;

      items.push(item);
    });
  }

  const handleClick = () => {
    push({ search: 'addNew' });
  }

  const listProps = {
    title: globalContext.formatMessage({ id: 'sitemap.Settings.Title' }),
    subtitle: globalContext.formatMessage({ id: 'sitemap.Settings.Description' }),
    button: {
      color: 'secondary',
      icon: true,
      label: globalContext.formatMessage({ id: 'sitemap.Button.Add' }),
      onClick: handleClick,
      type: 'button',
    },
  };

  return (
    <div>
      <List 
        {...listProps} 
        items={items}  
        customRowComponent={listProps => <CustomRow {...listProps} />}
      />
    </div>
  );
}
 
export default ListComponent;