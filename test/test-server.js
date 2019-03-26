const chai = require("chai");
const chaiHttp = require("chai-http");

const { app, runServer, closeServer } = require("../server");


//use expect style syntax
const expect = chai.expect;

//make HTTP requests in tests
chai.use(chaiHttp);


describe("Blog Post", function(){
//activate server with runServer promise
    before(function() {
        return runServer();
    });
//close server after tests so that other
//test module may run without error
    after(function() {
        return closeServer();
    });

    //test strategy:
    //  1. make request to `/blog-posts`
    //  2. inspect response object and prove has right code and have
    //  right keys in response object.
    it("should list items on GET", function() {
        return chai
            .request(app)
            .get("/blog-posts")
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a("array");
                
                //because i created two items on app load
                expect(res.body.length).to.be.at.least(1);
                //each item should be an object with key/value pairs
                //for `title`, `content`, `author`, `date`.
                const expectedKeys = ["title", "content", "author", "date"];
                res.body.forEach(function(item) {
                    expect(item).to.be.a("object");
                    expect(item).to.include.keys(expectedKeys);
                }); 
            });
    });

    //test strategy:
    //  1. make a POST request with data for a new blog post
    //  2. inspect response object and prove it has right
    //  status code and that the returned object has an `id`
    it("should add an item on POST", function() {
        const newItem = { title: "star-wars", content: "yoda", author: "george lucas", date: "a long long time ago"};
        return chai
            .request(app)
            .post("/blog-posts")
            .send(newItem)
            .then(function(res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a("object");
                expect(res.body).to.include.keys("id", "title", "content", "author", "date");
                expect(res.body.id).to.not.equal(null);
                //response should be deep equal to `newItem` from above if we assign
                //`id` to it from `res.body.id`
                expect(res.body).to.deep.equal(
                    Object.assign(newItem, { id: res.body.id })
                );
            });
    });

    it("should update items on PUT", function() {
        const updateData = {
            title: "star-wars",
            content: "luke",
            author: "disney",
            date: "1977"
        };

        return (
            chai
                .request(app)
                // first have to get so we have an idea of object to update
                .get("/blog-posts")
                .then(function(res) {
                    updateData.id = res.body[0].id;
                    return chai
                        .request(app)
                        .put(`/blog-posts/${updateData.id}`)
                        .send(updateData);
                })
                .then(function(res) {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a("object");
                    expect(res.body).to.deep.equal(updateData);
                })
        );
    });

    it("should delete items on DELETE", function() {
        return (
            chai
                .request(app)
                .get("/blog-posts")
                .then(function(res) {
                    return chai.request(app).delete(`/blog-posts/${res.body[0].id}`);
                })
                .then(function(res) {
                    expect(res).to.have.status(204);
                })
        );
    });
});

