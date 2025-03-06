import request from 'supertest';
import app, {storeStuff} from '../util/tesconfig';
import { deleteEverything } from '../util/queries';

const server = app.listen();

afterAll(() => {
    return Promise.all([new Promise((resolve) => resolve(storeStuff.shutdown())),new Promise((resolve) => resolve(server.close())),deleteEverything()]);
  });

describe("Basic API functionality", () => {
    const userOne = request.agent(server);
    const userOneInfo : {
        id?: string,
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

    test("get self info", done => {
        userOne
            .get("/users/profile")
            .expect("Content-Type", /json/)
            .expect(200)
            .then((res) => {
                expect(res.body).toHaveProperty("user");
                console.log(res.body)
                userOneInfo.id = res.body.user.id;
                done();
            });
    });
    
    test("get user", done => {
        userOne
        .get(`/users/${userOneInfo.id}`)
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
            expect(res.body).toHaveProperty("user");
            done();
          });
    });
    
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



    test("logout user", done => {
        userOne
        .put("/auth")
        .expect("Content-Type", /json/)
        .expect(200, done)
    });
});
  