import { IInstagramComment } from '../Instagram/instagramInterface';

export const fakeCommentData = (): IInstagramComment[] => {
  const fakeComments = [];
  for (let i = 0; i < 100; i++) {
    const comment = {
      id: `comment-${i + 1}`,
      text: `這是第 ${i + 1} 條留言的內容。`,
      username: `user${i + 1}`,
      timestamp: `2023-03-01`,
      like_count: 0,
      from: {
        id: '11111',
        username: '2222',
      },
    };
    fakeComments.push(comment);
  }
  for (let i = 101; i < 200; i++) {
    const comment = {
      id: `comment-${i + 1}`,
      text: `這是第 ${i + 1} 條留言的內容。 @1234`,
      username: `user${i + 1}`,
      timestamp: `2023-10-16 21:00`,
      like_count: 0,
      from: {
        id: '11111',
        username: '2222',
      },
    };
    fakeComments.push(comment);
  }
  for (let i = 200; i < 205; i++) {
    const comment = {
      id: `comment-${i + 1}`,
      text: `這是第 ${i + 1} 條留言的內容。 @1234 @2friend 5555`,
      username: `user${i + 1}`,
      timestamp: `2023-10-16 18:01`,
      like_count: 0,
      from: {
        id: '11111',
        username: '2222',
      },
    };
    fakeComments.push(comment);
  }
  return fakeComments;
};
