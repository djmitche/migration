import React from 'react';
import Panel from 'react-bootstrap/lib/Panel';
import Row from 'react-bootstrap/lib/Row';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Badge from 'react-bootstrap/lib/Badge';
import Col from 'react-bootstrap/lib/Col';
import { Link } from 'react-router';

export default React.createClass({
  contextTypes: {
    graph: React.PropTypes.object.isRequired,
  },

  propTypes: {
    node: React.PropTypes.object,
    detailed: React.PropTypes.bool,
  },

  getInitialState() {
    return {
      detailed: this.props.detailed,
    };
  },

  render() {
    const node = this.props.node;
    const header = (
      <span>
        {this.state.detailed ?
          node.name :
          <Link to={`/item/${node.name}`}>{node.name}</Link>}
        {this.state.detailed || (
          <span className="pull-right" onClick={() => this.setState({ detailed: true })}>
            <Glyphicon bsSize="xsmall" glyph="option-vertical" />
          </span>)
        }
      </span>
    );
    const footer = (
      <Row>
        <Col xs={6}>
          {node.bug &&
            <a href={`https://bugzilla.mozilla.org/show_bug.cgi?id=${node.bug}`}
               target="_blank">#{node.bug}</a>
          }
        </Col>
        <Col className="text-right" xs={6}>
          {node.assigned && (
              <span>Assigned To: <Link to={`/person/${node.assigned}`}>{node.assigned}</Link></span>
            )}
        </Col>
      </Row>
    );
    const className = `wi-${node.state}`;
    const revDeps = this.context.graph.reverseDependencies(node.name);
    const showDep = dep => {
      const depState = this.context.graph.byName[dep].state;
      return (
        <div key={dep}>
          <Badge className={`wi-${depState}`}>{depState}</Badge>
          &nbsp;
          <Link to={`/item/${dep}`}>{dep}</Link>
        </div>
      );
    };

    return (
      <Panel className={className} header={header} footer={footer}>
        {node.title}
        {node.description ? <p className="text-muted">{node.description}</p> : null}
        {this.state.detailed && (
          <dl className="dl-horizontal">
            <dt>State:</dt>
            <dd>{node.state}</dd>
            {node.external && <dt>External:</dt>}
            {node.external && <dd>yes</dd>}
            {node.milestone && <dt>Milestone:</dt>}
            {node.milestone && <dd>yes</dd>}
            {typeof node.duration === 'number' && <dt>Duration</dt>}
            {typeof node.duration === 'number' && <dd>{node.duration} days</dd>}
            {node.dependencies.length > 0 && <dt>Dependencies:</dt>}
            {node.dependencies.length > 0 && (
              <dd>
                {node.dependencies.map(showDep)}
              </dd>
            )}
            {revDeps.length > 0 && <dt>Depended On By:</dt>}
            {revDeps.length > 0 && (
              <dd>
                {revDeps.map(showDep)}
              </dd>
            )}
          </dl>
        )}
      </Panel>
    );
  },
});
