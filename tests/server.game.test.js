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
  players: ['Jan', 'Jeff'],
	isprivate: false
}, {
  _id: new ObjectID(),
  sport: 'Sport',
  name: 'Alex',
  location: 'San Jose',
  id: 12346,
  owner: 'Jan',
  players: ['Alex', 'Jeff'],
	isprivate: false
},
{
	_id: new ObjectID(),
  sport: 'Sport',
  name: 'Alex',
  location: 'San Jose',
  id: 12349,
  owner: 'Alex',
  players: ['Alex'],
	isprivate: true
}];

beforeEach((done) => {
	Game.remove({}).then(() => done());
});

beforeEach((done) => {
	Game.insertMany(games).then(() => done());
})

describe('All Game tests', () => {
	describe('POST /postgames', () => {
		it('should create new game and add to database', (done) => {

			var gameData= {
				sport: 'sport',
				location: 'location',
				name: 'name',
				user: 'user',
				isprivate: false,
				id: 517381293891,
				lat: 32,
				lng: 27,
				startTime: 123,
				gameLength: 123
			}

			request(app)
			.post('/postgames')
			.send(gameData)
			.expect(200)
			.expect((res) => {
				expect(res.body.game.sport).toBe('sport');
				expect(res.body.game.location).toBe('location');
				expect(res.body.game.name).toBe('name');
				expect(res.body.game.id).toBe(517381293891);
				expect(res.body.game.owner).toBe('user');
				expect(res.body.game.players).toEqual(['user']);
				expect(res.body.game.startTime).toBe(123);
				expect(res.body.game.endTime).toBe(123+123);
				expect(res.body.game.coords.coordinates).toEqual([27,32]);
			})
			.end((err, res) => {
				if(err){
					return done(err);
				}

				Game.find({}).then((games) => {
					expect(games.length).toBe(4);
					done();
				}).catch((e) => done(e));
			});
		});

		it('should not create a game with invalid body data', (done) => {
			request(app)
			.post('/postgames')
			.send({sport: 'sport'})
			.expect(400)
			.end((err, res) => {
				if(err){
					return done(err);
				}

				Game.find().then((games) => {
					expect(games.length).toBe(3);
					done();
				}).catch((e) => done(e));
			});
		});

		it('should not create game with no body data', (done) => {
			request(app)
			.post('/postgames')
			.send({})
			.expect(400)
			.end((err, res) => {
				if(err){
					return done(err);
				}

				Game.find().then((games) => {
					expect(games.length).toBe(3);
					done();
				}).catch((e) => done(e));
			});
		});
	});

	describe('PATCH /leave:games', () => {
		it('should update and remove a player in a game', (done) => {
			request(app)
			.patch('/leave:games')
			.send({
				gid: 12345,
				uid: 'Jeff'
			})
			.expect(200)
			.expect((res) => {
				expect(res.body.game.players).toEqual(['Jan'])
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
		})

		it('should remove the game when last player is removed', (done) => {
			request(app)
			.patch('/leave:games')
			.send({
				gid: 12349,
				uid: 'Alex'
			})
			.expect(200)
			.end((err, res) => {
				if(err){
					return done(err);
				}

				Game.find({}).then((games) => {
					expect(games.length).toBe(2);
					done();
				}).catch((e) => done(e));
			});
		})

		it('should return normally but not remove anything if player leaving is not a game player', (done) => {
			request(app)
			.patch('/leave:games')
			.send({
				gid: 12349,
				uid: 'Jordan'
			})
			.expect(200)
			.end((err, res) => {
				if(err){
					return done(err);
				}

				Game.find({}).then((games) => {
					expect(games.length).toBe(3);
					done();
				}).catch((e) => done(e));
			});
		})
	})

	describe('PATCH /game:user', () => {
		it('should add a user to a game', (done) => {
			request(app)
			.patch('/game:user')
			.send({
				gid: 12345,
				uid: 'Khach'
			})
			.expect(200)
			.expect((res) => {
				expect(res.body.game.players).toEqual(['Jan', 'Jeff', 'Khach'])
			})
			.end((err, res) => {
				if(err){
					return done(err);
				}

				Game.find().then((games) => {
					expect(games.length).toBe(3);
					done();
				}).catch((e) => done(e));
			});
		});
		it('should not add a redundant user to a game', (done) => {
			request(app)
			.patch('/game:user')
			.send({
				gid: 12345,
				uid: 'Jeff'
			})
			.expect(200)
			.end((err, res) => {
				if(err){
					return done(err);
				}

				Game.find().then((games) => {
					expect(games.length).toBe(3);
					expect(JSON.stringify(games[0].players)).toEqual(JSON.stringify(['Jan', 'Jeff']));
					done();
				}).catch((e) => done(e));
			});
		});
	})

	describe('DELETE /games', () => {
		it('should remove a game', (done) => {
			request(app)
			.delete('/games')
			.send({gid: 12345})
			.expect(200)
			.end((err, res) => {
				if(err){
					return done(err);
				}

				Game.find().then((games) => {
					expect(games.length).toBe(2);
					done();
				}).catch((e) => done(e));
			});
		});
	})
})
