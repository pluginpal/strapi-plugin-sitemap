import React from 'react';
import { useIntl } from 'react-intl';

import AddIcon from '@strapi/icons/AddIcon';
import { Box } from '@strapi/parts/Box';
import { VisuallyHidden } from '@strapi/parts/VisuallyHidden';
import { Table, Thead, Tbody, Tr, Th, TFooter } from '@strapi/parts/Table';
import { TableLabel } from '@strapi/parts/Text';

import CustomRow from './Row';

const ListComponent = (props) => {
  const { formatMessage } = useIntl();
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
      label: formatMessage({ id: 'sitemap.Button.Add' }),
      onClick: () => openModal(),
      type: 'button',
      hidden: items.size === 0,
    },
  };

  const ROW_COUNT = 6;
  const COL_COUNT = 10;
  const entry = {
    cover: 'https://avatars.githubusercontent.com/u/3874873?v=4',
    description: 'Chez Léon is a human sized Parisian',
    category: 'French cuisine',
    contact: 'Leon Lafrite'
  };
  const entries = [];

  for (let i = 0; i < 5; i++) {
    entries.push({ ...entry,
      id: i
    });
  }

  return (
    <Box padding={8} background="neutral100">
      <Table colCount={COL_COUNT} rowCount={ROW_COUNT} footer={<TFooter onClick={() => openModal()} icon={<AddIcon />}>Add another field to this collection type</TFooter>}>
        <Thead>
          <Tr>
            <Th>
              <TableLabel>URL</TableLabel>
            </Th>
            <Th>
              <TableLabel>Priority</TableLabel>
            </Th>
            <Th>
              <TableLabel>ChangeFreq</TableLabel>
            </Th>
            <Th>
              <VisuallyHidden>Actions</VisuallyHidden>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {items.map((item) => (
            <CustomRow key={item.name} entry={item} />
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ListComponent;

// return (
//   <div style={{ paddingTop: 20, backgroundColor: 'white' }}>
//     <List
//       {...listProps}
//       items={formattedItems}
//       customRowComponent={(listRowProps) => <CustomRow {...listRowProps} prependSlash={prependSlash} openModal={openModal} />}
//     />
//   </div>
// );
