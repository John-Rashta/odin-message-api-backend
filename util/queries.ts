import prisma from "../config/client";
import { Types } from "@prisma/client";
import { GroupOptions, MessagesOptions, RequestTypes, UserSign, UserUpdate } from "./types";

const getUserByName = async function getUserFromDatabaseByUsername(username: string) {
    const possibleUser = await prisma.user.findFirst({
        where: {
            username
        }
    });

    return possibleUser;
};

const getUser = async function getUserFromDatabase(id: string, status = false) {
    const possibleUser = await prisma.user.findFirst({
        where: {
            id
        },
        select: {
            id: true,
            joinedAt: true,
            icon: true,
            name: true,
            username: true,
            aboutMe: true,
            ...(status ? { online: true } : {})
        }
    });
    return possibleUser;
};

const getUserFriends = async function getFriendsFromUserId(id: string) {
    const possibleUser = await prisma.user.findFirst({
        where: {
            id
        },
        select: {
            friendlist: {
                select: {
                    users: {
                        select: {
                            username: true,
                            id: true,
                            online: true,
                            icon: true,
                        },
                        where: {
                            NOT: {
                                id,
                            }
                        }
                    }
                }
            },
            username: true,
            id: true,
        }
    });

    return possibleUser;
};

const getUserGroupsInfo = async function getUserGroupChatsFromId(id: string) {
    const possibleUser = await prisma.user.findFirst({
        where: {
            id
        },
        select: {
            id: true,
            name: true,
            groups: {
                include: {
                    members: {
                        select: {
                            id: true,
                            username: true,
                        },
                    },
                }
            }
        }
    });

    return possibleUser;
};

const findIfRequestExists = async function searchDatabaseIfRequestAlreadyExists(senderid: string, receiverid: string, type: Types) {

    const possibleRequest = await prisma.requests.findFirst({
        where: {
            AND: [
                {
                    senderid,
                },
                {
                    receiverid,
                }
            ],
            type
        }
    });

    return possibleRequest;
};

const getUserConversationsInfo = async function getAllOfUserConversationsFromDatabase(id: string) {
    const possibleUser = await prisma.user.findFirst({
        where: {
            id,
        },
        select: {
            id: true,
            username: true,
            convos: {
                select: {
                    id: true,
                    members: {
                        select: {
                            username: true,
                            id: true,
                        },
                        where: {
                            NOT: [
                                {
                                    id
                                }
                            ]
                        }
                    }
                },
                
            }
        }
    });

    return possibleUser;
};

const getAllUserRequests = async function getUserRequestsFromDatabase(id: string) {
    const possibleUser = await prisma.user.findFirst({
        where: {
            id,
        },
        select: {
            receivedRequest: {
                select: {
                    sender: {
                        select: {
                            username: true,
                            id: true,
                        },
                    },
                    sentAt: true,
                    type: true,
                    id: true,
                },
                orderBy: {
                    sentAt: "desc"
                }
            },
            id: true,
            username: true,
        }
    });

    return possibleUser;
};

const getGroupChatMembers = async function getParticipantsInGroupChat(id: string) {
    const possibleGroup = await prisma.groupChat.findFirst({
        where: {
            id,
        },
        select: {
            members: {
                select: {
                    username: true,
                    id: true,
                }
            }
        }
    });

    return possibleGroup;
};

const getUserSentRequests = async function getUserSentRequestsFromDatabase(id: string) {
    const possibleUser = await prisma.user.findFirst({
        where: {
            id,
        },
        select: {
            username: true,
            id: true,
            sentRequest: {
                select: {
                    type: true,
                    sender: {
                        select: {
                            username: true,
                            id: true,
                        }
                    },
                    sentAt: true,
                    receiver: {
                        select: {
                            username: true,
                            id: true,
                        }
                    }
                },
                orderBy: {
                    sentAt: "desc",
                }
            }
        }
    });

    return possibleUser;
};

///MAYBE DO MESSAGE SEARCHING BY GROUP OR CONVO ID AND JUST GET THE MESSAGES INSTEAD OF GOING THROUGH USER

const getGroupChatMessages = async function getGroupChatMessagesFromItsId(id: string) {
    const possibleMessages = prisma.messages.findMany({
        where: {
            groupid: id,
        },
        select: {
            sender: {
                select: {
                    username: true,
                    id: true,
                }
            },
            content: true,
            sentAt: true,
            edited: true,
        }
    });

    return possibleMessages;
};

const getConvoInfo = async function getConvoInfoFromIds(userid: string, receiverid: string) {
    const possibleConvo = await prisma.conversations.findFirst({
        where: {
            AND: [
                {
                    members: {
                        some: {
                            id: userid
                        }
                    }
                },
                {
                    members: {
                        some: {
                            id: receiverid
                        }
                    }
                }
            ],
        },
        select: {
            contents: {
                select: {
                    sender: {
                        select: {
                            username: true,
                            id: true,
                        },
                    },
                    sentAt: true,
                    content: true,
                    edited: true,
                }
            },
            id: true,
        members: {
            select: {
                id: true,
                username: true,
            }
        }   
        },
    });
    return possibleConvo;
};

const getConvoInfoFromId = async function getConvoInfoFromConvoId(convoid: string) {
    const possibleConvo = await prisma.conversations.findFirst({
        where: {
            id: convoid,
            
        },
        select: {
            contents: {
                select: {
                    sender: {
                        select: {
                            username: true,
                            id: true,
                        },
                    },
                    sentAt: true,
                    content: true,
                    edited: true,
                }
            },
            id: true,
        members: {
            select: {
                id: true,
                username: true,
            }
        }   
        },
    });

    return possibleConvo;
};

const checkIfGroupAdmin = async function checkIfUserIsAnAdminOfAGroupChat(userid: string, groupid: string) {
    const possibleGroup = await prisma.groupChat.findFirst({
        where: {
            id: groupid,
            admins: {
                some: {
                    id: userid
                }
            }
        }
    });

    return possibleGroup;
};

const checkIfGroupMember = async function checkIfUserAlreadyAMemberOfGroupChat(userid: string, groupid: string) {
    const possibleGroup = await prisma.groupChat.findFirst({
        where: {
            id: groupid,
            members: {
                some: {
                    id: userid
                }
            }
        }
    });

    return possibleGroup;
};

const checkOwnerOfMessage = async function checkIfUserOwnsMessage(userid: string, messageid: string) {
    const possibleMessage = await prisma.messages.findFirst({
        where: {
            id: messageid,
            senderid: userid
        }
    });

    return possibleMessage;
};

const createRequest = async function createRequestBetweenUsers(senderid: string, receiverid: string, type: Types, sentAt: Date, groupid?: string) {
    const createdRequest = await prisma.requests.create({
        data: {
            receiver: {
                connect: {
                    id: receiverid
                }
            },
            sender : {
                connect: {
                    id: senderid
                }
            },
            type,
            sentAt,
            ...(groupid ? {
                group: {
                    connect:{
                        id: groupid
                    }
                }
            } : {}),
        }
    });

    return createdRequest;
};

const createUser = async function createUserWithUsernameAndPassword(options: UserSign) {
    const createdUser = await prisma.user.create({
        data: {
            ...options,
            ...(options.icon ? { icon: {
                connect: {
                    id: options.icon
                }
            }} : { icon: {
                connect: {
                    id: 1
                }
            }})
        }
    });

    return createdUser;
};

const createGroupChat = async function createGroupChatForUser(userid:  string, name = "New Group") {
    const createdGroup = await prisma.groupChat.create({
        data: {
            admins: {
                connect: {
                    id: userid
                }
            },
            name, 
            members: {
                connect: {
                    id: userid
                }
            }
        }
    });

    return createdGroup;
};

const createConversation = async function createConversationBetweenUsers(userAid: string, userBid: string) {
    const createdConversation = await prisma.conversations.create({
        data: {
            members: {
                connect: [
                    {
                        id: userAid
                    },
                    {
                        id: userBid
                    }
                ]
            }
        }
    });

    return createdConversation;
};

const createFriendship = async function createFriendshipBetweenUsers(userAid: string, userBid: string) {
    const createdFriendship = await prisma.friendships.create({
        data: {
            users: {
                connect: [
                    {
                        id: userAid,
                    },
                    {
                        id: userBid,
                    }
                ]
            }
        }
    });

    return createdFriendship;
};

const createMessage = async function createMessageForGroupOrConvo(content: string, userid: string, sentAt: Date, options: MessagesOptions) {
    const createdMessage = await prisma.messages.create({
        data: {
            sentAt,
            content,
            sender: {
                connect: {
                    id: userid,
                }
            },
            ...(typeof options.convoid === "string" ? {convo: {
                connect: {
                    id: options.convoid
                }
            }}: typeof options.groupid === "string" ? {group: {
                connect: {
                    id: options.groupid
                }
            }}: {}),

        }
    });

    return createdMessage;
};

const updateMessage = async function updateMessageContent(messageid: string, content: string) {
    const updatedMessage = await prisma.messages.update({
        where: {
            id: messageid,
        },
        data: {
            content,
            edited: true
        }
    });

    return updatedMessage;
};

const changeUserInfo = async function updateUserDetails(userid: string, options: UserUpdate ) {
    const {icon, ...rest} = options;
    const updatedUser = await prisma.user.update({
        where: {
            id: userid,
        },
        data: {
            ...rest,
            ...(icon ? {
                icon: {
                    connect: {
                        id: icon,
                    }
                }
            }: {}),
        },
        select: {
            id: true,
            joinedAt: true,
            icon: true,
            name: true,
            username: true,
            aboutMe: true
        }
    });

    return updatedUser;
};

const updateGroupInfo = async function updateGroupDetails(groupid: string, options: GroupOptions) {
    const optionsManager = {
        ADD: "connect",
        REMOVE: "disconnect"
    };

    const updatedGroup = await prisma.groupChat.update({
        where: {
            id: groupid
        },
        data: {
            ...(typeof options.name === "string" ? { name: options.name} : {}),
            ...(typeof options.adminid === "string" && (options.action === "ADD" || options.action === "REMOVE") ? {admins : {
                [optionsManager[options.action]]: {
                    id: options.adminid
                }
            }}: {}),
            ...(typeof options.memberid === "string" && (options.action === "ADD" || options.action === "REMOVE") ? {members: {
                [optionsManager[options.action]]: {
                    id: options.memberid
                }
            }} : {}),
        },
        select: {
            id: true,
            members: {
                select: {
                    id: true
                }
            },
            admins: {
                select: {
                    id: true
                }
            }
        }
    });
    return updatedGroup;
};

const deleteUser = async function deleteUserFromDatabase(userid: string) {
    const deletedUser = await prisma.user.delete({
        where: {
            id: userid
        }
    });

    return deletedUser;
};

const deleteFriendship = async function deleteFriendshipFromDatabase(friendshipid: string) {
    const deletedFriendship = await prisma.friendships.delete({
        where: {
            id: friendshipid
        }
    });

    return deletedFriendship;
};

const deleteGroup = async function deleteGroupChatFromDatabase(groupid: string) {
    const deletedGroup = await prisma.groupChat.delete({
        where: {
            id: groupid,
        }
    });

    return deletedGroup;
};

const deleteConversation = async function deleteConversationFromDatabase(convoid: string) {
    const deletedConversation = await prisma.conversations.delete({
        where: {
            id: convoid
        }
    });

    return deletedConversation;
};

const deleteRequest = async function deleteRequestFromDatabase(requestid: string) {
    const deletedRequest = await prisma.requests.delete({
        where: {
            id: requestid,
        }
    });

    return deletedRequest;
};

const deleteMessage = async function deleteMessageFromDatabase(messageid: string) {
    const deletedMessage = await prisma.messages.delete({
        where: {
            id: messageid
        }
    });

    return deletedMessage;
};

const checkIfUsernameAvailable = async function checkIfUsernameAlreadyInUse(username: string) {
    const possibleUser = await prisma.user.findFirst({
        where: {
            username,
        },
        select: {
            username: true,
        }
    });

    return possibleUser;
};

const checkIfFriendshipExists = async function checkIfFriendshipAlreadyExistsBetweenUsers(userAid: string, userBid: string) {
    const possibleFriendship = await prisma.friendships.findFirst({
        where: {
            AND: [
               {
                users: {
                    some: {
                        id: userAid
                    }
                }
               },
               {
                users: {
                    some: {
                        id: userBid
                    }
                }
               }
            ]
        }
    });

    return possibleFriendship;
};

const checkIfConvoExistsByUsers = async function checkIfConversationAlreadyExistsBetweenUsers(userAid: string, userBid: string) {
    const possibleConvo = await prisma.conversations.findFirst({
        where: {
            AND: [
                {
                    members: {
                        some: {
                            id: userAid,
                        }
                    }
                },
                {
                    members: {
                        some: {
                            id: userBid,
                        }
                    }
                },
            ]
        }
    });

    return possibleConvo;
};

const checkIfConvoIdValid = async function checkIfConversationExistsById(convoid: string) {
    const possibleConvo = await prisma.conversations.findFirst({
        where: {
            id: convoid
        }
    });

    return possibleConvo;
};

const checkIfGroupExists = async function checkIfGroupChatExistsById(groupid: string) {
    const possibleGroup = await prisma.groupChat.findFirst({
        where: {
            id: groupid
        }
    });

    return possibleGroup;
};

const checkIfUserRoleInRequest = async function checkIfUserSentTheRequest(userid: string, requestid: string, type: RequestTypes) {
    const checkManager = {
        sender: "senderid",
        receiver: "receiverid",
    };
    const possibleRequest = await prisma.requests.findFirst({
        where: {
            id: requestid,
            [checkManager[type]]: userid,
        },
        include: {
            group: true
        }
    });

    return possibleRequest;
};

const checkIfUserInRequest = async function checkIfUserSentTheRequest(userid: string, requestid: string) {
    const possibleRequest = await prisma.requests.findFirst({
        where: {
            id: requestid,
            OR: [
                {
                    senderid: userid,
                },
                {
                    receiverid: userid,
                }
            ]
        }
    });

    return possibleRequest;
};

const checkIfInConvo = async function checkIfUserInConversation(userid: string, convoid: string) {
    const possibleConvo = await prisma.conversations.findFirst({
        where: {
            id: convoid,
            members: {
                some: {
                    id: userid
                }
            }

        },
        select: {
            contents: {
                orderBy: {
                    sentAt: "asc"
                },
                select: {
                    sender: {
                        select: {
                            username: true,
                            id: true,
                        },
                    },
                    sentAt: true,
                    content: true,
                    id: true,
                }
            },
            id: true,
        members: {
            select: {
                id: true,
                username: true,
            }
        }   
        },
    });

    return possibleConvo;
};

const checkIfInFriendship = async function checkIfUserInFriendship(userid: string, friendshipid: string) {
    const possibleFriendship = await prisma.friendships.findFirst({
        where: {
            id: friendshipid,
            users: {
                some: {
                    id: userid
                }
            }
        }
    });

    return possibleFriendship;
};

const getRequestInfo = async function getRequestInfoFromDatabase(requestid: string) {
    const possibleRequest = await prisma.requests.findFirst({
        where: {
            id: requestid,
        },
        select: {
            id: true,
            sentAt: true,
            type: true,
            sender: {
                select: {
                    id: true,
                    username:true,
                },
            },
            receiver: {
                select: {
                    id: true,
                    username: true,
                }
            }

        }
    });

    return possibleRequest;
};

const searchForUsers = async function searchForUsersByUsername(username: string) {
    const possibleUsers = await prisma.user.findMany({
        where: {
            username: {
                contains: username
            }
        },
        select: {
            username: true,
            id: true,
        }
    });

    return possibleUsers;
};

const getIconInfo = async function getIconFromId(iconid: number) {
    const iconInfo = await prisma.icons.findFirst({
        where: {
            id: iconid
        }
    });

    return iconInfo;
};

const changeOnlineStatus = async function changeOnlineStatusOfUser(userid: string, status: boolean) {
    const userInfo = await prisma.user.update({
        where: {
            id: userid,
        },
        data: {
            online: status
        }
    });

    return userInfo;
};

const getAllIconsInfo = async function getAllIconsInfoFromDatabase() {
    const iconsInfo = await prisma.icons.findMany();
    return iconsInfo;
};

const checkAndReturnGroup = async function checkIfInGroupAndReturnAllInfo(userid: string, groupid: string) {
    const groupInfo = await prisma.groupChat.findFirst({
        where: {
            id: groupid,
            members: {
                some: {
                    id: userid
                }
            }
        },
        select: {
            id: true,
            members: {
                select: {
                    icon: true,
                    username: true,
                    id: true
                }
            },
            admins: {
                select: {
                    icon: true,
                    username: true,
                    id: true
                }
            },
            contents: {
                orderBy: {
                    sentAt: "asc"
                },
                select: {
                    id: true,
                    content: true,
                    edited: true,
                    sentAt: true,
                    sender: {
                        select: {
                            id: true,
                            username: true
                        }
                    },

                }
            }
        }
    });

    return groupInfo;
};

const getUserPassword = async function getUserHashedPassword(userid: string) {
    const userPw = await prisma.user.findFirst({
        where: {
            id: userid,
        },
        select: {
            password: true
        }
    });

    return userPw;
};

////TEST/POOLING QUERIES ////
const deleteEverything = async function deleteEverythingFromTestDatabase() {
    await prisma.requests.deleteMany();
    await prisma.messages.deleteMany();
    await prisma.groupChat.deleteMany();
    await prisma.conversations.deleteMany();
    await prisma.friendships.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
};

export {
    getUserPassword,
    checkAndReturnGroup,
    getAllIconsInfo,
    getUserByName,
    getUser, 
    getUserFriends, 
    getUserGroupsInfo, 
    findIfRequestExists, 
    getUserConversationsInfo,
    getAllUserRequests,
    getGroupChatMembers,
    getUserSentRequests,
    getConvoInfo,
    getGroupChatMessages,
    getConvoInfoFromId,
    checkIfGroupAdmin,
    createRequest,
    createUser,
    createGroupChat,
    createConversation,
    createFriendship,
    createMessage,
    updateMessage,
    checkOwnerOfMessage,
    updateGroupInfo,
    changeUserInfo,
    deleteConversation,
    deleteFriendship,
    deleteGroup,
    deleteMessage,
    deleteRequest,
    deleteUser,
    checkIfGroupMember,
    checkIfFriendshipExists,
    checkIfUsernameAvailable,
    checkIfConvoExistsByUsers,
    checkIfUserRoleInRequest,
    checkIfConvoIdValid,
    checkIfGroupExists,
    checkIfInConvo,
    checkIfInFriendship,
    getRequestInfo,
    checkIfUserInRequest,
    searchForUsers,
    getIconInfo,
    changeOnlineStatus,
    deleteEverything,
};