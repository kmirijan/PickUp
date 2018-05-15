var env = process.env.NODE_ENV

if (env === 'test') {
	process.env.PORT = 8000;
	process.env.MONGODB_URI = 'mongodb://localhost:27017/PickUpTest';
} else{
  process.env.PORT = 8000;
	process.env.MONGODB_URI = 'mongodb://pickup:cs115@ds251819.mlab.com:51819/pickup';
}
