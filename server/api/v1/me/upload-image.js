const Router = require('../../../lib/router');
const multer = require('multer');
const authMiddleware = require('../../../middlewares/auth');
const userService = require('../../../lib/user');
const Image = require('../../../lib/cloudinary');

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();


router.post('/', authMiddleware.permissionsMiddleWare, upload.single('avatar'), async (req, res) => {
  let result = {};
  const { userId } = req;

  try {
    const user = await userService.find(userId);
    if (!user.id) {
      throw new Error('could not find user');
    }

    const uploadResult = await Image.upload(req.file.buffer);
    if (!uploadResult.secure_url) {
      throw new Error('could not upload image');
    }

    user.avatar = uploadResult.secure_url;
    await user.save();

    result = {
      status: 'ok',
      url: uploadResult.secure_url,
    };
  } catch (e) {
    result = {
      status: 'error',
      msg: e,
    };
  }

  res.json(result);
});

module.exports = router;
