'use strict';

const AppError = require('../../errors/AppError');

/**
 * SearchAndFilterPhotosUseCase — Application Use Case
 *
 * Implements high-performance photo query processing:
 * - Search by caption or filename match
 * - Filter by category, folderId, and favorite status
 * - Paginate results for progressive lazy loading (page & limit)
 */
class SearchAndFilterPhotosUseCase {
  constructor({ galleryRepository }) {
    this.galleryRepository = galleryRepository;
  }

  async execute({
    galleryId,
    searchQuery = '',
    category = 'all',
    folderId = 'all',
    favoritesOnly = false,
    page = 1,
    limit = 24,
  }) {
    const gallery = await this.galleryRepository.findById(galleryId);
    if (!gallery) {
      throw new AppError('Gallery not found.', 404, 'GALLERY_NOT_FOUND');
    }

    let filtered = [...gallery.photos];

    // Filter by folderId if specified and not 'all' or 'root' (unless root specifically requested)
    if (folderId && folderId !== 'all') {
      if (folderId === 'root') {
        // 'root' in query means show all photos regardless of sub-folder or only root
        // If user wants only unassigned/root photos vs all, let's allow 'unassigned' vs 'root'
        // Standard convention: if folderId is specific e.g. 'ceremony', filter by it
      } else {
        filtered = filtered.filter((p) => p.folderId === folderId);
      }
    }

    // Filter by category
    if (category && category !== 'all') {
      const normalizedCat = category.toLowerCase().trim();
      filtered = filtered.filter((p) => (p.category || '').toLowerCase() === normalizedCat);
    }

    // Filter by favorites
    if (favoritesOnly === true || favoritesOnly === 'true') {
      filtered = filtered.filter((p) => p.isFavorite === true);
    }

    // Search query across caption or id/url substring
    if (searchQuery && searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          (p.caption && p.caption.toLowerCase().includes(q)) ||
          (p.url && p.url.toLowerCase().includes(q)) ||
          (p.id && p.id.toLowerCase().includes(q))
      );
    }

    // Pagination calculations
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 24));
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / limitNum) || 1;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedPhotos = filtered.slice(startIndex, startIndex + limitNum);

    return {
      success: true,
      galleryId: gallery.id,
      galleryTitle: gallery.title,
      coverUrl: gallery.coverUrl,
      folders: gallery.folders,
      categories: gallery.categories,
      watermarkConfig: gallery.watermarkConfig,
      sharingConfig: gallery.sharingConfig,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalItems,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
      photos: paginatedPhotos,
    };
  }
}

module.exports = SearchAndFilterPhotosUseCase;
