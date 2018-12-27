import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { tagsApi } from "modules/tags";
import { sortBy, reverse } from "lodash";
import randomColor from "randomcolor";


const insertedWordsCoordinates = [];

class Home extends Component {
	constructor(props) {
		super(props);

		// create a ref of the cloud container
		this.cloudTag = React.createRef();
		this.props.getTags();
	}

	componentDidMount() {
		this.cloudTag.current.focus();
	}

	createdCloud = tags => {
		// get center point of the container
		const center = {
			x: this.cloudTag.current.offsetWidth / 2,
			y: this.cloudTag.current.offsetHeight / 2
		};

		tags.forEach(tag => {
			// create word element before append
			const wordDOM = this.prepareDOMWord(tag);

			const turns = 5;
			const iterationPerCircle = 180;
			const compression = 0.8;

			let angle = 0;
			let radius = 0;

			// run algorithm by spiral
			for (let k = 0; k < turns * iterationPerCircle; k++) {
				radius += 0.3;
				angle += (Math.PI * 2) / iterationPerCircle;

				const x = center.x + radius * Math.cos(angle);
				const y = center.y + radius * compression * Math.sin(angle);

				// if now intersection, put element to the DOM and close function
				if (!this.checkIntersection(wordDOM, x, y)) {
					wordDOM.style.visibility = "visible";
					insertedWordsCoordinates.push(wordDOM.getBoundingClientRect());
					return;
				}
			}
		});
	};

	prepareDOMWord = word => {
		const wordContainer = document.createElement("div");
		wordContainer.style.position = "absolute";
		wordContainer.style.cursor = "pointer";
		wordContainer.style.color = randomColor({
			hue: 'red'
		});
		wordContainer.style.backgroundColor = "white";
		wordContainer.style.visibility = "hidden";
		wordContainer.className = "tag";

		// set font size depend on sentimentScore (using like a value)
		wordContainer.style.fontSize = Math.ceil(word.sentimentScore / 5) + "px";
		wordContainer.appendChild(document.createTextNode(word.label));

		wordContainer.addEventListener("click", () => this.props.history.push(`/tag?tagId=${word.id}`), false);

		// debug
		// wordContainer.style.border = "1px solid gray";

		return wordContainer;
	};

	checkIntersection = (wordDOM, x, y) => {
		// insert compare word into the DOM
		this.cloudTag.current.appendChild(wordDOM);

		// clarify position to the center
		wordDOM.style.left = x - wordDOM.offsetWidth  / 2 + "px";
		wordDOM.style.top  = y - wordDOM.offsetHeight / 2 + "px";

		// get word coordinates in the DOM
		const currentWord = wordDOM.getBoundingClientRect();

		// check intersection with DOM words
		for (let i = 0; i < insertedWordsCoordinates.length; i++) {
			if (!(
				currentWord.right  < insertedWordsCoordinates[i].left  ||
				currentWord.bottom < insertedWordsCoordinates[i].top   ||
				currentWord.left   > insertedWordsCoordinates[i].right ||
				currentWord.top    > insertedWordsCoordinates[i].bottom
			)) {
				return true;
			}
		}

		return false;
	};

	sort = (data, field) => reverse(sortBy(data, [field]));

	render() {
		const { tags } = this.props;
		return (
			<>
				{tags.length !== 0 && this.createdCloud(this.sort(tags, "sentimentScore"))}
				<div id="tagcloud-wrapper" ref={this.cloudTag} />
			</>
		)
	}
}

const mapStateToProps = state => ({
	tags: state.tagsReducer.tags,
});

export default withRouter(connect(mapStateToProps, tagsApi)(Home));