const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server.js');
const {Game} = require('./../db/game.js');

const games = [{
	_id: new ObjectID(),
  sport: 'Sport',
  name: 'Jan',
  location: 'San Jose',
  id: 12345,
  owner: 'Jan',
  players: ['Jan', 'Jeff']
}, {
  _id: new ObjectID(),
  sport: 'Sport',
  name: 'Alex',
  location: 'San Jose',
  id: 12346,
  owner: 'Jan',
  players: ['Alex', 'Jeff']
}];

beforeEach((done) => {
	Game.remove({}).then(() => done());
});

beforeEach((done) => {
	Game.insertMany(games).then(() => done());
});

describe('POST /games', () => {
	it('should create new game', (done) => {

    var sport = 'Activity';
    var name = 'Name';
    var location = 'Location';

		request(app)
		.post('/games')
		.send({
			sport,
			name,
			location
		})
		.expect(200)
		.expect((res) => {
			expect(res.body.sport).toBe(sport);
		})
		.end((err, res) => {
			if(err){
				return done(err);
			}

			Game.find({}).then((games) => {
				expect(games.length).toBe(3);
				done();
			}).catch((e) => done(e));
		});
	});

	// it('should not create todo invalid body data', (done) => {
	// 	request(app)
	// 	.post('/todos')
	// 	.send({})
	// 	.expect(400)
	// 	.end((err, res) => {
	// 		if(err){
	// 			return done(err);
	// 		}
  //
	// 		Todo.find().then((todos) => {
	// 			expect(todos.length).toBe(2);
	// 			done();
	// 		}).catch((e) => done(e));
	// 	});
	// });
});
