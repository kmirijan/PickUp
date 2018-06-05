const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server.js');
const {TeamGame} = require('./../db/teamgame.js');

const teamGames = [{
	_id: new ObjectID(),
  sport: 'Sport',
  name: 'Jan team game',
  location: 'San Jose',
  id: 12345,
  owner: 'Jan',
  teams: ['44444', '44445'],
	isprivate: false
}];

beforeEach((done) => {
	TeamGame.remove({}).then(() => done());
});

beforeEach((done) => {
	TeamGame.insertMany(teamGames).then(() => done());
})

describe('All Team Game tests', () => {
	describe('POST /postTeamGame', () => {
		it('should create new game and add to database', (done) => {

			var teamGameData= {
				sport: 'sport',
				location: 'location',
				name: 'team game name',
				user: 'user',
				isprivate: false,
				gameId: 517381293891,
				teamId: 777777
			}

			request(app)
			.post('/postTeamGame')
			.send(teamGameData)
			.expect(200)
			.expect((res) => {
				expect(res.body.teamGame.sport).toBe('sport');
				expect(res.body.teamGame.location).toBe('location');
				expect(res.body.teamGame.name).toBe('team game name');
				expect(res.body.teamGame.id).toBe(517381293891);
				expect(res.body.teamGame.owner).toBe('user');
				expect(res.body.teamGame.teams).toEqual([777777]);
			})
			.end((err, res) => {
				if(err){
					return done(err);
				}

				TeamGame.find({}).then((teamGames) => {
					expect(teamGames.length).toBe(2);
					done();
				}).catch((e) => done(e));
			});
		});

	// 	it('should not create a game with invalid body data', (done) => {
	// 		request(app)
	// 		.post('/postgames')
	// 		.send({sport: 'sport'})
	// 		.expect(400)
	// 		.end((err, res) => {
	// 			if(err){
	// 				return done(err);
	// 			}
	//
	// 			Game.find().then((games) => {
	// 				expect(games.length).toBe(3);
	// 				done();
	// 			}).catch((e) => done(e));
	// 		});
	// 	});
	//
	// 	it('should not create game with no body data', (done) => {
	// 		request(app)
	// 		.post('/postgames')
	// 		.send({})
	// 		.expect(400)
	// 		.end((err, res) => {
	// 			if(err){
	// 				return done(err);
	// 			}
	//
	// 			Game.find().then((games) => {
	// 				expect(games.length).toBe(3);
	// 				done();
	// 			}).catch((e) => done(e));
	// 		});
	// 	});
	});

	// describe('PATCH /leave:games', () => {
	// 	it('should update and remove a player in a game', (done) => {
	// 		request(app)
	// 		.patch('/leave:games')
	// 		.send({
	// 			gid: 12345,
	// 			uid: 'Jeff'
	// 		})
	// 		.expect(200)
	// 		.expect((res) => {
	// 			expect(res.body.game.players).toEqual(['Jan'])
	// 		})
	// 		.end((err, res) => {
	// 			if(err){
	// 				return done(err);
	// 			}
	//
	// 			Game.find({}).then((games) => {
	// 				expect(games.length).toBe(3);
	// 				done();
	// 			}).catch((e) => done(e));
	// 		});
	// 	})
	//
	// 	it('should remove the game when last player is removed', (done) => {
	// 		request(app)
	// 		.patch('/leave:games')
	// 		.send({
	// 			gid: 12349,
	// 			uid: 'Alex'
	// 		})
	// 		.expect(200)
	// 		.end((err, res) => {
	// 			if(err){
	// 				return done(err);
	// 			}
	//
	// 			Game.find({}).then((games) => {
	// 				expect(games.length).toBe(2);
	// 				done();
	// 			}).catch((e) => done(e));
	// 		});
	// 	})
	//
	// 	it('should return normally but not remove anything if player leaving is not a game player', (done) => {
	// 		request(app)
	// 		.patch('/leave:games')
	// 		.send({
	// 			gid: 12349,
	// 			uid: 'Jordan'
	// 		})
	// 		.expect(200)
	// 		.end((err, res) => {
	// 			if(err){
	// 				return done(err);
	// 			}
	//
	// 			Game.find({}).then((games) => {
	// 				expect(games.length).toBe(3);
	// 				done();
	// 			}).catch((e) => done(e));
	// 		});
	// 	})
	// })
	//
	// describe('PATCH /game:user', () => {
	// 	it('should add a user to a game', (done) => {
	// 		request(app)
	// 		.patch('/game:user')
	// 		.send({
	// 			gid: 12345,
	// 			uid: 'Khach'
	// 		})
	// 		.expect(200)
	// 		.expect((res) => {
	// 			expect(res.body.game.players).toEqual(['Jan', 'Jeff', 'Khach'])
	// 		})
	// 		.end((err, res) => {
	// 			if(err){
	// 				return done(err);
	// 			}
	//
	// 			Game.find().then((games) => {
	// 				expect(games.length).toBe(3);
	// 				done();
	// 			}).catch((e) => done(e));
	// 		});
	// 	});
	// 	it('should not add a redundant user to a game', (done) => {
	// 		request(app)
	// 		.patch('/game:user')
	// 		.send({
	// 			gid: 12345,
	// 			uid: 'Jeff'
	// 		})
	// 		.expect(200)
	// 		.end((err, res) => {
	// 			if(err){
	// 				return done(err);
	// 			}
	//
	// 			Game.find().then((games) => {
	// 				expect(games.length).toBe(3);
	// 				expect(JSON.stringify(games[0].players)).toEqual(JSON.stringify(['Jan', 'Jeff']));
	// 				done();
	// 			}).catch((e) => done(e));
	// 		});
	// 	});
	// })
	//
	// describe('DELETE /games', () => {
	// 	it('should remove a game', (done) => {
	// 		request(app)
	// 		.delete('/games')
	// 		.send({gid: 12345})
	// 		.expect(200)
	// 		.end((err, res) => {
	// 			if(err){
	// 				return done(err);
	// 			}
	//
	// 			Game.find().then((games) => {
	// 				expect(games.length).toBe(2);
	// 				done();
	// 			}).catch((e) => done(e));
	// 		});
	// 	});
	// })
})
