import prisma from "../config/client";
import { Types } from "@prisma/client";
import { MessagesOptions } from "./types";

const getUser = async function getUserFromDatabase(id: string) {
    const possibleUser = await prisma.user.findFirst({
        where: {
            id
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
                        },
                        where: {
                            NOT: {
                                id,
                            }
                        }
                    }
                }
            }
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
            groups: {
                include: {
                    members: {
                        select: {
                            id: true,
                            username: true,
                        },
                    },
                    admins: {
                        select: {
                            id: true,
                            username: true,
                        },
                    }
                }
            }
        }
    });

    return possibleUser;
};

const findIfRequestExists = async function searchDatabaseIfRequestAlreadyExists(senderid: string, receiverid: string) {

    const possibleRequest = await prisma.requests.findFirst({
        where: {
            AND: [
                {
                    senderid,
                },
                {
                    receiverid,
                }
            ]
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
            convos: {
                select: {
                    id: true,
                    members: {
                        select: {
                            username: true,
                            id: true,
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
        include: {
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
                }
            }
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
        }
    });

    return possibleMessages;
};

const getConvoMessages = async function getConvoMessagesFromIds(userid: string, receiverid: string) {
    const possibleMessages = await prisma.messages.findMany({
        where: {
            convo: {
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
            ]
                
            }
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
        }
    });

    return possibleMessages;
};

const getConvoMessagesFromId = async function getConvoMessagesFromConvoId(convoid: string) {
    const possibleMessages = await prisma.messages.findMany({
        where: {
            convoid
        },
        select: {
            sender: {
                select: { 
                    username: true,
                    id:true,
                }
            },
            content: true,
            sentAt: true,
        }
    });

    return possibleMessages;
};

const checkIfGroupAdmin = async function checkIfUserIsAnAdminOfAGroupChat(userid: string, groupid: string) {
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

const createRequest = async function createRequestBetweenUsers(senderid: string, receiverid: string, type: Types, sentAt: string) {
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
        }
    });

    return createdRequest;
};

const createUser = async function createUserWithUsernameAndPassword(username: string, password: string) {
    const createdUser = await prisma.user.create({
        data: {
            username,
            password
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

const createMessage = async function createMessageForGroupOrConvo(content: string, userid: string, sentAt: string, options: MessagesOptions) {
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



export { 
    getUser, 
    getUserFriends, 
    getUserGroupsInfo, 
    findIfRequestExists, 
    getUserConversationsInfo,
    getAllUserRequests,
    getGroupChatMembers,
    getUserSentRequests,
    getConvoMessages,
    getGroupChatMessages,
    getConvoMessagesFromId,
    checkIfGroupAdmin,
    createRequest,
    createUser,
    createGroupChat,
    createConversation,
    createFriendship,
    createMessage,
};