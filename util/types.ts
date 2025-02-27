interface MessagesOptions {
    groupid? : string,
    convoid? : string,
};

interface UserOptions {
    username?: string,
    password?: string,
};

interface GroupOptions {
    adminid?: string,
    memberid?: string,
    name?: string,
    action?: string,
};

export { MessagesOptions, UserOptions, GroupOptions };