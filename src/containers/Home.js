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
		this.tagcloud = React.createRef();
		this.invisible = React.createRef();
	}

	componentDidMount() {
		const { cloudElements, getTags, buildCloud } = this.props;

		if (!cloudElements.length) {
			getTags()
			.then(tags => {
				const cloudElements = this.createdCloud(this.sort(tags.payload, "sentimentScore"));
				buildCloud(cloudElements);
				return this.pushToCloud(cloudElements);
			})
		}

		return this.pushToCloud(cloudElements);
	}

	pushToCloud = elements => elements.map(el => this.tagcloud.current.appendChild(el));

	createdCloud = tags => {
		const tagsForRender = [];

		// get center point of the container
		const center = {
			x: this.tagcloud.current.offsetWidth / 2,
			y: this.tagcloud.current.offsetHeight / 2
		};

		tags.forEach(tag => {
			const { current } = this.invisible;
			const { sentimentScore, label } = tag;

			current.style.fontSize = Math.ceil(sentimentScore / 5) + "px";
			current.innerHTML = label;

			const turns = 5;
			const iterationPerCircle = 180;
			const compression = 0.8;

			let angle = 0;
			let radius = 0;

			// run algorithm by spiral
			for (let k = 0; k < turns * iterationPerCircle; k++) {

				radius += 0.3;
				angle  += (Math.PI * 2) / iterationPerCircle;

				const x = center.x + radius * Math.cos(angle);
				const y = center.y + radius * compression * Math.sin(angle);

				current.style.left = x - current.offsetWidth  / 2 + "px";
				current.style.top  = y - current.offsetHeight / 2 + "px";

				// get word coordinates in the DOM
				const coordinates = current.getBoundingClientRect();

				// if now intersection, put element to the DOM and close function
				if (!this.checkIntersection(coordinates)) {
					tagsForRender.push(this.prepare(current.cloneNode(), tag));
					insertedWordsCoordinates.push(coordinates);
					return;
				}
			}
		});

		return tagsForRender;
	};

	checkIntersection = currentWord => {
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

	prepare = (el, { label, id, sentimentScore }) => {
		el.removeAttribute("id");
		el.innerHTML = label;
		el.className = "tag";
		el.style.color = randomColor({ hue: 'red' });
		el.style.fontSize = Math.ceil(sentimentScore / 5) + "px";
		el.addEventListener("click", () => this.props.history.push(`/tag?tagId=${id}`), false);
		return el;
	};


	sort = (data, field) => reverse(sortBy(data, [field]));

	render() {
		return <>
			<div id="tagcloud" ref={this.tagcloud}>
				<div id="invisible" ref={this.invisible} />
			</div>
		</>
	}
}

const mapStateToProps = state => ({
	tags: state.tagsReducer.tags,
	cloudElements: state.tagsReducer.cloudElements,
});

export default withRouter(connect(mapStateToProps, tagsApi)(Home));