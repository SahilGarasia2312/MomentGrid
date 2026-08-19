'use strict';

/**
 * IClientRepository — Abstract Repository Interface
 *
 * Contract for querying and mutating client portal domain entities across bookings, invoices, galleries, and print albums.
 */
class IClientRepository {
  // ── Bookings (Events) ───────────────────────────────────────────────────
  // eslint-disable-next-line no-unused-vars
  async findBookingsByClientEmail(clientEmail) {
    throw new Error('IClientRepository.findBookingsByClientEmail() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async createBooking(eventDomain) {
    throw new Error('IClientRepository.createBooking() must be implemented.');
  }

  // ── Payments (Invoices) ─────────────────────────────────────────────────
  // eslint-disable-next-line no-unused-vars
  async findPaymentsByClientEmail(clientEmail) {
    throw new Error('IClientRepository.findPaymentsByClientEmail() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async findPaymentById(paymentId) {
    throw new Error('IClientRepository.findPaymentById() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async savePayment(paymentDomain) {
    throw new Error('IClientRepository.savePayment() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async updatePayment(paymentDomain) {
    throw new Error('IClientRepository.updatePayment() must be implemented.');
  }

  // ── Galleries (Proofs & Downloads) ──────────────────────────────────────
  // eslint-disable-next-line no-unused-vars
  async findGalleriesByClientEmail(clientEmail) {
    throw new Error('IClientRepository.findGalleriesByClientEmail() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async findGalleryById(galleryId) {
    throw new Error('IClientRepository.findGalleryById() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async updateGallery(galleryDomain) {
    throw new Error('IClientRepository.updateGallery() must be implemented.');
  }

  // ── Albums (Print Selections) ───────────────────────────────────────────
  // eslint-disable-next-line no-unused-vars
  async findAlbumsByClientEmail(clientEmail) {
    throw new Error('IClientRepository.findAlbumsByClientEmail() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async findAlbumById(albumId) {
    throw new Error('IClientRepository.findAlbumById() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async saveAlbum(albumDomain) {
    throw new Error('IClientRepository.saveAlbum() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async updateAlbum(albumDomain) {
    throw new Error('IClientRepository.updateAlbum() must be implemented.');
  }
}

module.exports = IClientRepository;
