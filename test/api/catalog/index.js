const chai = require("chai");
const chaiHttp = require("chai-http");
const { describe, it } = require("mocha");

const server = require("../../../index");

chai.should();
chai.use(chaiHttp);

describe("Tasks API Catalog", () => {
	describe("GET /catalog", () => {
		it("It should be GET all the Catalog", (done) => {
			chai.request(server)
				.get("/catalog")
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a("object");
					res.body.should.have.own.property("message");
					res.body.data.length.should.be.eq(4);
					done();
				});
		});
	});
	describe("GET /catalog/:id", () => {
		it("It should be GET the Catalog", (done) => {
			const catalogId = 1;
			const listProperty = ["catalog_id", "title", "text_content", "tag", "poster_img"];
			chai.request(server)
				.get(`/catalog/${catalogId}`)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a("object");
					res.body.message.should.be.a("string");
					res.body.data.should.be.a("object");
					listProperty.forEach((property) => {
						res.body.data.should.have.property(property);
					});
					done();
				});
		});
	});
	describe("GET /catalog/:id/comments", () => {
		it("It should be GET the Catalog", (done) => {
			const catalogId = 10;

			chai.request(server)
				.get(`/catalog/${catalogId}/comments`)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.message.should.be.a("string");
					res.body.data.should.be.a("array");
					done();
				});
		});
	});
});
