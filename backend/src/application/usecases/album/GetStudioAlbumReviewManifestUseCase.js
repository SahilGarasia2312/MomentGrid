'use strict';

const AppError = require('../../errors/AppError');

/**
 * GetStudioAlbumReviewManifestUseCase — Application Use Case
 *
 * Retrieves the complete production manifest of an approved (`submitted` or later) album selection
 * along with enriched photo objects, spread layout sequence, cover specifications, and client instructions.
 */
class GetStudioAlbumReviewManifestUseCase {
  constructor({ albumRepository, galleryRepository }) {
    this.albumRepository = albumRepository;
    this.galleryRepository = galleryRepository;
  }

  async execute({ albumId, studioId }) {
    const album = await this.albumRepository.findById(albumId);
    if (!album) {
      throw new AppError('Album selection session not found.', 404, 'ALBUM_NOT_FOUND');
    }

    // Verify studio authorization if studioId provided
    if (studioId && album.studioId && album.studioId !== studioId) {
      throw new AppError('Unauthorized access: Studio ID does not match album studio ownership.', 403, 'FORBIDDEN_STUDIO_ACCESS');
    }

    let photoMap = new Map();
    if (album.galleryId && this.galleryRepository) {
      const gallery = await this.galleryRepository.findById(album.galleryId);
      if (gallery && Array.isArray(gallery.photos)) {
        gallery.photos.forEach((p) => {
          photoMap.set(p.id, p);
        });
      }
    }

    // Enrich ordered sequence with photo metadata and attached client comments
    const enrichedSpreads = (album.orderedPhotoIds || []).map((photoId, idx) => {
      const photo = photoMap.get(photoId) || {
        id: photoId,
        url: `https://res.cloudinary.com/momentgrid/image/upload/v1718000000/momentgrid/proofs/${photoId}.jpg`,
        caption: `Selected Proof #${photoId}`,
        category: 'wedding',
      };

      const comments = (album.photoComments || []).filter((c) => c.photoId === photoId);

      return {
        sequenceNumber: idx + 1,
        spreadPageEstimate: Math.floor(idx / 2) + 1, // 2 photos per spread average
        photo,
        comments,
      };
    });

    const coverPhoto = album.coverSpecs?.photoId ? (photoMap.get(album.coverSpecs.photoId) || null) : (enrichedSpreads[0]?.photo || null);

    return {
      albumId: album.id,
      title: album.title,
      clientEmail: album.clientEmail,
      clientName: album.clientName,
      status: album.status,
      submittedAt: album.updatedAt,
      specifications: {
        albumSize: album.albumSize,
        pageCount: album.pageCount,
        coverMaterial: album.coverSpecs?.material || album.coverMaterial,
        coverColor: album.coverSpecs?.color || 'Obsidian Black',
        embossText: album.coverSpecs?.embossText || album.title,
        coverPhoto,
        clientNotes: album.clientNotes,
      },
      statistics: {
        totalPhotosFavorited: album.favoritedPhotoIds.length,
        totalPhotosRejected: album.rejectedPhotoIds.length,
        totalSpreadsConfigured: Math.ceil(enrichedSpreads.length / 2),
        totalCommentsAttached: album.photoComments.length,
      },
      spreads: enrichedSpreads,
      rejectedPhotoIds: album.rejectedPhotoIds,
    };
  }
}

module.exports = GetStudioAlbumReviewManifestUseCase;
