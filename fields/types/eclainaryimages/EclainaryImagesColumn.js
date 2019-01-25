import React from 'react';
import EclainaryImageSummary from '../../components/columns/EclainaryImageSummary';
import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';

const moreIndicatorStyle = {
	color: '#888',
	fontSize: '.8rem',
};

var EclainaryImagesColumn = React.createClass({
	displayName: 'EclainaryImagesColumn',
	propTypes: {
		col: React.PropTypes.object,
		data: React.PropTypes.object,
	},
	renderMany (value) {
		if (!value || !value.length) return;
		const items = [];
		for (let i = 0; i < 3; i++) {
			if (!value[i]) break;
			items.push(<EclainaryImageSummary key={'image' + i} image={value[i]} />);
		}
		if (value.length > 3) {
			items.push(<span key="more" style={moreIndicatorStyle}>[...{value.length - 3} more]</span>);
		}
		return items;
	},
	renderValue (value) {
		if (!value || !Object.keys(value).length) return;

		return <EclainaryImageSummary image={value} />;

	},
	render () {
		const value = this.props.data.fields[this.props.col.path];
		const many = value.length > 1;

		return (
			<ItemsTableCell>
				<ItemsTableValue field={this.props.col.type}>
					{many ? this.renderMany(value) : this.renderValue(value[0])}
				</ItemsTableValue>
			</ItemsTableCell>
		);
	},
});

module.exports = EclainaryImagesColumn;
