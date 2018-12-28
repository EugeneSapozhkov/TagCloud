import { handleActions } from 'redux-actions';
import {
	GET_TAGS,
	BUILD_CLOUD,
} from './actions';

const initialState = {
	tags: [],
	cloudElements: [],
};

const tagsReducer = handleActions(
	{
		[GET_TAGS]: (state, action) => ({
			...state,
			tags: action.payload,
		}),

		[BUILD_CLOUD]: (state, action) => ({
			...state,
			cloudElements: action.payload,
		}),
	},

	initialState,
);

export default tagsReducer;
