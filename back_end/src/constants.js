const TABLES = {
  USER_TABLE: 'user',
  POST_TABLE: 'post',
  TAG_TABLE: 'tag',
  CLAP_TABLE: 'clap',
  NOTIFICATION_TABLE: 'notification',
  Medal_TABLE: 'medal',
  POST_TAG_TABLE: 'posttag',
};

const POST_TYPES = {
  ANSWER: 'ANSWER',
  QUESTION: 'QUESTION',
  COMMENT: 'COMMENT',
};

const STATUS_CODE = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SUCCESS: 'SUCCESS',
  OTHER_ERROR: 'OTHER_ERROR',
  INPUT_ERROR: 'INPUT_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
};

const LOGIN_ERRORS = {
  NO_USER: 'NO_USER',
  EXIST_USER: 'EXIST_USER',
  INVALID_LOGIN: 'INVALID_LOGIN',
  GOOGLE_LOGIN_ERROR: 'GOOGLE_LOGIN_ERROR',
};

const LANGUAGE = {
  PERSIAN: 'fa',
  ENGLISH: 'en',
};

const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
};

export { TABLES, POST_TYPES, STATUS_CODE, LOGIN_ERRORS, LANGUAGE, THEME };
