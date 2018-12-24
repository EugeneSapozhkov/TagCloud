import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { tagsApi } from "modules/tags";
import { sortBy, reverse, last } from "lodash";
import randomColor from "randomcolor";


// config
const TURNS 		= 10; 	// spiral turns
const ACCURACY		= 0.06; // more dotes = more accuracy
const COMPRESSION	= 2.5;  // compression of spiral

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

		tags.forEach((tag, index) => {
			// create word element before append
			const wordDOM = this.prepareDOMWord(tag);

			// run algorithm by spiral
			for (let k = 0; k < 360 * TURNS; k++) {
				const angle = 360 * ACCURACY * index;
				const x = (ACCURACY + angle) * Math.cos(angle);
				const y = (ACCURACY + angle / COMPRESSION) * Math.sin(angle);

				const isIntersect = this.checkIntersection(wordDOM, center.x + x, center.y + y);

				// if now intersection, put element to the DOM and close function
				if (!isIntersect) {
					this.cloudTag.current.appendChild(wordDOM);

					wordDOM.style.left = center.x + x - wordDOM.offsetWidth  / 2 + "px";
					wordDOM.style.top =  center.y + y - wordDOM.offsetHeight / 2 + "px";

					insertedWordsCoordinates.push(wordDOM.getBoundingClientRect());
					return;
				}

				// break spiral intteration
				break;
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
		wordContainer.className = "tag";

		// set font size depend on sentimentScore (using like a value)
		wordContainer.style.fontSize = Math.ceil(word.sentimentScore / 3) + "px";
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
		wordDOM.style.left = x - wordDOM.offsetWidth / 2 + "px";
		wordDOM.style.top = y - wordDOM.offsetHeight / 2 + "px";

		// get word coordinates in the DOM
		const currentWord = wordDOM.getBoundingClientRect();

		// remove word from DOM and keep coords for comparing
		this.cloudTag.current.removeChild(wordDOM);

		// check intersection with DOM words
		for (let i = 0; i < insertedWordsCoordinates.length; i++) {
			if(!(currentWord.right < insertedWordsCoordinates[i].left 	||
				currentWord.bottom < insertedWordsCoordinates[i].top 	||
				currentWord.left   > insertedWordsCoordinates[i].right 	||
				currentWord.top	   > insertedWordsCoordinates[i].bottom)) {
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