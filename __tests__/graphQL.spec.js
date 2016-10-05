var tester = require('graphql-tester').tester;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.should();
chai.use(chaiAsPromised);

// POST
describe('ReTok GraphQL', () => {
  var GraphQL = tester({
    url: 'http://localhost:3000/graphql',
    method: 'POST'
  });
  
  describe('Successfully adding users to DB through GraphQL', () => {
    var userObj = {
      user0: 'username:"aaa" password:"aaa" email:"aaa"',
      user1: 'username:"bbb" password:"bbb" email:"bbb"',
      user2: 'username:"ccc" password:"ccc" email:"ccc"',
      user3: 'username:"ddd" password:"ddd" email:"ddd"',
      user4: 'username:"eee" password:"eee" email:"eee"',
      user5: 'username:"fff" password:"fff" email:"fff"'
    }


      it('Returns success', () => {
        for(var user in userObj) {
          return GraphQL('mutation adduser{addUser(' + userObj[user] + '){id username email}}').then(function(res) {
            return GraphQL('{users{username email}}').then(function(response) {
              console.log('response: ', response.data.users);
            })

          })
        }
      });
      // it('Returns the correct Status code', () => {
      //   return response.should.eventually.have.property('status').equal(200);
      // });
      // it('Returns the correct name', () => {
      //   return response.should.eventually.have.deep.property('data.users[0].id').equal(userObj[user].substring(10, 13));
      // });
  });
  
  describe('Getting the name of non-existent user 5', () => {
    var response = GraphQL("{users(id:5){id}}");
    
    it('Returns failure', () => {
      return response.should.eventually.have.property('success').equal(true);
    });
    it('Returns the correct Status code', () => {
      return response.should.eventually.have.property('status').equal(200);
    });
    it('Returns some errors', () => {
      return response.should.eventually.have.property('errors');
    });
  });
  
  describe('Incorrect argument requested', () => {
    var response = GraphQL('{ person(personId: 1) { name } }');
    
    it('Returns failure', () => {
      return response.should.eventually.have.property('success').equal(false);
    });
    it('Returns the correct Status code', () => {
      return response.should.eventually.have.property('status').equal(400);
    });
    it('Returns some errors', () => {
      return response.should.eventually.have.property('errors');
    });
  });
});

// GET
describe('ReTok GraphQL', () => {
  var GraphQL = tester({
    url: 'http://localhost:3000/graphql',
    method: 'GET'
  });
  
  describe('Successfully getting the name of Person #1', () => {
    var response = GraphQL("{users{id}}");
    
    it('Returns success', () => {
      return response.should.eventually.have.property('success').equal(true);
    });
    it('Returns the correct Status code', () => {
      return response.should.eventually.have.property('status').equal(200);
    });
    it('Returns the correct name', () => {
      return response.should.eventually.have.deep.property('data.users[0].id').equal(1);
    });
  });
  
  describe('Getting the name of non-existent user 5', () => {
    var response = GraphQL("{users(id:5){id}}");
    
    it('Returns failure', () => {
      return response.should.eventually.have.property('success').equal(true);
    });
    it('Returns the correct Status code', () => {
      return response.should.eventually.have.property('status').equal(200);
    });
    it('Returns some errors', () => {
      return response.should.eventually.have.property('errors');
    });
  });
  
  describe('Incorrect argument requested', () => {
    var response = GraphQL('{ person(personId: 1) { name } }');
    
    it('Returns failure', () => {
      return response.should.eventually.have.property('success').equal(false);
    });
    it('Returns the correct Status code', () => {
      return response.should.eventually.have.property('status').equal(400);
    });
    it('Returns some errors', () => {
      return response.should.eventually.have.property('errors');
    });
  });
});
