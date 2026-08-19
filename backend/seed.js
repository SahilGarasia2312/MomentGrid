'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserModel = require('./src/infrastructure/database/models/UserModel');
const StudioModel = require('./src/infrastructure/database/models/StudioModel');
const PhotographerModel = require('./src/infrastructure/database/models/PhotographerModel');
const PackageModel = require('./src/infrastructure/database/models/PackageModel');
const EventModel = require('./src/infrastructure/database/models/EventModel');
const GalleryModel = require('./src/infrastructure/database/models/GalleryModel');
const PaymentModel = require('./src/infrastructure/database/models/PaymentModel');
const NotificationModel = require('./src/infrastructure/database/models/NotificationModel');
const AlbumModel = require('./src/infrastructure/database/models/AlbumModel');
const StaffModel = require('./src/infrastructure/database/models/StaffModel');

async function seed() {
  console.log('🌱 Starting MomentGrid MongoDB Atlas Seeding...');
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI missing in .env');

  await mongoose.connect(uri);
  console.log(`✅ Connected to Atlas: ${mongoose.connection.host}`);

  // Clear existing collections
  await Promise.all([
    UserModel.deleteMany({}),
    StudioModel.deleteMany({}),
    PhotographerModel.deleteMany({}),
    PackageModel.deleteMany({}),
    EventModel.deleteMany({}),
    GalleryModel.deleteMany({}),
    PaymentModel.deleteMany({}),
    NotificationModel.deleteMany({}),
    AlbumModel.deleteMany({}),
    StaffModel.deleteMany({}),
  ]);
  console.log('🧹 Cleared existing database collections.');

  const defaultPassword = await bcrypt.hash('MomentGrid@2026', 10);
  const password123 = await bcrypt.hash('password123', 10);

  // 1. Create Users across all roles (Mixed Indian + Foreign Global Portfolio)
  const demoOwnerUser = await UserModel.create({
    fullName: 'Aarav Sharma & Sofia Garcia Collective',
    email: 'demo@momentgrid.com',
    passwordHash: password123,
    role: 'studio_owner',
    status: 'active',
    emailVerified: true,
    phone: '+91 98200 12345',
    lastLoginAt: new Date(),
  });

  const demoAdminUser = await UserModel.create({
    fullName: 'Vikramaditya Singhania (Global Admin)',
    email: 'admin@momentgrid.com',
    passwordHash: password123,
    role: 'admin',
    status: 'active',
    emailVerified: true,
    phone: '+91 98111 00102',
    lastLoginAt: new Date(),
  });

  const demoPhotographerUser = await UserModel.create({
    fullName: 'Kabir Malhotra (Royal Wedding Master)',
    email: 'photographer@momentgrid.com',
    passwordHash: password123,
    role: 'photographer',
    status: 'active',
    emailVerified: true,
    phone: '+91 99200 88776',
    lastLoginAt: new Date(),
  });

  const demoClientUser = await UserModel.create({
    fullName: 'Ananya & Siddharth Singhania (VIP Client)',
    email: 'client@momentgrid.com',
    passwordHash: password123,
    role: 'client',
    status: 'active',
    emailVerified: true,
    phone: '+91 98333 44556',
    lastLoginAt: new Date(),
  });

  const superAdmin = await UserModel.create({
    fullName: 'Global Platform Admin',
    email: 'superadmin@momentgrid.com',
    passwordHash: defaultPassword,
    role: 'admin',
    status: 'active',
    emailVerified: true,
    phone: '+1 800 555 0199',
    lastLoginAt: new Date(),
  });

  const studioOwnerUser = await UserModel.create({
    fullName: 'Sofia Garcia (European Director)',
    email: 'sofia.garcia@momentgrid.com',
    passwordHash: defaultPassword,
    role: 'studio_owner',
    status: 'active',
    emailVerified: true,
    phone: '+34 91 234 5678',
    lastLoginAt: new Date(),
  });

  const photographerUser = await UserModel.create({
    fullName: 'Alex Kim (International Editorial Lead)',
    email: 'alex.kim@momentgrid.com',
    passwordHash: defaultPassword,
    role: 'photographer',
    status: 'active',
    emailVerified: true,
    phone: '+82 10 9876 5432',
    lastLoginAt: new Date(),
  });

  const clientUser = await UserModel.create({
    fullName: 'Elena Rossi & Marco Bellini',
    email: 'elena.rossi@momentgrid.com',
    passwordHash: defaultPassword,
    role: 'client',
    status: 'active',
    emailVerified: true,
    phone: '+39 02 8765 4321',
    lastLoginAt: new Date(),
  });

  const clientUser2 = await UserModel.create({
    fullName: 'Rhea Kapoor & Harper Davis',
    email: 'harper.davis@momentgrid.com',
    passwordHash: defaultPassword,
    role: 'client',
    status: 'active',
    emailVerified: true,
    phone: '+1 415 987 6543',
    lastLoginAt: new Date(),
  });

  console.log('👤 Created Global Users (Indian Royal Weddings & Foreign Luxury Celebrations).');

  // 2. Create Global Studio collective profile
  const studio = await StudioModel.create({
    name: 'MomentGrid Global Collective (Mumbai • Madrid • Paris)',
    slug: 'momentgrid-global-collective',
    tagline: 'Royal Indian Palaces & Luxury European Destination Storytelling',
    description: 'An elite international photography studio collective crafting cinematic heirlooms across Royal Rajasthani Palaces (Udaipur & Jaipur), Lake Como villas, and Paris Couture Fashion Week.',
    contactEmail: 'demo@momentgrid.com',
    phone: '+91 98200 12345 / +34 91 234 5678',
    address: 'Bandra West, Mumbai, India & Gran Vía 42, Madrid, Spain',
    ownerId: demoOwnerUser._id,
    activeStaffCount: 8,
    brandColor: '#D4AF37', // Royal Gold
    bannerUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1600&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=300&q=80',
  });

  // Link users to studio
  studioOwnerUser.studioId = studio._id;
  await studioOwnerUser.save();
  demoOwnerUser.studioId = studio._id;
  await demoOwnerUser.save();
  photographerUser.studioId = studio._id;
  await photographerUser.save();
  demoPhotographerUser.studioId = studio._id;
  await demoPhotographerUser.save();
  console.log('🏢 Created Global Studio profile & linked users.');

  // 3. Create Staff & Photographer profiles (Indian + Foreign Specialists)
  const staffMember = await StaffModel.create({
    studioId: studio._id,
    userId: photographerUser._id,
    fullName: 'Alex Kim (European Destination Master)',
    email: 'alex.kim@momentgrid.com',
    role: 'lead_photographer',
    status: 'active',
    phone: '+82 10 9876 5432',
  });

  const staffDemoMember = await StaffModel.create({
    studioId: studio._id,
    userId: demoPhotographerUser._id,
    fullName: 'Kabir Malhotra (Royal Rajasthani Specialist)',
    email: 'photographer@momentgrid.com',
    role: 'lead_photographer',
    status: 'active',
    phone: '+91 99200 88776',
  });

  await PhotographerModel.create({
    studioId: studio._id,
    userId: photographerUser._id,
    fullName: 'Alex Kim',
    email: 'alex.kim@momentgrid.com',
    phone: '+82 10 9876 5432',
    bio: 'Award-winning European destination wedding photographer specializing in Lake Como villas, Amalfi coastlines, and Paris editorial couture.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    specializations: ['wedding', 'editorial', 'portrait', 'ceremony'],
    yearsExperience: 9,
    stats: { totalSessions: 168, averageRating: 4.9, totalReviews: 120 },
    equipment: ['Sony A1 Dual Body', '85mm f/1.4 GM', '35mm f/1.4 GM', '24-70mm f/2.8 GM II'],
    status: 'active',
  });

  await PhotographerModel.create({
    studioId: studio._id,
    userId: demoPhotographerUser._id,
    fullName: 'Kabir Malhotra',
    email: 'photographer@momentgrid.com',
    phone: '+91 99200 88776',
    bio: 'India’s premier luxury wedding & palace cinematographer. Master of multi-day heritage weddings at Taj Lake Palace, Umaid Bhawan, and Rambagh Palace.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    specializations: ['indian_wedding', 'sangeet', 'palace_ceremony', 'drone_cinematography'],
    yearsExperience: 11,
    stats: { totalSessions: 210, averageRating: 5.0, totalReviews: 185 },
    equipment: ['Hasselblad X2D 100C', 'RED Komodo 6K Cinema', 'Sony FX3 Dual Body', 'DJI Inspire 3 Drone'],
    status: 'active',
  });
  console.log('📸 Created Mixed Indian and Foreign Photographer profiles.');

  // 4. Create Packages (Indian & Global Hierarchy)
  const pkgRoyalIndian = await PackageModel.create({
    studioId: studio._id,
    title: 'Royal Heritage Palace Collection (3-Day Indian Wedding)',
    description: 'Complete 3-Day multi-event coverage (Mehendi, Haldi, Grand Sangeet, Royal Sunset Pheras, & Reception). 4 Lead Photographers + 2 Drone Cinematographers + 1500+ RAW/Edited Heirloom Portraits & 4K Cinema Film.',
    price: 7800,
    durationMinutes: 2160,
    deliverablesCount: 1500,
    isActive: true,
  });

  const pkgGoldEuropean = await PackageModel.create({
    studioId: studio._id,
    title: 'European Destination Masterpiece Tier',
    description: 'Full 10-hour multi-location coverage across Lake Como / Amalfi / Paris with 2 lead photographers, cinematic drone shots, and luxury handcrafted Italian leather album.',
    price: 5200,
    durationMinutes: 600,
    deliverablesCount: 800,
    isActive: true,
  });

  const pkgSilverCouture = await PackageModel.create({
    studioId: studio._id,
    title: 'Couture Editorial & Milestone Session',
    description: 'High-end 6-hour celebrity/editorial coverage with instant ProRAW color grading and private PIN vault.',
    price: 3200,
    durationMinutes: 360,
    deliverablesCount: 300,
    isActive: true,
  });
  console.log('📦 Created Mixed Packages ($7,800 Royal Indian Palace & $5,200 European Destination).');

  // 5. Create Events / Bookings
  const eventUdaipur = await EventModel.create({
    studioId: studio._id,
    title: 'Ananya & Siddharth — Royal Taj Lake Palace Wedding (Udaipur)',
    clientName: 'Ananya Singhania & Siddharth Mehta',
    clientEmail: 'client@momentgrid.com',
    clientPhone: '+91 98333 44556',
    eventDate: '2026-11-24',
    startTime: '10:00',
    endTime: '23:59',
    packageId: pkgRoyalIndian._id,
    assignedStaffIds: [staffDemoMember._id, staffMember._id],
    status: 'confirmed',
    price: 7800,
    notes: 'Day 1: Mehendi on Lake Pichola Terrace. Day 2: Grand Sangeet in Darbar Hall. Day 3: Royal Sunset Pheras under Marigold Mandap. Require 4K drone livestream.',
  });

  const eventComo = await EventModel.create({
    studioId: studio._id,
    title: 'Elena & Marco — Villa Balbianello Celebration (Lake Como)',
    clientName: 'Elena Rossi & Marco Bellini',
    clientEmail: 'elena.rossi@momentgrid.com',
    clientPhone: '+39 02 8765 4321',
    eventDate: '2026-08-15',
    startTime: '14:00',
    endTime: '23:59',
    packageId: pkgGoldEuropean._id,
    assignedStaffIds: [staffMember._id],
    status: 'confirmed',
    price: 5200,
    notes: 'Bride requested golden hour portraits overlooking Lake Como terrace. Formal ceremony starts at 4:30 PM.',
  });

  const eventGala = await EventModel.create({
    studioId: studio._id,
    title: 'Rhea & Harper — Mumbai & Paris Celebrity Couture Gala',
    clientName: 'Rhea Kapoor & Harper Davis',
    clientEmail: 'harper.davis@momentgrid.com',
    clientPhone: '+1 415 987 6543',
    eventDate: '2026-09-20',
    startTime: '18:00',
    endTime: '23:59',
    packageId: pkgSilverCouture._id,
    assignedStaffIds: [staffDemoMember._id],
    status: 'confirmed',
    price: 3200,
    notes: 'Haute couture editorial walk and private VIP reception.',
  });
  console.log('📅 Created Event bookings (Royal Udaipur Palace & Lake Como Villa).');

  // 6. Create Galleries with rich Indian + Foreign Photos & 4K Video Reels
  await GalleryModel.create({
    studioId: studio._id,
    title: 'Ananya & Siddharth — Royal Taj Lake Palace Master Gallery',
    eventId: eventUdaipur._id,
    packageId: pkgRoyalIndian._id,
    clientEmail: 'client@momentgrid.com',
    pinCode: '1234',
    coverUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1600&q=80',
    status: 'published',
    categories: ['Mehendi & Haldi Splendor', 'Royal Sangeet Night', 'Sunset Palace Pheras', '4K Cinematic Wedding Films'],
    folders: [
      { id: 'if1', name: 'Day 1: Mehendi & Haldi Splendor', parentId: null, photoCount: 3 },
      { id: 'if2', name: 'Day 2: Royal Sangeet & Musical Night', parentId: null, photoCount: 3 },
      { id: 'if3', name: 'Day 3: Sunset Pheras at Taj Lake Palace', parentId: null, photoCount: 3 },
      { id: 'if4', name: '4K Cinematic Wedding Films & Reels', parentId: null, photoCount: 2 },
    ],
    photos: [
      { id: 'ip1', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80', caption: 'Regal Marigold Mehendi Setup overlooking Lake Pichola', category: 'Mehendi & Haldi Splendor', folderId: 'if1', width: 3840, height: 2560, format: 'jpg', bytes: 3450000, isFavorite: true },
      { id: 'ip2', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80', caption: 'Haldi Blessings & Golden Floral Shower', category: 'Mehendi & Haldi Splendor', folderId: 'if1', width: 4000, height: 2667, format: 'jpg', bytes: 3100000, isFavorite: true },
      { id: 'ip3', url: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1200&q=80', caption: 'Royal Sabyasachi Bridal Lehenga Details', category: 'Mehendi & Haldi Splendor', folderId: 'if1', width: 3840, height: 2560, format: 'jpg', bytes: 2980000, isFavorite: false },
      { id: 'ip4', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80', caption: 'Grand Darbar Hall Sangeet Performance', category: 'Royal Sangeet Night', folderId: 'if2', width: 4200, height: 2800, format: 'jpg', bytes: 3800000, isFavorite: true },
      { id: 'ip5', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80', caption: 'Couple Dance Under Chandelier Lights', category: 'Royal Sangeet Night', folderId: 'if2', width: 3840, height: 2560, format: 'jpg', bytes: 3100000, isFavorite: false },
      { id: 'ip6', url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80', caption: 'Royal Varmala Exchange under Marigold Mandap', category: 'Sunset Palace Pheras', folderId: 'if3', width: 4000, height: 2667, format: 'jpg', bytes: 3600000, isFavorite: true },
      { id: 'ip7', url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80', caption: 'Sunset Agni Pheras with Vedic Chants', category: 'Sunset Palace Pheras', folderId: 'if3', width: 3840, height: 2560, format: 'jpg', bytes: 3400000, isFavorite: true },
      { id: 'ip8', url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80', caption: 'Twilight Palace Sparkler Exit on Royal Boat', category: 'Sunset Palace Pheras', folderId: 'if3', width: 3840, height: 2560, format: 'jpg', bytes: 3200000, isFavorite: true },
      { id: 'iv1', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', caption: '4K Royal Udaipur Palace Drone Film & Teaser', category: '4K Cinematic Wedding Films', folderId: 'if4', width: 3840, height: 2160, format: 'mp4', bytes: 24500000, isFavorite: true },
      { id: 'iv2', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4', caption: 'Royal Sangeet 120fps Slow-Motion Highlights', category: '4K Cinematic Wedding Films', folderId: 'if4', width: 3840, height: 2160, format: 'mp4', bytes: 19800000, isFavorite: true },
    ],
    watermarkConfig: { enabled: true, text: '© MomentGrid Royal Palace Studio', opacity: 45, position: 'south_east' },
    sharingConfig: { isPublic: true, requirePin: true, pinCode: '1234', allowDownloads: true },
  });

  await GalleryModel.create({
    studioId: studio._id,
    title: 'Elena & Marco — Lake Como Master Gallery (Italy)',
    eventId: eventComo._id,
    packageId: pkgGoldEuropean._id,
    clientEmail: 'elena.rossi@momentgrid.com',
    pinCode: '2026',
    coverUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=80',
    status: 'published',
    categories: ['Villa Preparations', 'Ceremony Vows', 'Lake Como Portraits', 'European Cinema Reels'],
    folders: [
      { id: 'ef1', name: 'Villa Preparations & Details', parentId: null, photoCount: 3 },
      { id: 'ef2', name: 'Ceremony Vows Under Arches', parentId: null, photoCount: 3 },
      { id: 'ef3', name: 'Golden Hour Terrace & Boat Ride', parentId: null, photoCount: 3 },
      { id: 'ef4', name: 'European Cinema 4K Reels', parentId: null, photoCount: 2 },
    ],
    photos: [
      { id: 'ep1', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80', caption: 'Lakeside arrival at Villa Balbianello', category: 'Villa Preparations', folderId: 'ef1', width: 3840, height: 2560, format: 'jpg', bytes: 2450000, isFavorite: true },
      { id: 'ep2', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80', caption: 'Italian Silk Veil Preparation', category: 'Villa Preparations', folderId: 'ef1', width: 3840, height: 2560, format: 'jpg', bytes: 3100000, isFavorite: false },
      { id: 'ep3', url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80', caption: 'Exchange of rings under historical arches', category: 'Ceremony Vows', folderId: 'ef2', width: 4000, height: 2667, format: 'jpg', bytes: 2900000, isFavorite: true },
      { id: 'ep4', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80', caption: 'First kiss overlooking the Italian Lake', category: 'Ceremony Vows', folderId: 'ef2', width: 3840, height: 2560, format: 'jpg', bytes: 2800000, isFavorite: true },
      { id: 'ep5', url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80', caption: 'Golden hour portrait on the stone terrace', category: 'Lake Como Portraits', folderId: 'ef3', width: 4200, height: 2800, format: 'jpg', bytes: 3400000, isFavorite: true },
      { id: 'ep6', url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80', caption: 'Wooden Riva Boat Sunset Ride', category: 'Lake Como Portraits', folderId: 'ef3', width: 3840, height: 2560, format: 'jpg', bytes: 3200000, isFavorite: true },
      { id: 'ev1', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', caption: 'Villa Balbianello Aerial Drone Film', category: 'European Cinema Reels', folderId: 'ef4', width: 3840, height: 2160, format: 'mp4', bytes: 14500000, isFavorite: true },
      { id: 'ev2', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4', caption: 'Italian Lake Wedding Master Feature', category: 'European Cinema Reels', folderId: 'ef4', width: 3840, height: 2160, format: 'mp4', bytes: 18900000, isFavorite: true },
    ],
    watermarkConfig: { enabled: true, text: '© MomentGrid European Collective', opacity: 45, position: 'south_east' },
    sharingConfig: { isPublic: true, requirePin: true, pinCode: '2026', allowDownloads: true },
  });

  await GalleryModel.create({
    studioId: studio._id,
    title: 'Rhea & Harper — Paris & Mumbai Haute Couture Gala',
    eventId: eventGala._id,
    packageId: pkgSilverCouture._id,
    clientEmail: 'harper.davis@momentgrid.com',
    pinCode: '5678',
    coverUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1600&q=80',
    status: 'published',
    categories: ['Runway Walk', 'Celebrity Red Carpet', '4K Cinematic Reels'],
    folders: [
      { id: 'cf1', name: 'Runway & Celebrity Red Carpet', parentId: null, photoCount: 4 },
      { id: 'cf2', name: '4K Cinematic Reels', parentId: null, photoCount: 2 },
    ],
    photos: [
      { id: 'cp1', url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80', caption: 'Atelier Runway Walk #1', category: 'Runway Walk', folderId: 'cf1', width: 3840, height: 2560, format: 'jpg', bytes: 3400000, isFavorite: true },
      { id: 'cp2', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80', caption: 'Celebrity Red Carpet Spotlight', category: 'Celebrity Red Carpet', folderId: 'cf1', width: 3840, height: 2560, format: 'jpg', bytes: 2900000, isFavorite: true },
      { id: 'cv1', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', caption: '4K 120fps Runway Slow Motion Master', category: '4K Cinematic Reels', folderId: 'cf2', width: 3840, height: 2160, format: 'mp4', bytes: 24500000, isFavorite: true },
    ],
    watermarkConfig: { enabled: true, text: '© MomentGrid VIP Studio', opacity: 40, position: 'south_east' },
    sharingConfig: { isPublic: true, requirePin: true, pinCode: '5678', allowDownloads: true },
  });
  console.log('🖼️ Created Galleries (Indian Royal Palace, Lake Como, & Couture Gala with 4K Videos).');

  // 7. Create Payment / Invoice (Mixed USD & INR representation)
  await PaymentModel.create({
    clientEmail: 'client@momentgrid.com',
    bookingId: eventUdaipur._id,
    studioId: studio._id,
    invoiceNumber: 'INV-2026-IND01',
    description: 'Royal Heritage Palace Collection — 3-Day Udaipur Wedding Package ($7,800 / ₹6,50,000)',
    totalPackageAmount: 7800,
    advanceAmount: 2340,
    remainingAmount: 5460,
    amountPaid: 2340,
    amount: 2340,
    currency: 'USD',
    status: 'advance_paid',
    paymentType: 'advance',
    method: 'razorpay_card',
    razorpayOrderId: 'order_MgUdaipur2026XYZ',
    razorpayPaymentId: 'pay_MgUdaipur2026XYZ',
    invoiceItems: [
      { id: 'item_1', title: '3-Day Multi-Event Coverage (4 Photographers + 2 Drones)', quantity: 1, unitPrice: 6200, total: 6200 },
      { id: 'item_2', title: 'Handcrafted Velvet & Gold Heirloom Album (Twin Set)', quantity: 1, unitPrice: 1100, total: 1100 },
      { id: 'item_3', title: '4K Drone Aerial Livestream & Same-Day Edit', quantity: 1, unitPrice: 500, total: 500 },
    ],
    taxRate: 18,
    transactions: [
      { id: 'txn_1', type: 'advance_deposit', amount: 2340, status: 'success', method: 'razorpay_card', razorpayPaymentId: 'pay_MgUdaipur2026XYZ', razorpayOrderId: 'order_MgUdaipur2026XYZ', note: '30% Advance deposit collected via Razorpay Luxury Checkout' },
    ],
    dueDate: new Date('2026-11-01T23:59:00Z'),
    paidAt: new Date(),
  });
  console.log('💳 Created Payment Ledger & Invoices ($7,800 / ₹6,50,000 Royal Wedding).');

  // 8. Create Notifications
  await NotificationModel.create({
    recipientEmail: 'client@momentgrid.com',
    recipientRole: 'client',
    type: 'gallery_ready',
    title: '👑 Your Royal Taj Lake Palace Wedding Gallery & 4K Reel is Ready!',
    body: 'We are honored to present your complete 3-day royal collection and drone wedding film. Enter PIN 1234 to unlock.',
    actionUrl: '/client/dashboard',
    isRead: false,
  });

  await NotificationModel.create({
    recipientEmail: 'elena.rossi@momentgrid.com',
    recipientRole: 'client',
    type: 'gallery_ready',
    title: '✨ Your Lake Como Master Gallery & European Reel is Ready!',
    body: 'We are thrilled to present your complete high-resolution Italian wedding collection. Enter PIN 2026 to unlock.',
    actionUrl: '/client/dashboard',
    isRead: false,
  });
  console.log('🔔 Created Mixed Indian + Foreign sample Notifications.');

  console.log('\n🎉 Seeding Completed Successfully! Global Portfolio Live.');
  console.log('================================================================');
  console.log('🔑 DEMO LOGIN CREDENTIALS (MIXED INDIAN + FOREIGN GLOBAL ROLES):');
  console.log('----------------------------------------------------------------');
  console.log('🎨 Studio Owner (Global) : demo@momentgrid.com       | password123');
  console.log('🎨 Studio Owner (Europe) : sofia.garcia@momentgrid.com | MomentGrid@2026');
  console.log('👑 Super Admin           : admin@momentgrid.com      | password123');
  console.log('📸 Lead Photographer     : photographer@momentgrid.com | password123');
  console.log('⭐ VIP Client (Royal IND): client@momentgrid.com       | password123');
  console.log('⭐ VIP Client (Como ITA) : elena.rossi@momentgrid.com  | MomentGrid@2026');
  console.log('================================================================\n');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
