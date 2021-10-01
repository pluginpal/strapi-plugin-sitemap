import React from 'react';
import { IconLinks } from '@buffetjs/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import EditIcon from '@strapi/icons/EditIcon';
import DeleteIcon from '@strapi/icons/DeleteIcon';
import DropdownIcon from '@strapi/icons/FilterDropdown';
import AddIcon from '@strapi/icons/AddIcon';
import { Box } from '@strapi/parts/Box';
import { Row } from '@strapi/parts/Row';
import { VisuallyHidden } from '@strapi/parts/VisuallyHidden';
import { BaseCheckbox } from '@strapi/parts/BaseCheckbox';
import { Table, Thead, Tbody, Tr, Td, Th, TFooter } from '@strapi/parts/Table';
import { Text, TableLabel } from '@strapi/parts/Text';
import { Avatar } from '@strapi/parts/Avatar';
import { IconButton } from '@strapi/parts/IconButton';

import {
  faTrash,
  faPencilAlt,
} from '@fortawesome/free-solid-svg-icons';

const CustomRow = ({ prependSlash, openModal, entry }) => {
  const styles = {
    name: {
      textTransform: !prependSlash ? 'capitalize' : 'none',
    },
  };

  const handleEditClick = (e) => {
    openModal(entry.name);
    e.stopPropagation();
  };

  const handleDeleteClick = (e) => {
    entry.onDelete(entry.name);
    e.stopPropagation();
  };

  return (
    <Tr key={entry.id}>
      <Td>
        <Text textColor="neutral800">{entry.name}</Text>
      </Td>
      <Td>
        <Text textColor="neutral800">{entry.priority}</Text>
      </Td>
      <Td>
        <Text textColor="neutral800">{entry.changefreq}</Text>
      </Td>
      <Td>
        <Row>
          <IconButton onClick={handleEditClick} label="Edit" noBorder icon={<EditIcon />} />
          <Box paddingLeft={1}>
            <IconButton onClick={handleDeleteClick} label="Delete" noBorder icon={<DeleteIcon />} />
          </Box>
        </Row>
      </Td>
    </Tr>
  );

  // return (
  //   <tr>
  //     <td>
  //       <p style={styles.name}>{prependSlash && '/'}{name}</p>
  //     </td>
  //     <td>
  //       <p>{changefreq}</p>
  //     </td>
  //     <td>
  //       <p>{priority}</p>
  //     </td>
  //     <td>
  //       <IconLinks links={[
  //         {
  //           icon: <FontAwesomeIcon icon={faPencilAlt} />,
  //           onClick: handleEditClick,
  //         },
  //         {
  //           icon: <FontAwesomeIcon icon={faTrash} />,
  //           onClick: handleDeleteClick,
  //         },
  //       ]} />
  //     </td>
  //   </tr>
  // );
};

export default CustomRow;
