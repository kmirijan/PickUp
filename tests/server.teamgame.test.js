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

			spectId = new ObjectID();
			var teamGameData= {
				sport: 'sport',
				location: 'location',
				name: 'team game name',
				user: 'user',
				isprivate: false,
				gameId: 517381293891,
				teamId: spectId
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

		it('should not create a game with invalid body data', (done) => {
			request(app)
			.post('/postTeamGame')
			.send({sport: 'sport'})
			.expect(400)
			.end((err, res) => {
				if(err){
					return done(err);
				}

				TeamGame.find().then((teamGames) => {
					expect(teamGames.length).toBe(1);
					done();
				}).catch((e) => done(e));
			});
		});

		it('should not create game with no body data', (done) => {
			request(app)
			.post('/postTeamGame')
			.send({})
			.expect(400)
			.end((err, res) => {
				if(err){
					return done(err);
				}

				TeamGame.find().then((teamGames) => {
					expect(teamGames.length).toBe(1);
					done();
				}).catch((e) => done(e));
			});
		});
	});
	describe('PATCH /addTeamtoTG', () => {
		it('should add a team to a team game', (done) => {
			request(app)
			.patch('/addTeamtoTG')
			.send({
				tgid: 12345,
				tid: '345'
			})
			.expect(200)
			.expect((res) => {
				expect(res.body.teamgame.teams).toEqual(['44444', '44445', '345']);
			})
			.end((err, res) => {
				if(err){
					return done(err);
				}

				TeamGame.find({}).then((teamGames) => {
					expect(teamGames.length).toBe(1);
					done();
				}).catch((e) => done(e));
			});
		});
	})
})
