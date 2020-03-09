import React from 'react';
import { List } from '@buffetjs/custom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrash,
  faPencilAlt,
  faCube,
} from '@fortawesome/free-solid-svg-icons';


export default function Example() {
  const props = {
    title: 'Best Top Chefs',
    subtitle: 'The most successful French Top Chefs',
    button: {
      color: 'secondary',
      icon: true,
      label: 'New',
      onClick: () => alert('Do you want to create a new chief entry?'),
      type: 'button',
    },
  };

  const handleEditClick = e => {
    alert('Edit');
    e.stopPropagation();
  };

  const handleDeleteClick = e => {
    alert('Delete');
    e.stopPropagation();
  };

  const rows = [
    {
      icon: <FontAwesomeIcon icon={faCube} />,
      name: 'ratatouille',
      description:
        'Bacon ipsum dolor amet boudin shankle picanha shoulder bacon.',
      links: [
        {
          icon: <FontAwesomeIcon icon={faPencilAlt} />,
          onClick: handleEditClick,
        },
        {
          icon: <FontAwesomeIcon icon={faTrash} />,
          onClick: handleDeleteClick,
        },
      ],
      onClick: () => alert('Ratatouille'),
    },
    {
      icon: <FontAwesomeIcon icon={faCube} />,
      name: 'users',
      description: 'Tenderloin drumstick cupim cow.',
      links: [
        {
          icon: <FontAwesomeIcon icon={faPencilAlt} />,
          onClick: handleEditClick,
        },
        {
          icon: <FontAwesomeIcon icon={faTrash} />,
          onClick: handleDeleteClick,
        },
      ],
      onClick: () => alert('Users'),
    },
  ];

  return (
    <List
      {...props}
      items={rows}
      customRowComponent={props => <CustomRow {...props} />}
    />
  );
}