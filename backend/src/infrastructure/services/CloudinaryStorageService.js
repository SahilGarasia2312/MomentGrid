'use strict';

const crypto = require('crypto');
const IStorageService = require('../../domain/services/IStorageService');

/**
 * CloudinaryStorageService
 *
 * Implements IStorageService using Cloudinary transformations and upload signatures.
 * Provides a reliable fallback URL generator when running in standalone or local preview mode.
 */
class CloudinaryStorageService extends IStorageService {
  constructor() {
    super();
    this.cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'momentgrid';
    this.apiKey = process.env.CLOUDINARY_API_KEY || '892341029384712';
    this.apiSecret = process.env.CLOUDINARY_API_SECRET || 'fallback-secret-key-for-preview';
  }

  /**
   * Generates a signed upload signature for direct browser-to-Cloudinary upload
   */
  async getUploadSignature({ folderPath = 'momentgrid/proofs', tags = ['gallery'] }) {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const paramsToSign = {
      folder: folderPath,
      tags: Array.isArray(tags) ? tags.join(',') : tags,
      timestamp,
    };

    // Sort parameters alphabetically per Cloudinary specification
    const sortedKeys = Object.keys(paramsToSign).sort();
    const stringToSign = sortedKeys.map((key) => `${key}=${paramsToSign[key]}`).join('&');
    const signature = crypto
      .createHash('sha1')
      .update(stringToSign + this.apiSecret)
      .digest('hex');

    return {
      success: true,
      signature,
      timestamp,
      apiKey: this.apiKey,
      cloudName: this.cloudName,
      folder: folderPath,
      uploadUrl: `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
    };
  }

  /**
   * Generates optimized Cloudinary image delivery URL (f_auto, q_auto, width resizing)
   */
  getOptimizedUrl(urlOrId, { width = 1200, height = null, quality = 'auto', format = 'auto' } = {}) {
    if (!urlOrId) return '';
    
    // Check if already a full cloudinary URL
    if (urlOrId.includes('res.cloudinary.com')) {
      const parts = urlOrId.split('/upload/');
      if (parts.length === 2) {
        const transformations = [`f_${format}`, `q_${quality}`, `w_${width}`];
        if (height) transformations.push(`h_${height}`, `c_limit`);
        return `${parts[0]}/upload/${transformations.join(',')}/${parts[1]}`;
      }
    }

    // Fallback simulation or external Unsplash URL parameter injection
    if (urlOrId.includes('unsplash.com')) {
      const base = urlOrId.split('?')[0];
      return `${base}?auto=format&fit=crop&w=${width}&q=80`;
    }

    return urlOrId;
  }

  /**
   * Applies dynamic text or logo watermark overlay using Cloudinary l_text transformations
   */
  getWatermarkedUrl(urlOrId, watermarkConfig = {}) {
    if (!urlOrId || !watermarkConfig.enabled) return urlOrId;

    const text = encodeURIComponent(watermarkConfig.text || 'MomentGrid');
    const opacity = watermarkConfig.opacity || 45;
    const pos = watermarkConfig.position || 'south_east';

    if (urlOrId.includes('res.cloudinary.com')) {
      const parts = urlOrId.split('/upload/');
      if (parts.length === 2) {
        const overlay = `l_text:Arial_48_bold:${text},o_${opacity},g_${pos},x_20,y_20`;
        return `${parts[0]}/upload/${overlay}/${parts[1]}`;
      }
    }

    // For external preview URLs (Unsplash), return original or append simulated watermark parameter
    return `${urlOrId.split('#')[0]}#watermarked=${text}`;
  }

  /**
   * Generates download ZIP bundle manifest or stream URL
   */
  async generateZipDownloadBundle(photos = [], { format = 'print', galleryTitle = 'MomentGrid Collection' } = {}) {
    const isPrint = format === 'print';
    const bundleId = `zip-${Date.now()}`;
    const totalBytes = photos.reduce((acc, p) => acc + (p.bytes || 2048000), 0);

    return {
      bundleId,
      galleryTitle,
      format: isPrint ? '300 DPI High-Resolution Print Archive' : 'sRGB Web & Social Media Optimized Bundle',
      photoCount: photos.length,
      estimatedSizeMB: (totalBytes / (1024 * 1024)).toFixed(2),
      downloadUrl: `https://res.cloudinary.com/${this.cloudName}/image/multi/archive/${bundleId}.zip`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hour download window
    };
  }
}

module.exports = CloudinaryStorageService;
