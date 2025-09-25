const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const Blog = require('../models/blogs')

const blogsRouter = Router();

// Multer storage config (saves to /public/images)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // const user = req.user;
    cb(null, path.resolve('public/images'));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });


blogsRouter.get('/create-blogs', (req, res) => {
  
  
  res.render('blogs-form',{user:req.user}); 
});



blogsRouter.post('/upload', upload.single('cover'), async(req, res) => {
  try {
    const { title, content } = req.body;
    const coverImage = req.file ? `/images/${req.file.filename}` : null;
    const user = req.user; 

    const result = await Blog.create({
      title,
      content,
      coverImage: coverImage,
      authorName: user.fullname 
    });
    res.redirect('/'); 
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).send("Something went wrong!");
  }
});

blogsRouter.post("/comment/:id", async (req, res) => {
  try {
    const { newcomment } = req.body;
    const blogId = req.params.id;
    const user = req.user ? req.user.fullname : "Anonymous";

    await Blog.findByIdAndUpdate(blogId, {
      $push: { comment: { name: user, text: newcomment } }
    });

    res.redirect(`/blogs/${blogId}`); 
  } catch (err) {
    console.error("Error saving comment:", err);
    res.status(500).send("Something went wrong!");
  }
});



blogsRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

   
    const blog = await Blog.findById(id);
    

    if (!blog) {
      return res.status(404).send('Blog not found');
    }
    
    res.render('show-blogs',{blog:blog,user:req.user}); 
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


module.exports = blogsRouter;
