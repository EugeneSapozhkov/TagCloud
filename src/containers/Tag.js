import React, { Component } from 'react'
import {connect} from 'react-redux';
import { Grid, Badge } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';


class Tag extends Component {
	constructor() {
		super();

		this.state = {
			tag: null
		}
	}

	componentDidMount() {
		if (!this.props.tags.length) {
			this.props.history.push("/")
		}

		const params = this.props.location.search.replace("?tagId=", "");
		this.setState({ tag: this.props.tags.find(tag => tag.id === params) })
	}

	countTotalMentions = tag => {
		return Object.keys(tag.sentiment).reduce((acc, item) => acc + tag.sentiment[item], 0);
	};

	showSentiments = tag => {
		return Object.keys(tag.sentiment).map((field, index) => {
			// I know that index for react keys is shit
			return <p key={index}>Sentiment {field} <Badge>{tag.sentiment[field]}</Badge></p>
		})
	};

	showPageTypes = tag => {
		return <div id="pages">
			{
				Object.keys(tag.pageType).map((field, index) => {
					// I know that index for react keys is shit
					return <p key={index}>{field} <Badge>{tag.pageType[field]}</Badge></p>
				})
			}
		</div>
	};

	render() {
		const { tag } = this.state;

		return (
			<Grid xs={12}>
				{tag &&
					<>
						<h3>{tag.label}</h3>
						{this.showSentiments(tag)}
						<p>
							<b>Total Mentions:</b> <Badge>{this.countTotalMentions(tag)}</Badge>
							</p>

						{this.showPageTypes(tag)}
					</>
				}
			</Grid>
		)
	}
}

const mapStateToProps = state => ({
	tags: state.tagsReducer.tags,
});

export default withRouter(connect(mapStateToProps)(Tag));
