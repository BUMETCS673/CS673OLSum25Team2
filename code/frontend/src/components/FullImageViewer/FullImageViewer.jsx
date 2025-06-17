import React, { useEffect, useState } from 'react';
import { X, Download, ZoomIn, ZoomOut, RotateCw, Maximize2 } from 'lucide-react';
import './FullImageViewer.css';

const FullImageViewer = ({ 
  isOpen, 
  imageUrl, 
  title, 
  onClose,
  showControls = true,
  allowDownload = true 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Reset image state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setImageLoaded(false);
      setImageError(false);
      setZoom(1);
      setRotation(0);
      setImagePosition({ x: 0, y: 0 });
    }
  }, [isOpen, imageUrl]);

  // Handle zoom
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setImagePosition({ x: 0, y: 0 });
  };

  // Handle rotation
  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  // Handle image dragging (when zoomed)
  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - imagePosition.x,
        y: e.clientY - imagePosition.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle download
  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title || 'story-image'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  };

  // Get image dimensions info
  const getImageInfo = () => {
    return {
      dimensions: '1024 × 1024 pixels',
      zoom: `${Math.round(zoom * 100)}%`,
      rotation: `${rotation}°`
    };
  };

  if (!isOpen) return null;

  const imageInfo = getImageInfo();

  return (
    <div className="full-image-overlay" onClick={onClose}>
      <div className="full-image-container" onClick={(e) => e.stopPropagation()}>
        
        {/* Header with controls */}
        <div className="full-image-header">
          <div className="full-image-title">
            <h3>{title || 'Story Image'}</h3>
            <span className="image-dimensions">{imageInfo.dimensions}</span>
          </div>
          
          {showControls && (
            <div className="full-image-controls">
              <button 
                onClick={handleZoomOut}
                className="control-btn"
                title="Zoom Out"
                disabled={zoom <= 0.5}
              >
                <ZoomOut size={18} />
              </button>
              
              <span className="zoom-indicator">{imageInfo.zoom}</span>
              
              <button 
                onClick={handleZoomIn}
                className="control-btn"
                title="Zoom In"
                disabled={zoom >= 3}
              >
                <ZoomIn size={18} />
              </button>
              
              <button 
                onClick={handleResetZoom}
                className="control-btn"
                title="Reset Zoom"
              >
                <Maximize2 size={18} />
              </button>
              
              <button 
                onClick={handleRotate}
                className="control-btn"
                title="Rotate 90°"
              >
                <RotateCw size={18} />
              </button>
              
              {allowDownload && (
                <button 
                  onClick={handleDownload}
                  className="control-btn download-btn"
                  title="Download Image"
                >
                  <Download size={18} />
                </button>
              )}
            </div>
          )}
          
          <button 
            onClick={onClose}
            className="close-full-image-btn"
            title="Close (Esc)"
          >
            <X size={24} />
          </button>
        </div>

        {/* Image container */}
        <div 
          className="full-image-content"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
        >
          {!imageLoaded && !imageError && (
            <div className="full-image-loading">
              <div className="loading-spinner"></div>
              <span>Loading full resolution image...</span>
            </div>
          )}

          {imageUrl && (
            <img 
              src={imageUrl}
              alt={title || 'Story illustration - Full Size'}
              className={`full-size-image ${imageLoaded ? 'loaded' : 'loading'}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg) translate(${imagePosition.x / zoom}px, ${imagePosition.y / zoom}px)`,
                display: imageLoaded ? 'block' : 'none',
                transition: isDragging ? 'none' : 'transform 0.3s ease'
              }}
              draggable={false}
            />
          )}

          {imageError && (
            <div className="full-image-error">
              <span>❌ Failed to load image</span>
              <button onClick={() => window.location.reload()} className="retry-btn">
                Retry
              </button>
            </div>
          )}
        </div>

        {/* Footer with info and instructions */}
        <div className="full-image-footer">
          <div className="image-info">
            <span>Zoom: {imageInfo.zoom}</span>
            {rotation > 0 && <span>Rotation: {imageInfo.rotation}</span>}
            {zoom > 1 && <span>Drag to pan</span>}
          </div>
          
          <div className="instructions">
            <span>Click outside or press Esc to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullImageViewer;