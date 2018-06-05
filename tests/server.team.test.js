const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server.js');
const {Team} = require('./../db/team.js');

const specId = new ObjectID();
const teams = [{
	_id: specId,
  sport: 'Sport',
  name: 'Jan Team',
  city: 'San Jose',
  captain : 'Jan',
  members: ['Jan', 'Jeff'],
	games: [],
	maxPlayers: 4
}];

beforeEach((done) => {
	Team.remove({}).then(() => done());
});

beforeEach((done) => {
	Team.insertMany(teams).then(() => done());
})

describe('All Team tests', () => {
	describe('POST /maketeam', () => {
		it('should create new game and add to database', (done) => {

			var teamData= {
				sport: 'sport',
				city: 'San new City',
				name: 'teamData name',
				captain: 'Khach',
				maxPlayers: 123
			}

			request(app)
			.post('/maketeam')
			.send(teamData)
			.expect(200)
			.expect((res) => {
				expect(res.body.team.sport).toBe('sport');
				expect(res.body.team.city).toBe('San new City');
				expect(res.body.team.name).toBe('teamData name');
				expect(res.body.team.captain).toBe('Khach');
				expect(res.body.team.members).toEqual(['Khach']);
				expect(res.body.team.games).toEqual([]);
				expect(res.body.team.maxPlayers).toBe(123);
			})
			.end((err, res) => {
				if(err){
					return done(err);
				}

				Team.find({}).then((games) => {
					expect(games.length).toBe(2);
					done();
				}).catch((e) => done(e));
			});
		});

		it('should not create a team with invalid body data', (done) => {
			request(app)
			.post('/maketeam')
			.send({sport: 'sport'})
			.expect(400)
			.end((err, res) => {
				if(err){
					return done(err);
				}

				Team.find().then((teams) => {
					expect(teams.length).toBe(1);
					done();
				}).catch((e) => done(e));
			});
		});

		it('should not create team with no body data', (done) => {
			request(app)
			.post('/maketeam')
			.send({})
			.expect(400)
			.end((err, res) => {
				if(err){
					return done(err);
				}

				Team.find().then((teams) => {
					expect(teams.length).toBe(1);
					done();
				}).catch((e) => done(e));
			});
		});
	});

	describe('PATCH /team:user', () => {
		it('should add a user to a team', (done) => {
			request(app)
			.patch('/team:user')
			.send({
				teamId: specId,
				user: 'Khach'
			})
			.expect(200)
			.expect((res) => {
				expect(res.body.team.members).toEqual(['Jan', 'Jeff', 'Khach'])
			})
			.end((err, res) => {
				if(err){
					return done(err);
				}

				Team.find().then((games) => {
					expect(teams.length).toBe(1);
					done();
				}).catch((e) => done(e));
			});
		});

		it('should not add a redundant user to a team', (done) => {
			request(app)
			.patch('/team:user')
			.send({
				tid: specId,
				uid: 'Jeff'
			})
			.expect(200)
			.end((err, res) => {
				if(err){
					return done(err);
				}

				Team.find().then((teams) => {
					expect(teams.length).toBe(1);
					expect(JSON.stringify(teams[0].members)).toEqual(JSON.stringify(['Jan', 'Jeff']));
					done();
				}).catch((e) => done(e));
			});
		});
	})

	describe('PATCH /remove:team', () => {
		it('should update and remove a member in a team', (done) => {
			request(app)
			.patch('/remove:team')
			.send({
				teamId: specId,
				user: 'Jeff'
			})
			.expect(200)
			.expect((res) => {
				expect(res.body.team.members).toEqual(['Jan'])
			})
			.end((err, res) => {
				if(err){
					return done(err);
				}

				Team.find({}).then((teams) => {
					expect(teams.length).toBe(1);
					done();
				}).catch((e) => done(e));
			});
		})

		it('should remove the game when the captain leaves', (done) => {
			request(app)
			.patch('/remove:team')
			.send({
				teamId: specId,
				user: 'Jan'
			})
			.expect(200)
			.end((err, res) => {
				if(err){
					return done(err);
				}

				Team.find({}).then((teams) => {
					expect(teams.length).toBe(0);
					done();
				}).catch((e) => done(e));
			});
		})

		it('should return normally but not remove anything if member leaving is not a team member', (done) => {
			request(app)
			.patch('/remove:team')
			.send({
				teamId: specId,
				user: 'Jordan'
			})
			.expect(200)
			.end((err, res) => {
				if(err){
					return done(err);
				}

				Team.find({}).then((teams) => {
					expect(teams.length).toBe(1);
					done();
				}).catch((e) => done(e));
			});
		})
	})
})
