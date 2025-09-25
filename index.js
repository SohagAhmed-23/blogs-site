const express = require('express');
const app = express();
const path = require('path');
const userRoute = require('./router/user');
const mongoose = require('mongoose');
const cookie = require('cookie-parser');
const { checkAuthentication } = require('./middleware/checkvalidation');
const blogsRouter = require('./router/blogs');
const PORT = process.env.PORT || 3001;
const Blog = require('./models/blogs')


mongoose.connect('mongodb://127.0.0.1:27017/Blogs', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error(" MongoDB Connection Error:", err));


app.set("view engine","ejs");
app.set("views", path.resolve('./views'));

app.use(express.urlencoded({ extended: false }));
app.use('/images', express.static(path.resolve('public/images')));

app.use(cookie());
app.use(checkAuthentication("token"));

app.get('/', async(req, res) => {
  const allblogs = await Blog.find({});
  console.log(allblogs);
  res.render("Home" ,{ user:req.user, blogs: allblogs});
});

app.use('/blogs', blogsRouter);

app.use('/user', userRoute);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
