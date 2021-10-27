import React from 'react';

import { Map } from 'immutable';
import { useIntl } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';

import { useNotification } from '@strapi/helper-plugin';
import { Text, H3 } from '@strapi/design-system/Text';
import { Box } from '@strapi/design-system/Box';
import { Button } from '@strapi/design-system/Button';
import { Link } from '@strapi/design-system/Link';
import { TextInput } from '@strapi/design-system/TextInput';

import { generateSitemap, onChangeSettings } from '../../state/actions/Sitemap';
import { formatTime } from '../../helpers/timeFormat';

const Info = () => {
  const settings = useSelector((state) => state.getIn(['sitemap', 'settings'], Map()));
  const hasHostname = useSelector((state) => state.getIn(['sitemap', 'initialData', 'hostname'], Map()));
  const sitemapInfo = useSelector((state) => state.getIn(['sitemap', 'info'], Map()));
  const dispatch = useDispatch();
  const toggleNotification = useNotification();
  const { formatMessage } = useIntl();

  const updateDate = new Date(sitemapInfo.get('updateTime'));

  // Format month, day and time.
  const month = updateDate.toLocaleString('en', { month: 'numeric' });
  const day = updateDate.toLocaleString('en', { day: 'numeric' });
  const year = updateDate.getFullYear().toString().substr(-2);
  const time = formatTime(updateDate, true);

  const content = () => {
    if (!hasHostname) {
      return (
        <div>
          <H3 style={{ marginBottom: '10px' }}>
            Set your hostname
          </H3>
          <div>
            <Text>
              Before you can generate the sitemap you have to specify the hostname of your website.
            </Text>
            <Box paddingTop={4}>
              <TextInput
                placeholder="https://www.strapi.io"
                label={formatMessage({ id: 'sitemap.Settings.Field.Hostname.Label' })}
                name="hostname"
                value={settings.get('hostname')}
                onChange={(e) => dispatch(onChangeSettings('hostname', e.target.value))}
              />
            </Box>
          </div>
        </div>
      );
    } else if (sitemapInfo.size === 0) {
      return (
        <div>
          <H3 style={{ marginBottom: '10px' }}>
            No sitemap XML present
          </H3>
          <div>
            <Text>
              Generate your first sitemap XML with the button below.
            </Text>
            <Button
              onClick={() => dispatch(generateSitemap(toggleNotification))}
              variant="secondary"
              style={{ marginTop: '15px' }}
            >
              {formatMessage({ id: 'sitemap.Header.Button.Generate' })}
            </Button>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <H3 style={{ marginBottom: '10px' }}>
            Sitemap XML is present
          </H3>
          <div>
            <Text>
              Last updated at:
            </Text>
            <Text bold style={{ marginLeft: '5px' }}>
              {`${month}/${day}/${year} - ${time}`}
            </Text>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <Text>
              Amount of URLs:
            </Text>
            <Text bold style={{ marginLeft: '5px' }}>
              {sitemapInfo.get('urls')}
            </Text>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <Button
              onClick={() => dispatch(generateSitemap(toggleNotification))}
              variant="secondary"
              style={{ marginRight: '10px' }}
            >
              {formatMessage({ id: 'sitemap.Header.Button.Generate' })}
            </Button>
            <Link
              href={sitemapInfo.get('location')}
              target="_blank"
            >
              Go to the sitemap
            </Link>
          </div>
        </div>
      );
    }
  };

  return (
    <Box paddingLeft={8} paddingRight={8}>
      <Box
        borderColor="secondary200"
        background="secondary100"
        hasRadius
        paddingTop={4}
        paddingBottom={4}
        paddingLeft={5}
        paddingRight={5}
      >
        {content()}
      </Box>
    </Box>
  );
};

export default Info;
