const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadMw = multer({ dest: 'uploads/' }); // path where the files will be uploaded
const fs = require('fs');
const Post = require('../models/Post');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;

function setFilePath(originalname, path) {
  const parts = originalname.split('.');
  const ext = parts[parts.length - 1];
  const newPath = `${path}.${ext}`;
  fs.renameSync(path, newPath);

  return newPath;
}

// CREATE POST
// as the label for image file is 'file' in the payload
router.route('/create-post').post(uploadMw.single('file'), async (req, res) => {
  try {
    const { originalname, path } = req.file;
    const newPath = setFilePath(originalname, path);

    const { token } = req.cookies;

    jwt.verify(token, jwtSecret, {}, async (err, data) => {
      try {
        if (err) throw err;

        const { title, summary, content } = req.body;
        const postDoc = await Post.create({
          title,
          summary,
          content,
          cover: newPath,
          author: data.id,
        });

        res.status(201).json({ message: 'created', data: postDoc });
      } catch (err) {
        console.error(err.message);
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(404).json({ message: 'not found' });
  }
});

// GET ALL POSTS
router.route('/posts').get(async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', ['username']) // populate the author field with data from the User and select only the username
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    console.error(err.message);
  }
});

// GET SPECIFIC POST
router.route('/posts/:id').get(async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate('author', ['username']);
    res.status(200).json(post);
  } catch (err) {
    console.error(err.message);
    res.status(404).json({ message: 'failed to locate resource' });
  }
});

// UPDATE POST
router
  .route('/edit-post/:id')
  .put(uploadMw.single('file'), async (req, res) => {
    try {
      const { originalname, path } = req.file;
      console.log(req.file);
      const { title, summary, content } = req.body;
      const { id } = req.params;
      const newPath = setFilePath(originalname, path);

      let postDoc = await Post.findById(id);
      await postDoc.updateOne({ title, summary, content, cover: newPath });

      res.status(200).json({ message: 'updated', postDoc });
    } catch (err) {
      console.error(err.message);
      res.status(409).json({ message: err.message });
    }
  });

module.exports = router;
