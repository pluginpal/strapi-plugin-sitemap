import * as React from 'react';

import {
  Grid,
  Typography,
  Flex,
  Button,
} from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import SelectConditional from '../../../SelectConditional';
import { onChangeContentTypes } from '../../../../state/actions/Sitemap';

// eslint-disable-next-line arrow-body-style
const Filters = (props) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const [conditionCount, setConditionCount] = React.useState(0);
  const {
    modifiedState,
    uid,
    langcode,
    contentTypes,
  } = props;

  console.log(modifiedState);

  React.useEffect(() => {
    // get the initial condition count
    const count = Object.keys(modifiedState.getIn([uid, 'filters'], [])).length;
    setConditionCount(count);
  }, [uid, langcode]);

  const handleRemoveCondition = () => {
    dispatch(onChangeContentTypes(uid, null, ['filters', conditionCount, 'field'], ''));
    dispatch(onChangeContentTypes(uid, null, ['filters', conditionCount, 'operator'], ''));
    dispatch(onChangeContentTypes(uid, null, ['filters', conditionCount, 'value'], ''));
    setConditionCount(conditionCount - 1);
  };
  return (
    <div>
      {conditionCount === 0 ? (
        <Flex direction="column" alignItems="stretch">
          <Flex direction="row" justifyContent="space-between">
            <Flex direction="column" justifyContent="center" alignItems="flex-start">
              <Typography variant="pi" fontWeight="bold">
                {formatMessage({ id: 'sitemap.Settings.Field.Condition.Label', defaultMessage: 'Conditional Filtering' })}
              </Typography>
              <Typography>
                {formatMessage({ id: 'sitemap.Settings.Field.Condition.Description', defaultMessage: 'Only include URLs that match the following condition.' })}
              </Typography>
            </Flex>
            <Flex direction="row" alignItems="center" gap={2}>
              <Button onClick={() => setConditionCount(conditionCount + 1)}>
                {formatMessage({ id: 'sitemap.Settings.Field.Condition.Add', defaultMessage: 'Add' })}
              </Button>
              <Button variant="secondary" onClick={() => handleRemoveCondition()}>
                {formatMessage({ id: 'sitemap.Settings.Field.Condition.Remove', defaultMessage: 'Remove' })}
              </Button>
            </Flex>
          </Flex>
        </Flex>
      ) : (
        <Flex direction="column" alignItems="stretch">
          <Flex direction="row" justifyContent="space-between" style={{ marginBottom: '2rem' }}>
            <Flex direction="column" justifyContent="center" alignItems="flex-start">
              <Typography variant="pi" fontWeight="bold">
                {formatMessage({ id: 'sitemap.Settings.Field.Condition.Label', defaultMessage: 'Conditional Filtering' })}
              </Typography>
              <Typography>
                {formatMessage({ id: 'sitemap.Settings.Field.Condition.Description', defaultMessage: 'Only include URLs that match the following conditions.' })}
              </Typography>
            </Flex>
            <Flex direction="row" alignItems="center" gap={2}>
              <Button onClick={() => setConditionCount(conditionCount + 1)}>
                {formatMessage({ id: 'sitemap.Settings.Field.Condition.Add', defaultMessage: 'Add' })}
              </Button>
              <Button variant="secondary" onClick={() => handleRemoveCondition()}>
                {formatMessage({ id: 'sitemap.Settings.Field.Condition.Remove', defaultMessage: 'Remove' })}
              </Button>
            </Flex>
          </Flex>
          {Array.from(Array(conditionCount).keys()).map((i) => (
            <Grid gap={4} style={{ marginBottom: '1rem' }}>
              <SelectConditional
                disabled={!uid || (contentTypes[uid].locales && !langcode)}
                contentType={contentTypes[uid]}
                onConditionChange={(value) => dispatch(onChangeContentTypes(uid, null, ['filters', String(i), 'field'], value))}
                onOperatorChange={(value) => dispatch(onChangeContentTypes(uid, null, ['filters', String(i), 'operator'], value))}
                onValueChange={(value) => dispatch(onChangeContentTypes(uid, null, ['filters', String(i), 'value'], value))}
                condition={modifiedState.getIn([uid, 'filters', String(i), 'field'], '')}
                conditionOperator={modifiedState.getIn([uid, 'filters', String(i), 'operator'], '')}
                conditionValue={modifiedState.getIn([uid, 'filters', String(i), 'value'], '')}
              />
            </Grid>
          ))}
        </Flex>
      )}
    </div>
  );
};

export default Filters;
