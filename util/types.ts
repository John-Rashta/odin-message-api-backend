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
    action?: ActionTypes,
};

type ActionTypes = "ADD" | "REMOVE";
type RequestTypes = "sender" | "receiver";

export { MessagesOptions, UserOptions, GroupOptions, RequestTypes };