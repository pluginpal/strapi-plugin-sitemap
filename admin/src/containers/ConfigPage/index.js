/*
 *
 * ConfigPage
 *
 */

import React, { Component } from 'react';
import pluginId from '../../pluginId';
import { isEmpty } from 'lodash';

import { ContainerFluid, HeaderNav } from 'strapi-helper-plugin';
import Header from '../../components/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import List from '../../components/List';
import { Button } from '@buffetjs/core';
import ModalForm from '../../components/ModalForm';
import { submit, getSettings, populateSettings, getContentTypes, onChangeContentTypes, submitModal, onChangeSettings, deleteContentType, generateSitemap, discardAllChanges, discardModifiedContentTypes } from './actions';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import selectConfigPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import SettingsForm from '../../components/SettingsForm';
import Wrapper from '../../components/Wrapper';
import { GlobalContext } from 'strapi-helper-plugin'

class ConfigPage extends Component {
  static contextType = GlobalContext;

  headerNavLinks = [
    {
      name: 'Collection entries',
      to: `/plugins/${pluginId}/collection-entries`,
    },
    {
      name: 'Custom entries',
      to: `/plugins/${pluginId}/custom-entries`,
    },
  ];

  constructor(props) {
    super(props);

    this.state = {
      settingsType: ''
    }
  }
  
  componentDidMount() {
    this.props.getSettings();
    this.props.getContentTypes();
    this.setState({ 'settingsType': this.getSettingsType()});
  }

  componentDidUpdate(prevProps) {
    // Get new settings on navigation change
    if (prevProps.match.params.env !== this.props.match.params.env) {
      this.props.getSettings();
    }

    if (prevProps.match.path !== this.props.match.path) {
      this.setState({ 'settingsType': this.getSettingsType()});
    }
  }

  getSettingsType() {
    const settingsUrl = this.props.match.path.split("/").pop();
    const settingsType =
      settingsUrl === 'collection-entries' ? 'Collection' :
      settingsUrl === 'custom-entries' && 'Custom';

    return settingsType;
  }

  handleModalSubmit(e) {
    e.preventDefault();
    return this.props.submitModal();
  }

  handleSubmit(e) {
    e.preventDefault();
    return this.props.submit();
  }

  render() {
    if (isEmpty(this.props.contentTypes)) {
      return (<div />);
    }

    console.log('settings: ', this.props.settings);

    return (
      <div>
        <ContainerFluid>
          <Header 
            onSubmit={(e) => this.handleSubmit(e)}
            onCancel={(e) => this.props.discardAllChanges()}
            settings={this.props.settings}
            initialData={this.props.initialData}
            generateSitemap={this.props.generateSitemap}
          />
          <HeaderNav
            links={this.headerNavLinks}
            style={{ marginTop: '4.6rem' }}
          />
          <List 
            settingsType={this.state.settingsType}
            settings={this.props.settings}
            onDelete={this.props.deleteContentType}
          />
          <Wrapper style={{ paddingTop: 0, paddingBottom: 0, marginBottom: 0 }}>
            <Button 
              color="primary" 
              icon={<FontAwesomeIcon icon={faPlus} />} 
              label={this.context.formatMessage({ id: 'sitemap.Button.AddAll' })}
              onClick={() => this.props.populateSettings()}
              hidden={this.state.settingsType === 'Custom' || !isEmpty(this.props.settings.contentTypes)}
            />
            <Button 
              color="primary" 
              icon={<FontAwesomeIcon icon={faPlus} />} 
              label={this.context.formatMessage({ id: 'sitemap.Button.AddURL' })}
              onClick={() => this.props.history.push({ search: 'addNew' })}
              hidden={this.state.settingsType === 'Collection' || !isEmpty(this.props.settings.customEntries)}
            />
            <Button 
              color="secondary"
              style={{ marginLeft: 15 }}
              icon={<FontAwesomeIcon icon={faPlus} />} 
              label={this.context.formatMessage({ id: 'sitemap.Button.Add1by1' })}
              onClick={() => this.props.history.push({ search: 'addNew' })}
              hidden={this.state.settingsType === 'Custom' || !isEmpty(this.props.settings.contentTypes)}
            />
          </Wrapper>
          <ModalForm 
            contentTypes={this.props.contentTypes}
            modifiedContentTypes={this.props.modifiedContentTypes}
            modifiedCustomEntries={this.props.modifiedCustomEntries}
            settings={this.props.settings}
            settingsType={this.state.settingsType}
            onSubmit={(e) => this.handleModalSubmit(e)}
            onCancel={this.props.discardModifiedContentTypes}
            onChange={this.props.onChangeContentTypes}
          />
          <SettingsForm 
            onChange={this.props.onChangeSettings} 
            settings={this.props.settings}
          />
        </ContainerFluid>
      </div>
    );
  }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getSettings,
      getContentTypes,
      deleteContentType,
      discardAllChanges,
      discardModifiedContentTypes,
      onChangeContentTypes,
      onChangeSettings,
      submit,
      populateSettings,
      submitModal,
      generateSitemap
    },
    dispatch
  );
}

const mapStateToProps = selectConfigPage();

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withReducer = strapi.injectReducer({
  key: 'configPage',
  reducer,
  pluginId,
});
const withSaga = strapi.injectSaga({ key: 'configPage', saga, pluginId });

export default compose(
  withReducer,
  withSaga,
  withConnect
)(ConfigPage);
