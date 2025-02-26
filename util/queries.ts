import prisma from "../config/client";

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

const getUserGroups = async function getUserGroupChatsFromId(id: string) {
    const possibleUser = await prisma.user.findFirst({
        where: {
            id
        },
        select: {
            groups: {
                include: {
                    members: {
                        select: {
                            id: true,
                            username: true,
                        },
                    },
                    contents: {
                        include: {
                            sender: {
                                select: {
                                    username: true,
                                    id: true,
                                }
                            }
                        }
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

const getUserConversations = async function getAllOfUserConversationsFromDatabase(id: string) {
    const possibleUser = await prisma.user.findFirst({
        where: {
            id,
        },
        select: {
            convos: {
                select: {
                    contents: {
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
                    },
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


export { 
    getUser, 
    getUserFriends, 
    getUserGroups, 
    findIfRequestExists, 
    getUserConversations,
    getAllUserRequests,
    getGroupChatMembers,
    getUserSentRequests,
    getConvoMessages,
    getGroupChatMessages,
};