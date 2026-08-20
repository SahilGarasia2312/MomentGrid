'use strict';

const { Router } = require('express');
const MarketplaceController = require('../controllers/MarketplaceController');
const { generalLimiter } = require('../middleware/rateLimiter');

const router = Router();

// All marketplace routes are PUBLIC — no authenticate middleware.
// Rate-limited to prevent scraping abuse.
router.use(generalLimiter);

// ── Studio Discovery ────────────────────────────────────────────────────────
/** GET /v1/marketplace/studios?query=&location=&specialization=&minRating=&sortBy=&page=&limit= */
router.get('/studios', MarketplaceController.searchStudios);

/** GET /v1/marketplace/studios/:slug — full studio public profile */
router.get('/studios/:slug', MarketplaceController.getStudioBySlug);

// ── Photographer Discovery ──────────────────────────────────────────────────
/** GET /v1/marketplace/photographers?query=&specialization=&minExperience=&minRating=&sortBy=&page=&limit= */
router.get('/photographers', MarketplaceController.searchPhotographers);

/** GET /v1/marketplace/photographers/:id — full photographer public profile */
router.get('/photographers/:id', MarketplaceController.getPhotographerById);

// ── MomentMatch AI-Free Recommendations ─────────────────────────────────────
/** POST /v1/marketplace/momentmatch */
router.post('/momentmatch', MarketplaceController.momentMatch);

module.exports = router;
