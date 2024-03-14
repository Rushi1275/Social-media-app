const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 3000;

const sequelize = new Sequelize('social', 'root', 'Rushi@0717', {
  host: 'localhost',
  dialect: 'mysql',
});


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
// Function to get posts with comments
async function getPostsAndComments() {
  try {
    const posts = await Post.findAll({ include: Comment });
    return posts;
  } catch (error) {
    console.error(error);
    throw new Error('Error retrieving posts and comments');
  }
}

// Route handler for getting posts with comments
app.get('/posts', async (req, res) => {
  try {
    const posts = await getPostsAndComments();
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving posts and comments');
  }
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
