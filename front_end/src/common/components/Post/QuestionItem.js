import React, { useEffect } from 'react';
import { Box, Button, Grid, makeStyles, Typography } from '@material-ui/core';
import { legacyParseContent } from '../../parsers/legacyParser';
import { parseContent } from '../../parsers/parser';
import { getTagsArray } from '../../utlities/generalUtilities';
import EditQuestion from './EditQuestion';
import { doGraphQLMutation, getCurrentUserId } from '../../../API/utilities';
import CKEditor from '../Editor/CKEditor';
import { ADD_COMMENT } from '../../../API/mutations';
import ErrorMessage from '../ErrorMessage';
import ProfileImageWithName from '../ProfileImageWithName';
import PostStatistics from './PostStatistics';
import HorizontalTagsBlock from '../Tag/HorizontalTagsBlock';
import PostToolbar from './PostToolbar';
import CommentsSection from './CommentsSection';
import SaveCancelButtons from '../SaveCancelButtons';
import AddComment from './AddComment';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(5, 0, 5, 0),
    paddingBottom: theme.spacing(3),
  },
  tagsSection: {
    margin: theme.spacing(4, 0, 1, 2),
  },
  title: {
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(2),
    textAlign: 'initial ',
    cursor: 'pointer',
    '&:hover': {
      color: '#314285',
      textDecorationLine: 'underline',
    },
  },
}));

const QuestionItem = ({
  id,
  title,
  content,
  user,
  createdAt,
  viewsCount,
  votesCount,
  answersCount,
  comments,
  mainPage,
  tag1,
  tag2,
  tag3,
  tag4,
  tag5,
  isLegacyContent,
}) => {
  const classes = useStyles();
  const [currentUserId, setCurrentUserId] = React.useState('');
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [isCommentMode, setIsCommentMode] = React.useState(false);
  const { publicName, profileImage } = user;
  const userWhoAskedId = user.id;
  const tags = getTagsArray(tag1, tag2, tag3, tag4, tag5);

  const parsedContent = isLegacyContent
    ? legacyParseContent(content, mainPage ? 'textSecondary' : 'textPrimary')
    : parseContent(content);
  useEffect(() => {
    const getUser = async () => {
      const userId = await getCurrentUserId();
      setCurrentUserId(userId);
    };
    getUser();
  }, []);

  return (
    <Box boxShadow={2} className={classes.root}>
      <Grid container direction="row" justify="space-between" alignItems="center">
        <ProfileImageWithName
          href={`/user/[id]`}
          as={`/user/${publicName}`}
          profileImage={profileImage}
          createdAt={createdAt}
          publicName={publicName}
        />
        <PostStatistics votesCount={votesCount} viewsCount={viewsCount} answersCount={answersCount} />
      </Grid>

      {!isEditMode ? (
        <div style={{ margin: '25px 15px 0px 10px' }}>
          <Typography color="textPrimary" variant="h1" className={classes.title}>
            {title}
          </Typography>
          <div
            style={{
              flex: 'row',
              display: 'flex',
              justifyContent: 'space-between',
              margin: '0px 0px 0px 5px',
            }}
          >
            {parsedContent}
          </div>
        </div>
      ) : (
        <EditQuestion
          editMode
          editTitle={title}
          editTags={tags.map((tag) => {
            return {
              title: tag,
            };
          })}
          editContent={content}
          editId={id}
          onEditFinished={() => {
            setIsEditMode(false);
          }}
        />
      )}
      <HorizontalTagsBlock className={classes.tagsSection} tags={tags} />
      <PostToolbar
        showShare
        shareTitle={`${title} - هفت خط کد`}
        shareBody={content}
        showEdit={currentUserId === userWhoAskedId}
        showDisable={currentUserId === userWhoAskedId}
        editCallBack={() => {
          setIsEditMode(true);
        }}
        showComment
        commentCallback={() => {
          setIsCommentMode(!isCommentMode);
        }}
      />

      <AddComment
        postId={id}
        enable={isCommentMode}
        onCancel={() => {
          setIsCommentMode(false);
        }}
      />
      <CommentsSection comments={comments} />
    </Box>
  );
};

export default QuestionItem;
