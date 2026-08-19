'use strict';
'use client';

import React, { useState } from 'react';
import { Download, HardDrive, Clock, CheckCircle2, Sparkles, ShieldCheck, FileText, Lock } from 'lucide-react';

export default function ClientDownloadsTab({ galleries = [], onLogDownload }) {
  const [downloadingBundle, setDownloadingBundle] = useState(null);
  const [downloadLink, setDownloadLink] = useState(null);

  const displayGalleries = galleries.length > 0 ? galleries : [
    {
      id: 'gal-sample-1',
      title: 'Autumn Golden Hour Lookbook — High-Res Print Selects',
      photosCount: 84,
      expiresAt: '2026-11-30',
      status: 'published',
    },
    {
      id: 'gal-sample-2',
      title: 'Sunset Beach Engagement — Master Collection',
      photosCount: 115,
      expiresAt: '2026-12-15',
      status: 'published',
    },
  ];

  const handleStartDownload = async (galleryId, format, bundleTitle) => {
    setDownloadingBundle(bundleTitle);
    setDownloadLink(null);
    if (onLogDownload) {
      const result = await onLogDownload(galleryId, format);
      if (result && result.downloadUrl) {
        setDownloadLink(result.downloadUrl);
      } else {
        setDownloadLink(`https://assets.momentgrid.io/delivery/${galleryId}_${format}.zip`);
      }
    } else {
      setTimeout(() => {
        setDownloadLink(`https://assets.momentgrid.io/delivery/${galleryId}_${format}.zip`);
        setDownloadingBundle(null);
      }, 1200);
      return;
    }
    setDownloadingBundle(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#F8F6F3', margin: 0 }}>
            Master Asset Delivery & Downloads Hub
          </h2>
          <p style={{ color: '#B8B8C6', fontSize: '14px', margin: '4px 0 0 0' }}>
            Retrieve full-resolution lossless print bundles, web-optimized social media packages, or print rights licenses.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4ade80', fontSize: '13px', fontWeight: 600, backgroundColor: 'rgba(74, 222, 128, 0.1)', padding: '8px 16px', borderRadius: '20px', border: '1px solid rgba(74, 222, 128, 0.25)' }}>
          <ShieldCheck size={16} /> Unlimited VIP Cloud Download Rights Active
        </div>
      </div>

      {/* Download Bundles Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
        {displayGalleries.map((gal) => (
          <div
            key={gal.id || gal._id}
            style={{
              backgroundColor: '#161628',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '20px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ backgroundColor: 'rgba(200, 169, 110, 0.15)', color: '#C8A96E', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>
                  {gal.photosCount || gal.photos?.length || 80} Master Files
                </span>
                <span style={{ fontSize: '12px', color: '#9A9AA6', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={13} /> Expires {gal.expiresAt || 'in 90 days'}
                </span>
              </div>

              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#F8F6F3', margin: '0 0 8px 0' }}>
                {gal.title}
              </h3>
              <p style={{ color: '#B8B8C6', fontSize: '13px', margin: 0 }}>
                Includes uncompressed color-graded TIFF/JPEG selects ready for large format canvas printing.
              </p>
            </div>

            {/* Bundles Options List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <HardDrive size={18} style={{ color: '#C8A96E' }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#F8F6F3' }}>High-Res Print Bundle (.ZIP)</div>
                    <div style={{ fontSize: '11px', color: '#9A9AA6' }}>300 DPI Lossless • Approx 1.4 GB</div>
                  </div>
                </div>
                <button
                  onClick={() => handleStartDownload(gal.id || gal._id, 'print', `${gal.title} (Print)`)}
                  style={{
                    background: 'linear-gradient(135deg, #C8A96E 0%, #9A7B4F 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    color: '#121220',
                    fontWeight: 700,
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Download size={14} /> Download
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FileText size={18} style={{ color: '#38bdf8' }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#F8F6F3' }}>Social Media & Web Bundle</div>
                    <div style={{ fontSize: '11px', color: '#9A9AA6' }}>SRGB 2048px • Approx 180 MB</div>
                  </div>
                </div>
                <button
                  onClick={() => handleStartDownload(gal.id || gal._id, 'web', `${gal.title} (Web)`)}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    color: '#F8F6F3',
                    fontWeight: 600,
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Download size={14} /> Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Download Status Notification Box */}
      {(downloadingBundle || downloadLink) && (
        <div
          style={{
            backgroundColor: '#161628',
            border: '1px solid #C8A96E',
            borderRadius: '16px',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 8px 32px rgba(200, 169, 110, 0.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'rgba(200, 169, 110, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#C8A96E',
              }}
            >
              <Download size={22} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#F8F6F3' }}>
                {downloadingBundle ? `Packaging "${downloadingBundle}"...` : 'Your VIP Asset Archive is Ready!'}
              </div>
              <div style={{ fontSize: '13px', color: '#B8B8C6', marginTop: '2px' }}>
                {downloadingBundle
                  ? 'Please wait while our cloud servers compress your full-resolution files.'
                  : 'Click the link on the right to download directly to your machine or cloud storage.'}
              </div>
            </div>
          </div>

          {downloadLink && (
            <a
              href={downloadLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'linear-gradient(135deg, #C8A96E 0%, #9A7B4F 100%)',
                borderRadius: '10px',
                padding: '10px 22px',
                color: '#121220',
                fontWeight: 700,
                fontSize: '13px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Download size={16} /> Save ZIP Archive
            </a>
          )}
        </div>
      )}
    </div>
  );
}
