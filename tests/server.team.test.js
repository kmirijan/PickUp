const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server.js');
const {Team} = require('./../db/team.js');

const teams = [{
	_id: new ObjectID(),
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
	describe('POST /createTeam', () => {
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
	});
})
