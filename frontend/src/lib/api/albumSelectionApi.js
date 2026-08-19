'use strict';

import { httpClient } from '../utils/httpClient';

// Fallback sample state for offline or demonstration preview
const fallbackAlbumState = {
  id: 'album-heirloom-2026',
  clientEmail: 'elena.rossi@momentgrid.com',
  clientName: 'Elena & Marcus Rossi',
  galleryId: 'gal-momentgrid-heirloom-2026',
  studioId: 'studio-momentgrid-collective',
  title: 'Elena & Marcus — Villa d’Este Destination Wedding Album',
  status: 'selecting',
  albumSize: '12x12 Master Luxe',
  pageCount: 40,
  coverMaterial: 'Italian Leather - Obsidian Black',
  coverSpecs: {
    photoId: 'photo-104',
    material: 'Italian Leather',
    color: 'Obsidian Black',
    embossText: 'Elena & Marcus — Villa d’Este 2026',
  },
  clientNotes: 'Please apply warm cinematic film grading across all lakeside ceremony spreads.',
  favoritedPhotoIds: ['photo-101', 'photo-103', 'photo-104', 'photo-105', 'photo-107', 'photo-108', 'photo-109', 'photo-112', 'photo-114', 'photo-116'],
  rejectedPhotoIds: ['photo-102', 'photo-106'],
  orderedPhotoIds: ['photo-104', 'photo-101', 'photo-105', 'photo-107', 'photo-108', 'photo-109', 'photo-112', 'photo-114', 'photo-116'],
  photoComments: [
    {
      photoId: 'photo-101',
      comment: 'Can we soften the highlights on the marble column right behind the veil?',
      clientName: 'Elena Rossi',
      createdAt: '2026-06-16T14:20:00Z',
    },
    {
      photoId: 'photo-107',
      comment: 'Our absolute favorite! Please give this shot a full double-page panoramic spread.',
      clientName: 'Marcus Rossi',
      createdAt: '2026-06-16T15:10:00Z',
    },
    {
      photoId: 'photo-116',
      comment: 'Please remove any background distracting exit signs from the upper right archway.',
      clientName: 'Elena Rossi',
      createdAt: '2026-06-16T16:00:00Z',
    },
  ],
  availablePhotos: [
    {
      id: 'photo-101',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      caption: 'Elena bridal veil portrait by the Italian courtyard columns',
      category: 'editorial',
    },
    {
      id: 'photo-102',
      url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80',
      caption: 'Bridal suite silk gown and Cartier wedding rings detail',
      category: 'details',
    },
    {
      id: 'photo-103',
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
      caption: 'Marcus finishing cufflinks before the garden first look',
      category: 'portrait',
    },
    {
      id: 'photo-104',
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
      caption: 'First look moment under the historic cypress archway',
      category: 'wedding',
    },
    {
      id: 'photo-105',
      url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80',
      caption: 'Bride walking down the cliffside aisle overlooking Lake Como',
      category: 'wedding',
    },
    {
      id: 'photo-106',
      url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
      caption: 'Exchanging golden wedding vows with emotional guests in background',
      category: 'wedding',
    },
    {
      id: 'photo-107',
      url: 'https://images.unsplash.com/photo-1519225336804-90ff39a311b1?auto=format&fit=crop&w=1200&q=80',
      caption: 'The ring exchange — high-contrast black and white editorial crop',
      category: 'black-and-white',
    },
    {
      id: 'photo-108',
      url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
      caption: 'The newlywed kiss and rose petal recessional walk',
      category: 'wedding',
    },
    {
      id: 'photo-109',
      url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80',
      caption: 'Bride & Groom golden hour silhouette along the villa marble terrace',
      category: 'editorial',
    },
    {
      id: 'photo-110',
      url: 'https://images.unsplash.com/photo-1545232972-9bb88a5b6d15?auto=format&fit=crop&w=1200&q=80',
      caption: 'Sunset champagne toast with the alpine mountains right across the bay',
      category: 'editorial',
    },
    {
      id: 'photo-111',
      url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
      caption: 'Grand ballroom reception tablesetting with crystal chandeliers and white florals',
      category: 'details',
    },
    {
      id: 'photo-112',
      url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80',
      caption: 'The grand entrance under indoor sparklers and roaring cheers',
      category: 'wedding',
    },
    {
      id: 'photo-113',
      url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
      caption: 'Emotional father of the bride dinner speech and champagne clinks',
      category: 'portrait',
    },
    {
      id: 'photo-114',
      url: 'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=1200&q=80',
      caption: 'First dance under the spotlight surrounded by soft mist and jazz orchestra',
      category: 'editorial',
    },
    {
      id: 'photo-115',
      url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
      caption: 'Live brass band and late-night dance floor celebration energy',
      category: 'wedding',
    },
    {
      id: 'photo-116',
      url: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=1200&q=80',
      caption: 'Nighttime sparkler exit by the lakeside vintage Alfa Romeo convertible',
      category: 'editorial',
    },
  ],
};

export const albumSelectionApi = {
  /**
   * Initialize or fetch client album draft session
   */
  async getOrStartDraft({ galleryId, clientEmail, clientName, title, initialPhotoIds } = {}) {
    try {
      const res = await httpClient('/albums/draft', {
        method: 'POST',
        body: JSON.stringify({ galleryId, clientEmail, clientName, title, initialPhotoIds }),
      });
      if (res?.data) return res;
    } catch (e) {
      // Fallback
    }
    return {
      data: { ...fallbackAlbumState },
    };
  },

  /**
   * Update selection status (`toggle_favorite`, `toggle_reject`, `set_order`)
   */
  async updateSelection({ albumId, action, photoId, orderedPhotoIds }) {
    try {
      const res = await httpClient(`/albums/${albumId}/selection`, {
        method: 'PATCH',
        body: JSON.stringify({ action, photoId, orderedPhotoIds }),
      });
      if (res?.data) return res;
    } catch (e) {
      // Fallback state update
    }
    if (action === 'toggle_favorite') {
      const isFav = fallbackAlbumState.favoritedPhotoIds.includes(photoId);
      if (isFav) {
        fallbackAlbumState.favoritedPhotoIds = fallbackAlbumState.favoritedPhotoIds.filter((id) => id !== photoId);
        fallbackAlbumState.orderedPhotoIds = fallbackAlbumState.orderedPhotoIds.filter((id) => id !== photoId);
      } else {
        fallbackAlbumState.favoritedPhotoIds.push(photoId);
        fallbackAlbumState.rejectedPhotoIds = fallbackAlbumState.rejectedPhotoIds.filter((id) => id !== photoId);
        if (!fallbackAlbumState.orderedPhotoIds.includes(photoId)) {
          fallbackAlbumState.orderedPhotoIds.push(photoId);
        }
      }
    } else if (action === 'toggle_reject') {
      const isRej = fallbackAlbumState.rejectedPhotoIds.includes(photoId);
      if (isRej) {
        fallbackAlbumState.rejectedPhotoIds = fallbackAlbumState.rejectedPhotoIds.filter((id) => id !== photoId);
      } else {
        fallbackAlbumState.rejectedPhotoIds.push(photoId);
        fallbackAlbumState.favoritedPhotoIds = fallbackAlbumState.favoritedPhotoIds.filter((id) => id !== photoId);
        fallbackAlbumState.orderedPhotoIds = fallbackAlbumState.orderedPhotoIds.filter((id) => id !== photoId);
      }
    } else if (action === 'set_order') {
      fallbackAlbumState.orderedPhotoIds = [...orderedPhotoIds];
    }
    return {
      success: true,
      data: { ...fallbackAlbumState },
    };
  },

  /**
   * Attach or update retouching/layout comment on a photo
   */
  async addOrUpdateComment({ albumId, photoId, comment, clientName = 'Client' }) {
    try {
      const res = await httpClient(`/albums/${albumId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ photoId, comment, clientName }),
      });
      if (res?.data) return res;
    } catch (e) {
      // Fallback
    }
    const idx = fallbackAlbumState.photoComments.findIndex((c) => c.photoId === photoId);
    if (!comment || !comment.trim()) {
      if (idx > -1) fallbackAlbumState.photoComments.splice(idx, 1);
    } else {
      const obj = { photoId, comment: comment.trim(), clientName, createdAt: new Date().toISOString() };
      if (idx > -1) fallbackAlbumState.photoComments[idx] = obj;
      else fallbackAlbumState.photoComments.push(obj);
    }
    return {
      success: true,
      data: { ...fallbackAlbumState },
    };
  },

  /**
   * Configure cover and sizing specifications
   */
  async configureCoverAndSize({ albumId, coverSpecs, albumSize, pageCount, clientNotes }) {
    try {
      const res = await httpClient(`/albums/${albumId}/cover-and-size`, {
        method: 'PATCH',
        body: JSON.stringify({ coverSpecs, albumSize, pageCount, clientNotes }),
      });
      if (res?.data) return res;
    } catch (e) {
      // Fallback
    }
    if (coverSpecs) fallbackAlbumState.coverSpecs = { ...fallbackAlbumState.coverSpecs, ...coverSpecs };
    if (albumSize) fallbackAlbumState.albumSize = albumSize;
    if (pageCount) fallbackAlbumState.pageCount = Number(pageCount);
    if (clientNotes !== undefined) fallbackAlbumState.clientNotes = clientNotes;
    return {
      success: true,
      data: { ...fallbackAlbumState },
    };
  },

  /**
   * Submit final album selection to studio
   */
  async submitAlbum({ albumId }) {
    try {
      const res = await httpClient(`/albums/${albumId}/submit`, {
        method: 'POST',
      });
      if (res?.data) return res;
    } catch (e) {
      // Fallback
    }
    fallbackAlbumState.status = 'submitted';
    return {
      success: true,
      data: { ...fallbackAlbumState },
    };
  },

  /**
   * Get approved production manifest for studio review
   */
  async getStudioManifest({ albumId }) {
    try {
      const res = await httpClient(`/albums/${albumId}/studio-review`, {
        method: 'GET',
      });
      if (res?.data) return res;
    } catch (e) {
      // Fallback
    }
    const photoMap = new Map();
    fallbackAlbumState.availablePhotos.forEach((p) => photoMap.set(p.id, p));

    const spreads = fallbackAlbumState.orderedPhotoIds.map((pId, i) => {
      const photo = photoMap.get(pId) || { id: pId, url: '', caption: `Proof #${pId}` };
      const comments = fallbackAlbumState.photoComments.filter((c) => c.photoId === pId);
      return {
        sequenceNumber: i + 1,
        spreadPageEstimate: Math.floor(i / 2) + 1,
        photo,
        comments,
      };
    });

    const coverPhoto = fallbackAlbumState.coverSpecs?.photoId
      ? photoMap.get(fallbackAlbumState.coverSpecs.photoId) || spreads[0]?.photo
      : spreads[0]?.photo;

    return {
      success: true,
      data: {
        albumId: fallbackAlbumState.id,
        title: fallbackAlbumState.title,
        clientEmail: fallbackAlbumState.clientEmail,
        clientName: fallbackAlbumState.clientName,
        status: fallbackAlbumState.status,
        submittedAt: new Date().toISOString(),
        specifications: {
          albumSize: fallbackAlbumState.albumSize,
          pageCount: fallbackAlbumState.pageCount,
          coverMaterial: fallbackAlbumState.coverSpecs?.material || fallbackAlbumState.coverMaterial,
          coverColor: fallbackAlbumState.coverSpecs?.color || 'Obsidian Black',
          embossText: fallbackAlbumState.coverSpecs?.embossText || fallbackAlbumState.title,
          coverPhoto,
          clientNotes: fallbackAlbumState.clientNotes,
        },
        statistics: {
          totalPhotosFavorited: fallbackAlbumState.favoritedPhotoIds.length,
          totalPhotosRejected: fallbackAlbumState.rejectedPhotoIds.length,
          totalSpreadsConfigured: Math.ceil(spreads.length / 2),
          totalCommentsAttached: fallbackAlbumState.photoComments.length,
        },
        spreads,
        rejectedPhotoIds: fallbackAlbumState.rejectedPhotoIds,
      },
    };
  },
};
