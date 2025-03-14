import request from 'supertest';
import app, {storeStuff} from '../util/tesconfig';
import { deleteEverything } from '../util/queries';

const server = app.listen();

const testUUID = "1d9011dc-ca50-46c4-97f3-5837e08bcc22";

afterAll(() => {
    return Promise.all([new Promise((resolve) => resolve(storeStuff.shutdown())),new Promise((resolve) => resolve(server.close())),deleteEverything()]);
  });

  ///DOING ERRORS HERE SINCE MOST ARE PART OF NORMAL FUNCTIONALITY WHILE LOGGED IN OR AFTER VALID OPERATIONS
describe("Basic API functionality", () => {
    const userOne = request.agent(server);
    const userTwo = request.agent(server);
    const userError = request.agent(server);
    const userTwoInfo : {
        id?: string,
        requestid?: string,
        secondrequestid?: string,
        grouprequestid?: string,
        secondgrouprequestid? :string,
        messageid?: string,
    } = {};
    const userOneInfo : {
        id?: string,
        groupid?: string,
        convoid?: string,
    } = {};

    test("create User", done => {
        userOne
            .post("/users")
            .send({
                username: "darkMagician",
                password: "12345"
            })
            .expect("Content-Type", /json/)
            .expect(200, done)
    })

    test("create second user", done => {
        userTwo
            .post("/users")
            .send({
                username: "garrosh",
                password: "6789"
            })
            .expect("Content-Type", /json/)
            .expect(200, done)
    })

    ///ERROR TEST
    test("cant create user with same username", done => {
        userError
        .post("/users")
        .send({
            username: "darkMagician",
            password: "klll12"
        })
        .expect("Content-Type", /json/)
        .expect(400, done)
    })

    test("login user", done  => {
        userOne
            .post("/auth")
            .send({
                username: "darkMagician",
                password: "12345"
            })
            .expect("Content-Type", /json/)
            .expect(200, done)
    })

    test("Login second user", done => {
        userTwo
            .post("/auth")
            .send({
                username: "garrosh",
                password: "6789"
            })
            .expect("Content-Type", /json/)
            .expect(200, done)
    })

    test("get self info", done => {
        userOne
            .get("/users/profile")
            .expect("Content-Type", /json/)
            .expect(200)
            .then((res) => {
                expect(res.body).toHaveProperty("user");
                userOneInfo.id = res.body.user.id;
                done();
            });
    });

    test("get self info 2", done => {
        userTwo
            .get("/users/profile")
            .expect("Content-Type", /json/)
            .expect(200)
            .then((res) => {
                expect(res.body).toHaveProperty("user");
                userTwoInfo.id = res.body.user.id;
                done();
            });
    });

    ///ERROR TEST
    test("cant get user that doesn't exist", done => {
        userOne
            .get(`/users/${testUUID}`)
            .expect("Content-Type", /json/)
            .expect(400, done)
    })

    ///ERROR TEST
    test("can't update with an invalid icon id", done => {
        userOne
            .put(`/users/profile`)
            .send({
                icon: 25,
            })
            .expect("Content-Type", /json/)
            .expect({message: "Invalid Icon Id"})
            .expect(400, done)
    });

    ///ERROR TEST
    test("can't update with an already used username", done => {
        userOne
            .put(`/users/profile`)
            .send({
                username: "garrosh",
            })
            .expect("Content-Type", /json/)
            .expect({message: "Invalid Username"})
            .expect(400, done)
    });

    ///ERROR TEST
    test("can't update if one of the passwords is missing", done => {
        userOne
            .put(`/users/profile`)
            .send({
                password: "123"
            })
            .expect("Content-Type", /json/)
            .expect({message: "Missing either old or new password"})
            .expect(400, done)
    });

    ///ERROR TEST
    test("can't update if passwords don't match", done => {
        userOne
            .put(`/users/profile`)
            .send({
                oldPassword: "1235jhh",
                password: "ggg",
            })
            .expect("Content-Type", /json/)
            .expect({message: "Wrong old password"})
            .expect(400, done)
    });

    ///ERROR TEST
    test("can't get request if it doesn't exist or is not part of it", done => {
        userOne
            .get(`/requests/${testUUID}`)
            .expect("Content-Type", /json/)
            .expect(400, done)
    })

     ///ERROR TEST
    test("can't send invite to an user that doesn't exist", done => {
        userOne
            .post("/requests")
            .send({
                type: "FRIEND",
                targetid: testUUID,
            })
            .expect("Content-Type", /json/)
            .expect(400, done)
    })

     ///ERROR TEST
    test("can't send invite to himself", done => {
        userOne
            .post("/requests")
            .send({
                type: "FRIEND",
                targetid: userOneInfo.id,
            })
            .expect("Content-Type", /json/)
            .expect(400, done)
    })

    
    test("get user", done => {
        userOne
            .get(`/users/${userTwoInfo.id}`)
            .expect("Content-Type", /json/)
            .expect(200)
            .then((res) => {
                expect(res.body).toHaveProperty("user");
                done();
            });
    });

    ///ERROR TEST
    test("can't delete friendship that doesn't exist", done => {
        userOne
            .delete(`/friends/${userTwoInfo.id}`)
            .expect("Content-Type", /json/)
            .expect({message: "Friendship doesn't exist"})
            .expect(400, done)
    })

    test("send friendrequest", done => {
        userOne
            .post("/requests")
            .send({
                type: "FRIEND",
                targetid: userTwoInfo.id,
            })
            .expect("Content-Type", /json/)
            .expect(200, done)
    })

    ///ERROR TEST
    test("can't send request twice", done => {
        userOne
            .post("/requests")
            .send({
                type: "FRIEND",
                targetid: userTwoInfo.id,
            })
            .expect("Content-Type", /json/)
            .expect({message: "Request Already Sent"})
            .expect(400, done)
    })

    ///ERROR TEST
    test("can't accept own request", done => {
        userOne
            .put(`/requests/${userTwoInfo.requestid}`)
            .expect("Content-Type", /json/)
            .expect(400, done)
    })

    test("get requests", done => {
        userTwo
            .get("/requests")
            .expect("Content-Type", /json/)
            .expect(200)
            .then((res) => {
                expect(res.body).toHaveProperty("user");
                userTwoInfo.requestid = res.body.user.receivedRequest[0].id;
                done();
            });
            
    })

    test("get sent requests", done => {
        userOne
            .get("/requests/sent")
            .expect("Content-Type", /json/)
            .expect(200)
            .then((res) => {
                expect(res.body).toHaveProperty("user");
                done();
            });
            
    });

    test("get request", done => {
        userTwo
            .get(`/requests/${userTwoInfo.requestid}`)
            .expect("Content-Type", /json/)
            .expect(200)
            .then((res) => {
                expect(res.body).toHaveProperty("request");
                done();
            });
    })

    test("accept friendrequest", done => {
        userTwo
            .put(`/requests/${userTwoInfo.requestid}`)
            .expect("Content-Type", /json/)
            .expect(200, done)
    })

    test("get friends", done => {
        userOne
            .get("/friends")
            .expect("Content-Type", /json/)
            .expect(200)
            .then((res) => {
                expect(res.body).toHaveProperty("friends");
                done();
            });
    })

    ///ERROR TEST
    test("Can't send friend request if already friends", done => {
        userOne
            .post("/requests")
            .send({
                type: "FRIEND",
                targetid: userTwoInfo.id,
            })
            .expect("Content-Type", /json/)
            .expect({message: "Already Friends"})
            .expect(400, done)
    })
    
    test("get icons", done => {
        userOne
            .get(`/users/profile/icons`)
            .expect("Content-Type", /json/)
            .expect(200)
            .then((res) => {
                expect(res.body).toHaveProperty("icons");
                done();
            });
    });
    
    test("search user", done => {
        userOne
        .get(`/users/search`)
        .query({user: "d"})
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
            expect(res.body).toHaveProperty("users");
            done();
          });
    });
    
    test("update user info", done => {
        userOne
            .put(`/users/profile`)
            .send({
                username: "blueeyes",
                oldPassword: "12345",
                password: "ggg",
                icon: 2,
                name: "john",
                aboutMe: "HELLO WORLD"
            })
            .expect("Content-Type", /json/)
            .expect(200, done)
    });

    test("update profile with custom file", done => {
        userOne
            .put("/users/profile")
            .set("Content-Type", "multipart/form-data")
            .attach("uploaded_file", "util/pools/testStuff/waldo.png")
            .expect("Content-Type", /json/)
            .expect(200, done)
    });

    ///ERROR TEST
    test("fail to update with image too large", done => {
        userOne
        .put("/users/profile")
        .set("Content-Type", "multipart/form-data")
        .attach("uploaded_file", "util/pools/testStuff/book4troy.webp")
        .expect("Content-Type", /json/)
        .expect(400, done)
    });

    test("create conversation", done => {
        userTwo
            .post("/conversations/create")
            .send({
                targetid: userOneInfo.id
            })
            .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
            expect(res.body).toHaveProperty("conversation");
            done();
          });
    });

    test("send message in conversation", done => {
        userTwo
            .post("/conversations")
            .send({
                targetid: userOneInfo.id,
                content: "HELLO WORLD !"
            })
            .expect("Content-Type", /json/)
            .expect(200, done)
    })

    ///ERROR TEST
    test("can't start conversation with a user that doesn't exist", done => {
        userOne
            .post("/conversations")
            .send({
                targetid: testUUID,
                content: "HELLO WORLD !"
            })
            .expect("Content-Type", /json/)
            .expect(400, done)
    })

    ///ERROR TEST
    test("can't start conversation or add to conversation if given conversationid is wrong(isn't in that convo or doesn't exist)", done => {
        userOne
            .post("/conversations")
            .send({
                targetid: testUUID,
                content: "HELLO WORLD !",
                conversationid: testUUID,
            })
            .expect("Content-Type", /json/)
            .expect(400, done)
    })

    test("get conversations", done => {
        userOne
            .get("/conversations")
            .expect("Content-Type", /json/)
            .expect(200)
            .then((res) => {
                expect(res.body).toHaveProperty("user");
                userOneInfo.convoid = res.body.user.convos[0].id;
                done();
            });
    })

    test("get conversation", done => {
        userTwo
            .get(`/conversations/${userOneInfo.convoid}`)
            .expect("Content-Type", /json/)
            .expect(200)
            .then((res) => {
                expect(res.body).toHaveProperty("conversation");
                userTwoInfo.messageid = res.body.conversation.contents[0].id;
                done();
            });
    });

    test("send message with image", done => {
        userTwo
        .post("/conversations")
        .set("Content-Type", "multipart/form-data")
        .field("content", "HELLO WORLD !")
        .field("conversationid", userOneInfo.convoid as string)
        .attach("uploaded_file", "util/pools/testStuff/waldo.png")
        .expect("Content-Type", /json/)
        .expect(200, done)
    });

    test("sends message in conversation when conversationid is provided", done => {
        userTwo
            .post("/conversations")
            .send({
                targetid: userOneInfo.id,
                content: "HELLO WORLD !",
                conversationid: userOneInfo.convoid
            })
            .expect("Content-Type", /json/)
            .expect(200, done)
    })

    ///ERROR TEST
    test("can't get a conversation that doesn't exist/isn't in", done => {
        userOne
            .get(`/conversations/${testUUID}`)
            .expect("Content-Type", /json/)
            .expect(400, done)
    });

    ///ERROR TEST
    test("can't edit message you don't own", done => {
        userOne
            .put(`/messages/${userTwoInfo.messageid}`)
            .send({
                content: "GOODBYE MINE?"
            })
            .expect("Content-Type", /json/)
            .expect(400, done)
    });

    test("edit message", done => {
        userTwo
            .put(`/messages/${userTwoInfo.messageid}`)
            .send({
                content: "GOODBYE MINE?"
            })
            .expect("Content-Type", /json/)
            .expect(200, done)
    });

    ///ERROR TEST
    test("can't delete message you don't own", done => {
        userOne
            .delete(`/messages/${userTwoInfo.messageid}`)
            .expect("Content-Type", /json/)
            .expect(400, done)
    })

    test("delete message", done => {
        userTwo
            .delete(`/messages/${userTwoInfo.messageid}`)
            .expect("Content-Type", /json/)
            .expect(200, done)
    })

    test("create group", done => {
        userOne
            .post("/groups")
            .expect("Content-Type", /json/)
            .expect(200)
            .then((res) => {
                expect(res.body).toHaveProperty("group");
                userOneInfo.groupid = res.body.group.id;
                done();
            });
    })

    test("get group", done => {
        userOne
            .get(`/groups/${userOneInfo.groupid}`)
            .expect("Content-Type", /json/)
            .expect(200)
            .then((res) => {
                expect(res.body).toHaveProperty("group");
                done();
            });
    })

    ///ERROR TEST
    test("can't get group that doesn't exist", done => {
        userOne
            .get(`/groups/${testUUID}`)
            .expect("Content-Type", /json/)
            .expect(400, done)
    })

    test("get groups", done => {
        userOne
            .get(`/groups`)
            .expect("Content-Type", /json/)
            .expect(200)
            .then((res) => {
                expect(res.body).toHaveProperty("user");
                done();
            });
    })

    ///ERROR TEST
    test("can't invite without being admin", done => {
        userTwo
        .post("/requests")
        .send({
            type: "GROUP",
            targetid: userOneInfo.id,
            groupid: userOneInfo.groupid,
        })
        .expect("Content-Type", /json/)
        .expect({message: "Only Admins Can Invite"})
        .expect(400, done)
    })

    ///ERROR TEST
    test("Can't invite without group id", done => {
        userOne
            .post("/requests")
            .send({
                type: "GROUP",
                targetid: userTwoInfo.id,
            })
            .expect("Content-Type", /json/)
            .expect({message: "GroupId Required for Group Requests"})
            .expect(400, done)
    })

    ///ERROR TEST
    test("can't leave group you aren't in", done => {
        userTwo
            .post(`/groups/${userOneInfo.groupid}/leave`)
            .expect("Content-Type", /json/)
            .expect(400, done)
    })

    ///ERROR TEST
    test("can't send message in a group you aren't in", done => {
        userTwo
            .post(`/groups/${userOneInfo.groupid}`)
            .send({
                content: "lepsaum asdsaofa ft."
            })
            .expect("Content-Type", /json/)
            .expect(400, done)
    })

    test("invite to group", done => {
        userOne
            .post("/requests")
            .send({
                type: "GROUP",
                targetid: userTwoInfo.id,
                groupid: userOneInfo.groupid,
            })
            .expect("Content-Type", /json/)
            .expect(200, done)
    })

    test("get requests for request id", done => {
        userTwo
            .get("/requests")
            .expect("Content-Type", /json/)
            .expect(200)
            .then((res) => {
                expect(res.body).toHaveProperty("user");
                userTwoInfo.grouprequestid = res.body.user.receivedRequest[0].id;
                done();
            });
            
    })

    ///ERROR TEST
    test("can't promote someone not in group", done => {
        userOne
            .put(`/groups/${userOneInfo.groupid}`)
            .send({
                targetid: userTwoInfo.id,
                action: "PROMOTE"
            })
            .expect("Content-Type", /json/)
            .expect(400, done)
    })

    test("accept invite to group", done => {
        userTwo
            .put(`/requests/${userTwoInfo.grouprequestid}`)
            .expect("Content-Type", /json/)
            .expect(200, done)
    })

    test("send message in group", done => {
        userOne
            .post(`/groups/${userOneInfo.groupid}`)
            .send({
                content: "lepsaum asdsaofa ft."
            })
            .expect("Content-Type", /json/)
            .expect(200, done)
    })

    ///ERROR TEST
    test("can't invite if already a member", done => {
        userOne
            .post("/requests")
            .send({
                type: "GROUP",
                targetid: userTwoInfo.id,
                groupid: userOneInfo.groupid,
            })
            .expect("Content-Type", /json/)
            .expect({message: "Already a Member"})
            .expect(400, done)
    })

    ///ERROR TEST
    test("can't update group if not an Admin", done => {
        userTwo
            .put(`/groups/${userOneInfo.groupid}`)
            .send({
                name: "vip gang"
            })
            .expect("Content-Type", /json/)
            .expect(400, done)
    })

    test("change group name", done => {
        userOne
            .put(`/groups/${userOneInfo.groupid}`)
            .send({
                name: "vip gang"
            })
            .expect("Content-Type", /json/)
            .expect(200, done)
    })

    ///ERROR TEST
    test("can't promote or demote someone that doesn't exist", done => {
        userOne
            .put(`/groups/${userOneInfo.groupid}`)
            .send({
                targetid: testUUID,
                action: "PROMOTE"
            })
            .expect("Content-Type", /json/)
            .expect(400, done)
    })

    ///ERROR TEST
    test("can't demote if user not an admin already", done  => {
        userOne
            .put(`/groups/${userOneInfo.groupid}`)
            .send({
                targetid: userTwoInfo.id,
                action: "DEMOTE"
            })
            .expect("Content-Type", /json/)
            .expect(400, done)
    })

    test("promote in group", done => {
        userOne
            .put(`/groups/${userOneInfo.groupid}`)
            .send({
                targetid: userTwoInfo.id,
                action: "PROMOTE"
            })
            .expect("Content-Type", /json/)
            .expect(200, done)
    })

    test("demote in group", done  => {
        userOne
            .put(`/groups/${userOneInfo.groupid}`)
            .send({
                targetid: userTwoInfo.id,
                action: "DEMOTE"
            })
            .expect("Content-Type", /json/)
            .expect(200, done)
    })

    test("remove from group", done => {
        userOne
            .put(`/groups/${userOneInfo.groupid}`)
            .send({
                targetid: userTwoInfo.id,
                action: "REMOVE"
            })
            .expect("Content-Type", /json/)
            .expect(200, done)
    })

    test("invite to group again", done => {
        userOne
            .post("/requests")
            .send({
                type: "GROUP",
                targetid: userTwoInfo.id,
                groupid: userOneInfo.groupid,
            })
            .expect("Content-Type", /json/)
            .expect(200, done)
    })

    test("get requests for request id again", done => {
        userTwo
            .get("/requests")
            .expect("Content-Type", /json/)
            .expect(200)
            .then((res) => {
                expect(res.body).toHaveProperty("user");
                userTwoInfo.secondgrouprequestid = res.body.user.receivedRequest[0].id;
                done();
            });
            
    })

    test("accept reinvite to group", done => {
        userTwo
            .put(`/requests/${userTwoInfo.secondgrouprequestid}`)
            .expect("Content-Type", /json/)
            .expect(200, done)
    })

    ///ERROR TEST
    test("can't delete group you aren't admin of", done => {
        userTwo
            .delete(`/groups/${userOneInfo.groupid}`)
            .expect("Content-Type", /json/)
            .expect(400, done)
    })

    test("leave group", done => {
        userTwo
            .post(`/groups/${userOneInfo.groupid}/leave`)
            .expect("Content-Type", /json/)
            .expect(200, done)
    })

    test("delete group", done => {
        userOne
            .delete(`/groups/${userOneInfo.groupid}`)
            .expect("Content-Type", /json/)
            .expect(200, done)
    })

    test("delete friendship", done => {
        userOne
            .delete(`/friends/${userTwoInfo.id}`)
            .expect("Content-Type", /json/)
            .expect(200, done)
    })

    test("send friendship again", done => {
        userOne
            .post("/requests")
            .send({
                type: "FRIEND",
                targetid: userTwoInfo.id,
            })
            .expect("Content-Type", /json/)
            .expect(200, done)
    })

    test("get requests again", done => {
        userTwo
            .get("/requests")
            .expect("Content-Type", /json/)
            .expect(200)
            .then((res) => {
                expect(res.body).toHaveProperty("user");
                userTwoInfo.secondrequestid = res.body.user.receivedRequest[0].id;
                done();
            });
            
    })

    test("decline friendship", done => {
        userTwo
            .delete(`/requests/${userTwoInfo.secondrequestid}`)
            .expect("Content-Type", /json/)
            .expect(200, done)
    })

    test("logout user two", done => {
        userTwo
        .put("/auth")
        .expect("Content-Type", /json/)
        .expect(200, done)
    });


    test("logout user", done => {
        userOne
        .put("/auth")
        .expect("Content-Type", /json/)
        .expect(200, done)
    });
});
  