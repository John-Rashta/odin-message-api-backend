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

interface UserProfile {
    name?: string,
    aboutMe?: string,
    icon?: number,
};

interface UserSign extends UserProfile {
    username: string,
    password: string,
    joinedAt: Date,
}

interface UserUpdate extends UserProfile, UserOptions {

};

type ActionTypes = "ADD" | "REMOVE";
type RequestTypes = "sender" | "receiver";

export { MessagesOptions, UserOptions, GroupOptions, RequestTypes, UserProfile, UserSign, UserUpdate };