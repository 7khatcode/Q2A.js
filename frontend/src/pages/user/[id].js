import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/core/styles';
import { AppBar, Avatar, Box, Button, CircularProgress, Tab, Tabs, Typography } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import StatsIcon from '@material-ui/icons/BarChart';
import QuestionsIcon from '@material-ui/icons/ContactSupport';
import EditIcon from '@material-ui/icons/Edit';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Layout from '../../common/layouts/Layout';
import QuestionItemPreview from '../../common/components/Contents/Post/QuestionItemPreview';
import AnswerItem from '../../common/components/Contents/Post/AnswerItem';
import { doGraphQLMutation, doGraphQLQuery, getCurrentUserId, uploadFile } from '../../API/utility';
import { GET_USER } from '../../API/queries';
import Loading from '../../common/components/Loading';
import {
  addRevalidateAndRedux,
  getFullUrl,
  getItemsAndDispatch,
} from '../../common/utlities/generalUtilities';
import ErrorMessage from '../../common/components/ErrorMessage';
import { UPDATE_USER } from '../../API/mutations';
import CKEditor from '../../common/components/Editor/CKEditor';
import { parseContent } from '../../common/parsers/parser';
import SaveCancelButtons from '../../common/components/SaveCancelButtons';
import { wrapper } from '../../redux/store';
import { CURRENT_USER_ACTION, SELECTED_USER_ACTION } from '../../redux/constants';
import { getStrings } from '../../common/utlities/languageUtilities';
import { GET_ALL_BLOG_POSTS_DATA, GET_ALL_TAGS_DATA, GET_USER_DATA } from '../../common/constants';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const styles = {
  root: {
    backgroundColor: (theme) => theme.palette.background.paper,
    marginTop: (theme) => theme.spacing(8),
  },
  avatar: {
    width: (theme) => theme.spacing(32),
    height: (theme) => theme.spacing(32),
    marginRight: (theme) => theme.spacing(4),
    marginLeft: (theme) => theme.spacing(4),
    marginTop: (theme) => theme.spacing(4),
  },
  button: {
    padding: (theme) => theme.spacing(1, 6, 1, 6),
  },
  topSection: {
    display: 'flex',
    flexDirection: 'row',
  },
  title: {
    marginTop: (theme) => theme.spacing(10),
    marginBottom: (theme) => theme.spacing(4),
    marginLeft: (theme) => theme.spacing(4),
    fontSize: 19,
    whiteSpace: 'pre-line',
  },
};

const User = () => {
  const user = useSelector((state) => state.selectedUser);
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useTheme();
  const [currentTabIndex, setCurrentTabIndex] = React.useState(0);
  const [uploadError, setUploadError] = React.useState(undefined);
  const [loadingNewImage, setLoadingNewImage] = React.useState(false);
  const [isDescriptionEditMode, setDescriptionEditMode] = React.useState(false);
  const [apiError, setAPIError] = React.useState(undefined);
  let aboutEditData = false;

  const handleCurrentTabChanged = (event, newValue) => {
    setCurrentTabIndex(newValue);
  };

  if (!user) return <Loading />;
  const { publicName } = user;
  const { answers, questions, clapItems, about, profileImage, language } = user;
  if (!aboutEditData) aboutEditData = user.about;

  const refreshSelectedUser = async () => {
    const userData = await doGraphQLQuery(GET_USER, { id: publicName });
    const currentUserId = await getCurrentUserId();
    if (user.id === currentUserId) {
      console.log('SETTING USER ', JSON.stringify(userData.getUser));
      await localStorage.setItem('USER', JSON.stringify(userData.getUser));
      dispatch({ type: CURRENT_USER_ACTION, payload: userData.getUser });
    }
    dispatch({ type: SELECTED_USER_ACTION, payload: userData.getUser });
  };

  return (
    <Box sx={styles.root}>
      <Box style={{ position: 'relative' }} sx={styles.topSection}>
        <Box style={{ textAlign: 'center' }}>
          {loadingNewImage ? (
            <div sx={styles.avatar}>
              <CircularProgress color="secondary" style={{ marginTop: '35%' }} />
              <Typography> در حال بارگذاری</Typography>
            </div>
          ) : (
            <Avatar
              type="file"
              name="myImage"
              onChange={() => {}}
              aria-label="recipe"
              sx={styles.avatar}
              src={getFullUrl(profileImage)}
            >
              <Avatar aria-label="recipe" sx={styles.avatar} src={'/images/default_profile.jpg'} />
            </Avatar>
          )}
          <input
            accept="image/*"
            sx={styles.input}
            style={{ display: 'none' }}
            id="raised-button-file"
            multiple
            type="file"
            onChange={async (event) => {
              if (event.target.files && event.target.files[0]) {
                const img = event.target.files[0];
                setLoadingNewImage(true);
                if (uploadError) setUploadError(undefined);
                const uploadResult = await uploadFile(img);
                try {
                  const id = await getCurrentUserId();
                  const resultObject = await doGraphQLMutation(UPDATE_USER, {
                    id,
                    input: {
                      profileImage: uploadResult.uploadFile.filename,
                    },
                  });
                  const result = resultObject.updateUser;
                  if (result.statusCode !== 'SUCCESS') {
                    throw new Error(result.message);
                  }
                  await refreshSelectedUser();
                } catch (error) {
                  setUploadError(error.toString());
                }
                setLoadingNewImage(false);
              }
            }}
          />
          <label htmlFor="raised-button-file">
            <Button
              variant="contained"
              color="secondary"
              component="span"
              disabled={loadingNewImage}
              style={{ justifySelf: 'center', margin: '-25px 0px 45px 0px' }}
            >
              {getStrings().PROFILE_IMAGE_UPLOAD}
            </Button>
          </label>
          {uploadError && <ErrorMessage style={{ margin: '-30px 0px 25px 0px' }} text={uploadError} />}
        </Box>

        {!isDescriptionEditMode && <div sx={styles.title}>{parseContent(about, language)}</div>}
        {isDescriptionEditMode && (
          <Box style={{ margin: '65px 0px 0px 15px', flex: 1 }}>
            <CKEditor
              data={about}
              onChange={(event, editor) => {
                aboutEditData = editor.getData();
              }}
              toolbar={['bold', 'italic', 'code', 'link']}
            />

            <SaveCancelButtons
              error={apiError}
              onSave={async () => {
                try {
                  const id = await getCurrentUserId();
                  const resultObject = await doGraphQLMutation(UPDATE_USER, {
                    id,
                    input: {
                      about: aboutEditData,
                    },
                  });
                  const result = resultObject.updateUser;
                  if (result.statusCode !== 'SUCCESS') {
                    throw new Error(result.message);
                  }
                  setDescriptionEditMode(false);
                  await refreshSelectedUser();
                } catch (error) {
                  setAPIError(error.toString());
                }
              }}
              onCancel={() => {
                setDescriptionEditMode(false);
              }}
            />
          </Box>
        )}

        <EditIcon
          color="primary"
          style={{
            position: 'absolute',
            right: '15',
            top: '15',
            cursor: 'pointer',
          }}
          onClick={() => {
            setDescriptionEditMode(!isDescriptionEditMode);
          }}
        />
        <LogoutIcon
          color="primary"
          style={{
            position: 'absolute',
            right: '50',
            top: '15',
            cursor: 'pointer',
          }}
          onClick={async () => {
            await localStorage.removeItem('JWT_TOKEN');
            await localStorage.removeItem('USER');
            dispatch({ type: CURRENT_USER_ACTION, payload: null });
            return router.replace('/');
          }}
        />
      </Box>
      <AppBar position="static" color="default">
        <Tabs
          value={currentTabIndex}
          onChange={handleCurrentTabChanged}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label={getStrings().PROFILE_QUESTIONS} icon={<PersonIcon />} {...a11yProps(0)} />
          <Tab label={getStrings().PROFILE_ANSWERS} icon={<StatsIcon />} {...a11yProps(1)} />
          <Tab label={getStrings().PROFILE_CLAPPED} icon={<QuestionsIcon />} {...a11yProps(2)} />
        </Tabs>
      </AppBar>

      <TabPanel value={currentTabIndex} index={0}>
        <div>
          {questions &&
            questions.map((question) => {
              const alteredQuestion = { ...question };
              alteredQuestion.user = {};
              alteredQuestion.user.publicName = publicName;
              alteredQuestion.user.profileImage = profileImage;
              return <QuestionItemPreview key={alteredQuestion.id} {...alteredQuestion} />;
            })}
        </div>
      </TabPanel>
      <TabPanel value={currentTabIndex} index={1} dir={theme.direction}>
        <div>
          {answers &&
            answers.map((answer) => {
              const alteredAnswer = { ...answer };
              alteredAnswer.user = {};
              alteredAnswer.user.publicName = publicName;
              alteredAnswer.user.profileImage = profileImage;
              alteredAnswer.comments = [];
              return <AnswerItem key={answer.id} {...alteredAnswer} />;
            })}
        </div>
      </TabPanel>
      <TabPanel value={currentTabIndex} index={2}>
        <div>
          {clapItems &&
            clapItems.map((item) => {
              if (item.type === 'QUESTION') {
                const { ...question } = { item };
                question.user = {};
                question.user.publicName = publicName;
                question.user.profileImage = profileImage;
                return <QuestionItemPreview key={question.id} {...question} />;
              }
              if (item.type === 'ANSWER') {
                const { ...answer } = { item };
                answer.user = {};
                answer.user.publicName = publicName;
                answer.user.profileImage = profileImage;
                answer.comments = [];
                return <AnswerItem key={answer.id} {...answer} />;
              }
            })}
        </div>
      </TabPanel>
    </Box>
  );
};

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps = async (props) =>
  addRevalidateAndRedux(
    props,
    wrapper.getStaticProps((store) => async (ctx) => {
      const { id } = props.params;
      await getItemsAndDispatch(GET_ALL_BLOG_POSTS_DATA, { limit: 5, offset: 0 }, store);
      await getItemsAndDispatch(GET_ALL_TAGS_DATA, { limit: 50, offset: 0 }, store);
      await getItemsAndDispatch(GET_USER_DATA, { id }, store);
    })
  );

User.getLayout = (page) => <Layout>{page}</Layout>;

export default User;
