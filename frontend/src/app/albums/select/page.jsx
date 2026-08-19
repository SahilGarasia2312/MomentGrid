'use strict';
'use client';

import React from 'react';
import AlbumSelectorSuite from '../../../components/album-selector/AlbumSelectorSuite';

export default function ClientAlbumSelectionPage() {
  return (
    <div className="min-h-screen bg-[#0A0A14] text-white">
      <AlbumSelectorSuite
        galleryId="gal-momentgrid-heirloom-2026"
        clientEmail="elena.rossi@momentgrid.com"
        clientName="Elena & Marcus Rossi"
      />
    </div>
  );
}
