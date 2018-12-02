import React from 'react';
import numeral from 'numeral';
import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';

var ImageAreaColumn = React.createClass({
	displayName: 'ImageAreaColumn',
	propTypes: {
		col: React.PropTypes.object,
		data: React.PropTypes.object,
	},
	renderValue () {
		const value = this.props.data.fields[this.props.col.path];
		if (value === undefined || isNaN(value)) return null;

		const formattedValue = (this.props.col.path === 'money') ? numeral(value).format('$0,0.00') : value;

		return formattedValue;
	},
	render () {
		return (
			<ItemsTableCell>
				<ItemsTableValue field={this.props.col.type}>
					{this.renderValue()}
				</ItemsTableValue>
			</ItemsTableCell>
		);
	},
});

module.exports = ImageAreaColumn;
