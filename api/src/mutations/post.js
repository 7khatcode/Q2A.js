import * as yup from 'yup';
import { Sequelize } from 'sequelize';
import databaseUtils from '../db/database.js';
import { POST_TYPES, TABLES, STATUS_CODE, LANGUAGE } from '../constants.js';
import {
  createSuccessResponse,
  findUserByName,
  checkInputValidation,
  createAddSuccessResponse,
  updateStatistics,
} from '../utility.js';

import { NOTIFICATION_REASON, saveNotification } from './notifications.js';

const questionSchema = yup.object().shape({
  title: yup.string().required().min(10),
  content: yup.string().required().min(25),
  tags: yup.array().required().min(2).max(5),
  language: yup.mixed().oneOf([LANGUAGE.PERSIAN, LANGUAGE.ENGLISH]).required(),
});
const blogPostSchema = yup.object().shape({
  title: yup.string().required().min(10),
  content: yup.string().required().min(25),
  tags: yup.array().required().min(2).max(5),
  language: yup.mixed().oneOf([LANGUAGE.PERSIAN, LANGUAGE.ENGLISH]).required(),
});

const answerSchema = yup.object().shape({
  content: yup.string().required().min(20),
  language: yup.mixed().oneOf([LANGUAGE.PERSIAN, LANGUAGE.ENGLISH]).required(),
});

const commentSchema = yup.object().shape({
  content: yup.string().required().min(10),
  language: yup.mixed().oneOf([LANGUAGE.PERSIAN, LANGUAGE.ENGLISH]).required(),
});

const createPost = async (inputParams, context) => {
  const user = await findUserByName(context.user.publicName);
  const Post = databaseUtils().loadModel(TABLES.POST_TABLE);
  return Post.create({ userId: user.id, ...inputParams });
};

const updatePost = async (inputParams, postId, language) => {
  const Post = databaseUtils().loadModel(TABLES.POST_TABLE);
  return Post.update({ ...inputParams }, { where: { id: postId, language } });
};

const incrementColumnInPost = async (id, column, valueToIncrease = 1) => {
  const Post = databaseUtils().loadModel(TABLES.POST_TABLE);
  const incrPart = {};
  incrPart[column] = valueToIncrease;
  return Post.increment(incrPart, { where: { id } });
};

const getParentPost = async (parentId) => {
  const Post = await databaseUtils().loadModel(TABLES.POST_TABLE);
  const User = databaseUtils().loadModel(TABLES.USER_TABLE);
  const post = await Post.findOne({
    where: {
      id: parentId,
    },
    include: [User],
  });
  return post;
};

const getUrlFromPost = async (post) => {
  if (post.type === POST_TYPES.QUESTION) {
    return `/${post.id}/${post.title}`;
  }
  if (post.type === POST_TYPES.ANSWER || post.type === POST_TYPES.COMMENT) {
    const parentQuestion = await getParentPost(post.parentId);
    return getUrlFromPost(parentQuestion);
  }
  console.warn('Type of post not found in getUrlFromPost');
  return '/';
};

const addQuestion = async (_, { language, title, content, tags }, context) => {
  await checkInputValidation(questionSchema, { language, title, content, tags });

  const questionTags = {};
  tags.forEach((tag, index) => {
    questionTags[`tag${index + 1}`] = tag;
  });
  const resultOfPost = await createPost(
    {
      type: POST_TYPES.QUESTION,
      title,
      content,
      language,
      ...questionTags,
    },
    context
  );
  const newPost = resultOfPost.dataValues;
  await updateStatistics(language, 'allQuestionsCount');
  return createAddSuccessResponse(newPost.id, `/${newPost.id}/${encodeURIComponent(title)}`);
};

const addAnswer = async (_, { language, postId, content }, context) => {
  await checkInputValidation(answerSchema, { content, language });
  const parentPost = await getParentPost(postId);
  if (parentPost === null) {
    throw new Error(STATUS_CODE.INPUT_ERROR);
  }
  await incrementColumnInPost(parentPost.id, 'answersCount');
  const url = await getUrlFromPost(parentPost);
  const createPostResult = await createPost(
    {
      type: POST_TYPES.ANSWER,
      content,
      language,
      parentId: postId,
    },
    context
  );
  const createPostId = createPostResult.id;
  await saveNotification(
    language,
    NOTIFICATION_REASON.ANSWER_RECEIVED,
    context.user.id,
    parentPost.userId,
    parentPost.title,
    content,
    {
      url,
    }
  );
  return createAddSuccessResponse(createPostId);
};

const addComment = async (_, { language, postId, content }, context) => {
  await checkInputValidation(commentSchema, { language, content });
  const parentPost = await getParentPost(postId);
  if (parentPost === null) {
    throw new Error(STATUS_CODE.INPUT_ERROR);
  }
  const url = await getUrlFromPost(parentPost);
  const createPostResult = await createPost(
    {
      type: POST_TYPES.COMMENT,
      content,
      language,
      parentId: postId,
    },
    context
  );
  const createPostId = createPostResult.id;
  await saveNotification(
    language,
    NOTIFICATION_REASON.COMMENT_RECEIVED,
    context.user.id,
    parentPost.userId,
    parentPost.title ? parentPost.title : parentPost.content,
    content,
    {
      url,
    }
  );
  return createAddSuccessResponse(createPostId);
};

const updateAnswer = async (_, { language, id, content }) => {
  await checkInputValidation(answerSchema, { language, content });
  await updatePost(
    {
      content,
    },
    id,
    language
  );
  return createSuccessResponse(``);
};

const updateComment = async (_, { language, id, content }) => {
  await checkInputValidation(commentSchema, { language, content });
  await updatePost(
    {
      content,
    },
    id,
    language
  );
  return createSuccessResponse(``);
};

const updateQuestion = async (_, { language, id, title, content, tags }) => {
  await checkInputValidation(questionSchema, { language, title, content, tags });
  const questionTags = {};
  tags.forEach((tag, index) => {
    questionTags[`tag${index + 1}`] = tag;
  });
  await updatePost(
    {
      title,
      content,
      ...questionTags,
    },
    id,
    language
  );
  return createSuccessResponse(`/${id}/${encodeURIComponent(title)}`);
};

const updateBlogPost = async (_, { language, id, title, content, tags }) => {
  await checkInputValidation(blogPostSchema, { language, title, content, tags });
  const blogPostTags = {};
  tags.forEach((tag, index) => {
    blogPostTags[`tag${index + 1}`] = tag;
  });
  await updatePost(
    {
      title,
      content,
      ...blogPostTags,
    },
    id,
    language
  );
  return createSuccessResponse(`/${id}/${encodeURIComponent(title)}`);
};

const increaseQuestionViewCount = async (_, { id }) => {
  await checkInputValidation(
    yup.object().shape({
      id: yup.string().required(),
    }),
    { id }
  );
  await incrementColumnInPost(id, 'viewsCount');
  return createSuccessResponse();
};

const togglePostActiveStatus = async (_, { id }) => {
  await checkInputValidation(
    yup.object().shape({
      id: yup.string().required(),
    }),
    { id }
  );
  const Post = databaseUtils().loadModel(TABLES.POST_TABLE);
  await Post.update({ active: Sequelize.literal('NOT active') }, { where: { id } });
  return createSuccessResponse();
};

export {
  addComment,
  addAnswer,
  updateQuestion,
  updateBlogPost,
  updateComment,
  updateAnswer,
  addQuestion,
  increaseQuestionViewCount,
  togglePostActiveStatus,
};
