// app.js

const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Sequelize database connection
const sequelize = new Sequelize('social', 'root', 'Rushi@0717', {
  host: 'localhost',
  dialect: 'mysql',
});

// Define Post model
const Post = sequelize.define('Post', {
  photoLink: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Define Comment model
const Comment = sequelize.define('Comment', {
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  comment: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Define relationships between models
Post.hasMany(Comment, { foreignKey: 'postId' });
Comment.belongsTo(Post, { foreignKey: 'postId' });

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get('/posts', async (req, res) => {
  const posts = await Post.findAll({ include: Comment });
  res.json(posts);
});

app.post('/post', async (req, res) => {
  const { photoLink, description } = req.body;
  try {
    const newPost = await Post.create({ photoLink, description });
    res.json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating post');
  }
});

app.post('/post/:postId/comments', async (req, res) => {
  const { postId } = req.params;
  const { comment } = req.body;
  try {
    const newComment = await Comment.create({ postId, comment });
    res.json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding comment');
  }
});

// Start server
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
