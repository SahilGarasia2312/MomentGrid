'use strict';

/**
 * IPaymentRepository — Abstract Repository Interface for Payment & Invoice persistence
 */
class IPaymentRepository {
  // eslint-disable-next-line no-unused-vars
  async findById(id) {
    throw new Error('IPaymentRepository.findById() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async findByInvoiceNumber(invoiceNumber) {
    throw new Error('IPaymentRepository.findByInvoiceNumber() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async findByClientEmail(email) {
    throw new Error('IPaymentRepository.findByClientEmail() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async findByBookingId(bookingId) {
    throw new Error('IPaymentRepository.findByBookingId() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async findAll({ studioId, status, page, limit }) {
    throw new Error('IPaymentRepository.findAll() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async getAdminFinancialStats(studioId) {
    throw new Error('IPaymentRepository.getAdminFinancialStats() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async save(payment) {
    throw new Error('IPaymentRepository.save() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async update(payment) {
    throw new Error('IPaymentRepository.update() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async delete(id) {
    throw new Error('IPaymentRepository.delete() must be implemented.');
  }
}

module.exports = IPaymentRepository;
