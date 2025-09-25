const { Schema, model } = require('mongoose');  

const blogSchema = new Schema({
  title: { 
    type: String,
    required: true 
  },
  content: {
    type: String, 
    required: true 
  },
  coverImage: String,  
  authorName: { type: String, required: true },
  comment:[
     {
        name: { type: String, required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
      

  }]

}, { timestamps: true }); 

const Blog = model('Blog', blogSchema);


module.exports = Blog;
