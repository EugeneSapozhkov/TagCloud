import { createAction } from 'redux-actions';

export const GET_TAGS = "GET_TAGS";
export const BUILD_CLOUD = "BUILD_CLOUD";

const getTagsAction = createAction(GET_TAGS);
const buildCloudAction = createAction(BUILD_CLOUD);

export {
	getTagsAction,
	buildCloudAction
};