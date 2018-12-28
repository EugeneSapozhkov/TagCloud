import * as actions from './actions';
import tags from 'data';


const fakeGet = (incomingData) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (incomingData) {
				resolve(incomingData);
			}
			reject('Something went wrong')
		}, 500);
	});
};

const getTags = () => dispatch => {
	return fakeGet(tags)
		.then(response => dispatch(actions.getTagsAction(response)))
		.catch(err => {
			console.error(err);
			throw err;
	})
};

const buildCloud = (elements) => dispatch => {
	dispatch(actions.buildCloudAction(elements))
};

export default {
	getTags,
	buildCloud,
}