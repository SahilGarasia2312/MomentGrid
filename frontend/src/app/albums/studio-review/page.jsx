'use strict';
'use client';

import React from 'react';
import StudioApprovedManifestView from '../../../components/album-selector/StudioApprovedManifestView';

export default function StudioAlbumReviewPage() {
  return (
    <div className="min-h-screen bg-[#0A0A14] text-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <StudioApprovedManifestView
          albumId="album-heirloom-2026"
        />
      </div>
    </div>
  );
}
