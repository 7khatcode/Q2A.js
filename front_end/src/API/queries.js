import gql from 'graphql-tag';

const QUESTION = `{
    id
    title
    content
    viewsCount
    votesCount
    answersCount
    user {
      id
      profileImage
      publicName
    }
    createdAt
    tag1
    tag2
    tag3
    tag4
    tag5
    isLegacyContent
  }`;

export const ALL_QUESTIONS = gql`
  query($tag: String) {
    latestQuestions(tag: $tag,limit: 30,offset: 0) ${QUESTION}
    popularQuestions(tag: $tag,limit: 30,offset: 0)  ${QUESTION}
    mostViewsQuestions(tag: $tag,limit: 30,offset: 0)  ${QUESTION}
    noAnswersQuestions(tag: $tag,limit: 30,offset: 0)  ${QUESTION}
  }
`;

export const GET_QUESTION = gql`
  query($id: String!) {
    getQuestion(id: $id) {
      id
      title
      content
      viewsCount
      votesCount
      answersCount
      createdAt
      user {
        id
        profileImage
        publicName
      }
      createdAt
      tag1
      tag2
      tag3
      tag4
      tag5
      isLegacyContent
      answers {
        id
        content
        user {
          id
          profileImage
          publicName
        }
        isLegacyContent
        votesCount
        createdAt
        comments {
          id
          content
          isLegacyContent
          user {
            id
            profileImage
            publicName
          }
          createdAt
        }
      }
      comments {
        id
        content
        isLegacyContent
        user {
          id
          profileImage
          publicName
        }
        createdAt
      }
    }
  }
`;

export const ALL_TAGS = gql`
  query {
    getTags(limit: 80, offset: 0) {
      id
      title
      used
    }
  }
`;

export const GET_TAG = gql`
  query($tag: String!) {
    getTagDetail(tag: $tag) {
      id
      title
      content
      used
    }
  }
`;

export const GET_MY_USER = gql`
  query {
    getUser {
      id
      publicName
      profileImage
    }
  }
`;

export const GET_USER = gql`
  query($id: String!) {
    getUser(id: $id) {
      id
      publicName
      profileImage
      about
      answers {
        id
        content
        votesCount
        createdAt
      }
      questions {
        id
        title
        content
        viewsCount
        votesCount
        answersCount
        createdAt
        tag1
        tag2
        tag3
        tag4
        tag5
        isLegacyContent
      }
      clapItems {
        type
        answer {
          id
          content
          user {
            id
            profileImage
            publicName
          }
          isLegacyContent
          votesCount
          createdAt
        }
        question {
          id
          title
          content
          viewsCount
          votesCount
          answersCount
          user {
            id
            profileImage
            publicName
          }
          createdAt
          tag1
          tag2
          tag3
          tag4
          tag5
          isLegacyContent
        }
      }
    }
  }
`;
