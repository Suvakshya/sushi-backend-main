// routes/logoLinkRoutes.js
import express from 'express';
import {
  createOrUpdateLogoLink,
  getLogoLink,
  deleteLogo,
  deleteSocialLinks
} from '../controllers/logoLinkController.js';
import { singleUpload } from '../middleware/multer.js';

const router = express.Router();

// Create or update logo and links
router.post('/logo-link', singleUpload('logo'), createOrUpdateLogoLink);

// Get logo and links
router.get('/logo-link', getLogoLink);

// Delete logo only
router.delete('/logo-link/logo', deleteLogo);

// Delete specific social link
router.delete('/logo-link/social/:platform', deleteSocialLinks);

export default router;