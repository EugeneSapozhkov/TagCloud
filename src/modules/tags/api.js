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
	fakeGet(tags)
		.then(response => dispatch(actions.getTagsAction(response)))
		.catch(err => {
			console.error(err);
			throw err;
	})
};

export default {
	getTags,
}