'use strict';

const AppError = require('../../errors/AppError');

class UpdateStudioProfileUseCase {
  constructor(studioRepository) {
    this.studioRepository = studioRepository;
  }

  async execute({ studioId, name, slug, logoUrl, brandColor, contactEmail, phone, about, socialLinks }) {
    const studio = await this.studioRepository.findById(studioId);
    if (!studio) {
      throw new AppError('Studio profile not found.', 404, 'STUDIO_NOT_FOUND');
    }

    if (slug && slug !== studio.slug) {
      const existingSlug = await this.studioRepository.findBySlug(slug);
      if (existingSlug && existingSlug.id !== studio.id) {
        throw new AppError('That studio custom slug is already taken.', 409, 'DUPLICATE_SLUG');
      }
      studio.slug = slug;
    }

    if (name !== undefined) studio.name = name;
    if (logoUrl !== undefined) studio.logoUrl = logoUrl;
    if (brandColor !== undefined) studio.brandColor = brandColor;
    if (contactEmail !== undefined) studio.contactEmail = contactEmail;
    if (phone !== undefined) studio.phone = phone;
    if (about !== undefined) studio.about = about;
    if (socialLinks !== undefined) {
      studio.socialLinks = {
        ...studio.socialLinks,
        ...socialLinks,
      };
    }

    const updated = await this.studioRepository.update(studio);
    return updated.toPublic();
  }
}

module.exports = UpdateStudioProfileUseCase;
