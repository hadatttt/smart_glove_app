// userSentences.ts
// Collection to store user-customized sentences for each letter

export interface UserSentence {
  char: string; // e.g. 'A', 'B', ...
  sentence: string;
  userId: string; // Added userId property
}

// This will be loaded from Firebase or local storage in a real app
const userSentences: UserSentence[] = [];

export default userSentences;
