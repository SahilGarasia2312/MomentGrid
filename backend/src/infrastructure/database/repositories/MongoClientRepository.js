'use strict';

const IClientRepository = require('../../../domain/repositories/IClientRepository');
const EventModel = require('../models/EventModel');
const PaymentModel = require('../models/PaymentModel');
const GalleryModel = require('../models/GalleryModel');
const AlbumModel = require('../models/AlbumModel');

const Event = require('../../../domain/entities/Event');
const Payment = require('../../../domain/entities/Payment');
const Gallery = require('../../../domain/entities/Gallery');
const Album = require('../../../domain/entities/Album');

class MongoClientRepository extends IClientRepository {
  _toEventDomain(doc) {
    if (!doc) return null;
    return new Event({
      id: doc._id.toString(),
      studioId: doc.studioId.toString(),
      title: doc.title,
      clientName: doc.clientName,
      clientEmail: doc.clientEmail,
      clientPhone: doc.clientPhone,
      eventDate: doc.eventDate,
      startTime: doc.startTime,
      endTime: doc.endTime,
      packageId: doc.packageId ? doc.packageId.toString() : null,
      assignedStaffIds: Array.isArray(doc.assignedStaffIds)
        ? doc.assignedStaffIds.map((s) => s.toString())
        : [],
      status: doc.status,
      price: doc.price,
      notes: doc.notes,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  _toPaymentDomain(doc) {
    if (!doc) return null;
    return new Payment({
      id: doc._id.toString(),
      clientEmail: doc.clientEmail,
      bookingId: doc.bookingId ? doc.bookingId.toString() : null,
      studioId: doc.studioId ? doc.studioId.toString() : null,
      invoiceNumber: doc.invoiceNumber,
      description: doc.description,
      amount: doc.amount,
      currency: doc.currency,
      status: doc.status,
      method: doc.method,
      dueDate: doc.dueDate,
      paidAt: doc.paidAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  _toGalleryDomain(doc) {
    if (!doc) return null;
    return new Gallery({
      id: doc._id.toString(),
      studioId: doc.studioId.toString(),
      title: doc.title,
      eventId: doc.eventId ? doc.eventId.toString() : null,
      packageId: doc.packageId ? doc.packageId.toString() : null,
      clientEmail: doc.clientEmail,
      pinCode: doc.pinCode,
      coverUrl: doc.coverUrl,
      photos: Array.isArray(doc.photos)
        ? doc.photos.map((p) => ({
            id: p.id || p._id.toString(),
            url: p.url,
            caption: p.caption,
            isFavorite: Boolean(p.isFavorite),
          }))
        : [],
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  _toAlbumDomain(doc) {
    if (!doc) return null;
    return new Album({
      id: doc._id.toString(),
      clientEmail: doc.clientEmail,
      galleryId: doc.galleryId ? doc.galleryId.toString() : null,
      studioId: doc.studioId ? doc.studioId.toString() : null,
      title: doc.title,
      selectedPhotoIds: Array.isArray(doc.selectedPhotoIds) ? doc.selectedPhotoIds : [],
      coverMaterial: doc.coverMaterial,
      pageCount: doc.pageCount,
      clientNotes: doc.clientNotes,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  // ── Bookings ─────────────────────────────────────────────────────────────
  async findBookingsByClientEmail(clientEmail) {
    const docs = await EventModel.find({ clientEmail: clientEmail.toLowerCase().trim() })
      .sort({ eventDate: 1, startTime: 1 })
      .lean();
    return docs.map((doc) => this._toEventDomain(doc));
  }

  async createBooking(eventDomain) {
    const doc = await EventModel.create({
      studioId: eventDomain.studioId,
      title: eventDomain.title,
      clientName: eventDomain.clientName,
      clientEmail: eventDomain.clientEmail,
      clientPhone: eventDomain.clientPhone,
      eventDate: eventDomain.eventDate,
      startTime: eventDomain.startTime,
      endTime: eventDomain.endTime,
      packageId: eventDomain.packageId,
      status: eventDomain.status,
      price: eventDomain.price,
      notes: eventDomain.notes,
    });
    return this._toEventDomain(doc);
  }

  // ── Payments ─────────────────────────────────────────────────────────────
  async findPaymentsByClientEmail(clientEmail) {
    const docs = await PaymentModel.find({ clientEmail: clientEmail.toLowerCase().trim() })
      .sort({ createdAt: -1 })
      .lean();
    return docs.map((doc) => this._toPaymentDomain(doc));
  }

  async findPaymentById(paymentId) {
    const doc = await PaymentModel.findById(paymentId).lean();
    return this._toPaymentDomain(doc);
  }

  async savePayment(paymentDomain) {
    const doc = await PaymentModel.create({
      clientEmail: paymentDomain.clientEmail,
      bookingId: paymentDomain.bookingId,
      studioId: paymentDomain.studioId,
      invoiceNumber: paymentDomain.invoiceNumber,
      description: paymentDomain.description,
      amount: paymentDomain.amount,
      currency: paymentDomain.currency,
      status: paymentDomain.status,
      method: paymentDomain.method,
      dueDate: paymentDomain.dueDate,
      paidAt: paymentDomain.paidAt,
    });
    return this.findPaymentById(doc._id.toString());
  }

  async updatePayment(paymentDomain) {
    await PaymentModel.findByIdAndUpdate(
      paymentDomain.id,
      {
        $set: {
          status: paymentDomain.status,
          method: paymentDomain.method,
          paidAt: paymentDomain.paidAt,
          updatedAt: new Date(),
        },
      },
      { new: true }
    );
    return this.findPaymentById(paymentDomain.id);
  }

  // ── Galleries ────────────────────────────────────────────────────────────
  async findGalleriesByClientEmail(clientEmail) {
    const docs = await GalleryModel.find({ clientEmail: clientEmail.toLowerCase().trim() })
      .sort({ createdAt: -1 })
      .lean();
    return docs.map((doc) => this._toGalleryDomain(doc));
  }

  async findGalleryById(galleryId) {
    const doc = await GalleryModel.findById(galleryId).lean();
    return this._toGalleryDomain(doc);
  }

  async updateGallery(galleryDomain) {
    await GalleryModel.findByIdAndUpdate(
      galleryDomain.id,
      {
        $set: {
          photos: galleryDomain.photos,
          updatedAt: new Date(),
        },
      },
      { new: true }
    );
    return this.findGalleryById(galleryDomain.id);
  }

  // ── Albums ───────────────────────────────────────────────────────────────
  async findAlbumsByClientEmail(clientEmail) {
    const docs = await AlbumModel.find({ clientEmail: clientEmail.toLowerCase().trim() })
      .sort({ createdAt: -1 })
      .lean();
    return docs.map((doc) => this._toAlbumDomain(doc));
  }

  async findAlbumById(albumId) {
    const doc = await AlbumModel.findById(albumId).lean();
    return this._toAlbumDomain(doc);
  }

  async saveAlbum(albumDomain) {
    const doc = await AlbumModel.create({
      clientEmail: albumDomain.clientEmail,
      galleryId: albumDomain.galleryId,
      studioId: albumDomain.studioId,
      title: albumDomain.title,
      selectedPhotoIds: albumDomain.selectedPhotoIds,
      coverMaterial: albumDomain.coverMaterial,
      pageCount: albumDomain.pageCount,
      clientNotes: albumDomain.clientNotes,
      status: albumDomain.status,
    });
    return this.findAlbumById(doc._id.toString());
  }

  async updateAlbum(albumDomain) {
    await AlbumModel.findByIdAndUpdate(
      albumDomain.id,
      {
        $set: {
          title: albumDomain.title,
          selectedPhotoIds: albumDomain.selectedPhotoIds,
          coverMaterial: albumDomain.coverMaterial,
          pageCount: albumDomain.pageCount,
          clientNotes: albumDomain.clientNotes,
          status: albumDomain.status,
          updatedAt: new Date(),
        },
      },
      { new: true }
    );
    return this.findAlbumById(albumDomain.id);
  }
}

module.exports = MongoClientRepository;
