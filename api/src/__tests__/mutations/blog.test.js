import { addBlogPost, updateBlogPost, addBlogComment } from '../../mutations/blog.js';
import { STATUS_CODE } from '../../constants.js';
import { blogData, blogPostUpdateData, makeContext } from '../../testUtility';
import { getBlogPost } from '../../queries/blog';

describe('blog mutations api', () => {
  const testAddBlogPostWrongInput = async (language, title, content, tags) => {
    let result;
    try {
      result = await addBlogPost(null, { title, content, tags }, makeContext());
    } catch (e) {
      expect(e.name).toBe('ValidationError');
    }
    if (result) expect(`Add blog post should give error with:' ${title},${content},${tags}`).toBe(false);
  };

  const addNewBlogPost = async () => {
    return addBlogPost(null, blogData, makeContext());
  };

  const testUpdateBlogPostWrongInput = async (language, postId, title, content, tags) => {
    let result;
    try {
      result = await updateBlogPost(
        null,
        {
          language,
          postId,
          title,
          content,
          tags,
        },
        makeContext()
      );
    } catch (e) {
      expect(e.name).toBe('ValidationError');
    }
    if (result) expect(`Update BlogPost should give error with:' ${title},${content},${tags}`).toBe(false);
  };

  const testAddBlogCommentWrongInput = async (language, postId, content, errorMessage, typeErrorFlag) => {
    let result;
    try {
      result = await addBlogComment(null, { language, postId, content }, makeContext());
    } catch (e) {
      if (typeErrorFlag) expect(e.name).toBe(errorMessage);
      else expect(e.message).toBe(errorMessage);
    }
    if (result) expect(`add BlogComment should give error with:' ${postId},${content}`).toBe(false);
  };

  test('if correct input for add blog post give success', async () => {
    const result = await addNewBlogPost(blogData.language, blogData.title, blogData.content, blogData.tags);
    expect(result.statusCode).toBe(STATUS_CODE.SUCCESS);
  });

  test("if wrong input for addBlogPost doesn't work", async () => {
    await testAddBlogPostWrongInput('wrong', blogData.title, blogData.content, blogData.tags);
    await testAddBlogPostWrongInput(blogData.language, 'wrong', blogData.content, blogData.tags);
    await testAddBlogPostWrongInput(blogData.language, blogData.title, 'wrong_content', blogData.tags);
    await testAddBlogPostWrongInput(blogData.language, blogData.title, blogData.content, ['wrong']);
    await testAddBlogPostWrongInput(blogData.language, blogData.title, blogData.content, [
      'html',
      'c',
      'c#',
      'c++',
      'python',
      'openCv',
    ]);
    await testAddBlogPostWrongInput('wrong', 'wrong_content', ['wrong']);
  });

  // Update BlogPost
  test('if correct input for updateBlogPost give success', async () => {
    const blogPost = await addNewBlogPost();
    const resultUpdateBlogPost = await updateBlogPost(
      null,
      {
        language: blogData.language,
        id: blogPost.id,
        title: blogPostUpdateData.title,
        content: blogPostUpdateData.content,
        tags: blogPostUpdateData.tags,
      },
      makeContext()
    );
    const getUpdatedBlogPost = await getBlogPost(null, { language: blogData.language, id: blogPost.id });
    expect(resultUpdateBlogPost.statusCode).toBe(STATUS_CODE.SUCCESS);
    expect(resultUpdateBlogPost.message).toBeTruthy();
    expect(blogPostUpdateData.title).toBe(getUpdatedBlogPost.title);
    expect(blogPostUpdateData.content).toBe(getUpdatedBlogPost.content);
    expect(blogPostUpdateData.tags).toBe(blogPostUpdateData.tags);
    expect(blogPost.id).toBe(getUpdatedBlogPost.id);
  });

  test("if wrong input for updateBlogPost shouldn't work", async () => {
    const blogPost = await addNewBlogPost();
    const postId = blogPost.id;
    await testUpdateBlogPostWrongInput('wrong', postId, blogData.title, blogData.content, blogData.tags);
    await testUpdateBlogPostWrongInput(blogData.language, postId, 'wrong', blogData.content, blogData.tags);
    await testUpdateBlogPostWrongInput(
      blogData.language,
      postId,
      blogData.title,
      'wrong_content',
      blogData.tags
    );
    await testUpdateBlogPostWrongInput(blogData.language, postId, blogData.title, blogData.content, ['c++']);
    await testUpdateBlogPostWrongInput(blogData.language, postId, 'wrong', 'wrong_content', ['c++']);
  });

  // add BlogComment
  test('if correct input for BlogComment give success', async () => {
    const blogPost = await addNewBlogPost();
    const postId = blogPost.id;
    const result = await addBlogComment(
      null,
      {
        language: blogData.language,
        postId,
        content: blogPostUpdateData.content,
      },
      makeContext()
    );
    expect(result.statusCode).toBe(STATUS_CODE.SUCCESS);
  });

  test("if wrong input for BlogComment shouldn't work", async () => {
    const blogPost = await addNewBlogPost();
    const postId = blogPost.id;
    await testAddBlogCommentWrongInput(
      blogData.language,
      220,
      blogPostUpdateData.content,
      STATUS_CODE.INPUT_ERROR,
      false
    );
    await testAddBlogCommentWrongInput(blogData.language, postId, 'wrong', 'ValidationError', true);
    await testAddBlogCommentWrongInput('wrong', postId, blogData.content, 'ValidationError', true);
  });
});
