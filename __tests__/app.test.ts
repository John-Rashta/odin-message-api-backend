import request from 'supertest';
import app, {storeStuff} from '../util/tesconfig';
import { deleteEverything } from '../util/queries';

const server = app.listen();

afterAll(() => {
    return Promise.all([new Promise((resolve) => resolve(storeStuff.shutdown())),new Promise((resolve) => resolve(server.close())),deleteEverything()]);
  });

describe("Basic API functionality", () => {
    const userOne = request.agent(server);
    const userTwo = request.agent(server);
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

    test("start conversation", done => {
        userTwo
            .post("/conversations")
            .send({
                targetid: userOneInfo.id,
                content: "HELLO WORLD !"
            })
            .expect("Content-Type", /json/)
            .expect(200, done)
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

    test("edit message", done => {
        userTwo
            .put(`/messages/${userTwoInfo.messageid}`)
            .send({
                content: "GOODBYE MINE?"
            })
            .expect("Content-Type", /json/)
            .expect(200, done)
    });

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

    test("change group name", done => {
        userOne
            .put(`/groups/${userOneInfo.groupid}`)
            .send({
                name: "vip gang"
            })
            .expect("Content-Type", /json/)
            .expect(200, done)
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
  