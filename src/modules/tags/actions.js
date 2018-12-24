import { createAction } from 'redux-actions';

export const GET_TAGS = "GET_TAGS";

const getTagsAction = createAction(GET_TAGS);

export {
	getTagsAction,
};