import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import {
  addQuickLink,
  updateQuickLink,
  saveQuickLink,
  removeQuickLink,
} from '../actions/voz';

@autobind
class QuickLink extends Component {
  static propTypes = {
    quickLinks: PropTypes.array,
    dispatch: PropTypes.func,
  }

  constructor(comProps) {
    super(comProps);

    this.state = {
      showQuickLink: false,
    };
  }

  addQuickLink() {
    this.props.dispatch(addQuickLink());
  }

  updateQuickLink(event, id, key) {
    this.props.dispatch(updateQuickLink(id, key, event.target.value));
  }

  saveQuickLink() {
    this.props.dispatch(saveQuickLink());
  }

  removeQuickLink(qlink) {
    this.props.dispatch(removeQuickLink(qlink.id));
  }

  renderAddButton() {
    const { quickLinks = [] } = this.props;

    return (
      <div className="btn-group">
        <div
          className="btn"
          onClick={() => this.setState({ showQuickLink: !this.state.showQuickLink })}
        ><i className="fa fa-plus"></i></div>
        {quickLinks.map(qlink => (
          <a
            key={qlink.id}
            href={qlink.link}
            className="btn"
          >{qlink.label}</a>
        ))}
        {(() => {
          if (this.state.showQuickLink) {
            return (
              <div className="btn-options">
                <h3>Quick Links</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Label</th>
                      <th>Link</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quickLinks.map(qlink => (
                      <tr key={qlink.id}>
                        <td>
                          <input
                            value={qlink.label}
                            onChange={(event) => this.updateQuickLink(event, qlink.id, 'label')}
                          />
                        </td>
                        <td>
                          <input
                            value={qlink.link}
                            onChange={(event) => this.updateQuickLink(event, qlink.id, 'link')}
                          />
                        </td>
                        <td><button onClick={() => this.removeQuickLink(qlink)}>Remove</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div>
                  <button onClick={this.addQuickLink}>Add</button>
                  <button onClick={this.saveQuickLink}>Save</button>
                </div>
              </div>
            );
          }
          return null;
        })()}
      </div>
    );
  }

  render() {
    return (
      <div>{this.renderAddButton()}</div>
    );
  }
}

const mapStateToProps = state => {
  const { quickLinks } = state.vozLiving;
  return { quickLinks };
};

export default connect(mapStateToProps)(QuickLink);
