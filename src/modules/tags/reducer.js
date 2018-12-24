import { handleActions } from 'redux-actions';
import {
	GET_TAGS,
} from './actions';

const initialState = {
	tags: [],
};

const tagsReducer = handleActions(
	{
		[GET_TAGS]: (state, action) => ({
			...state,
			tags: action.payload,
		}),
	},

	initialState,
);

export default tagsReducer;
