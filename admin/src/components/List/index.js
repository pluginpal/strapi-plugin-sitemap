import React from 'react';
import { useHistory } from 'react-router-dom';
import { useGlobalContext } from 'strapi-helper-plugin';
import { isEmpty } from 'lodash';

import CustomRow from './Row';
import { List } from '@buffetjs/custom';

const ListComponent = (props) => {
  const { push } = useHistory();
  const globalContext = useGlobalContext();
  const { settings, settingsType } = props;
  const items = [];

  if (settings.contentTypes && settingsType === 'Collection') {
    Object.keys(settings.contentTypes).map((i) => {
      let item = {};
      item.name = i;
      item.priority = settings.contentTypes[i].priority
      item.changefreq = settings.contentTypes[i].changefreq
      item.onDelete = props.onDelete;

      items.push(item);
    });
  } else if (settings.customEntries && settingsType === 'Custom') {
    Object.keys(settings.customEntries).map((i) => {
      let item = {};
      item.name = i;
      item.priority = settings.customEntries[i].priority
      item.changefreq = settings.customEntries[i].changefreq
      item.onDelete = props.onDelete;

      items.push(item);
    });
  }

  const handleClick = () => {
    push({ search: 'addNew' });
  }

  const listProps = {
    title: globalContext.formatMessage({ id: `sitemap.Settings.${settingsType}Title` }),
    subtitle: globalContext.formatMessage({ id: `sitemap.Settings.${settingsType}Description` }),
    button: {
      color: 'secondary',
      icon: true,
      label: globalContext.formatMessage({ id: 'sitemap.Button.Add' }),
      onClick: handleClick,
      type: 'button',
      hidden: settingsType === 'Collection' ? isEmpty(settings.contentTypes) : isEmpty(settings.customEntries)
    },
  };

  return (
    <div style={{ paddingTop: 20, backgroundColor: 'white' }}>
      <List 
        {...listProps} 
        items={items}  
        customRowComponent={listProps => <CustomRow {...listProps} settingsType={settingsType} />}
      />
    </div>
  );
}
 
export default ListComponent;