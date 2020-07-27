const database = require('../db/database').getDatabase();
const tables = require('../db/constants').TABLES;
const postTypes = require('../db/constants').POST_TYPES;
const { createValidationResponse, createSuccessResponse } = require('../utility');

module.exports.addQuestion = async (_, { title, content, tags }) => {
  const Post = database.loadModel(tables.POST_TABLE);
  const minTitleLength = 6;
  const minContentLength = 20;
  const minTagsCount = 2;
  const maxTagsCount = 5;
  if (title.length < minTitleLength) {
    return createValidationResponse(`Title length should be greater than ${minTitleLength}`);
  }
  if (content.length < minTitleLength) {
    return createValidationResponse(`Content length should be greater than ${minContentLength}`);
  }
  if (tags.length < minTagsCount) {
    return createValidationResponse(`You need at least  ${minContentLength} tags`);
  }
  if (tags.length > maxTagsCount) {
    return createValidationResponse(`You can't select more than  ${minContentLength} tags`);
  }

  const questionTags = {};
  tags.forEach((tag, index) => {
    questionTags[`tag${index + 1}`] = tag;
  });
  console.log('Tags : ', questionTags, { type: postTypes.QUESTION, title, content, ...questionTags });
  await Post.create({ type: postTypes.QUESTION, title, content, ...questionTags });
  return createSuccessResponse();
};
