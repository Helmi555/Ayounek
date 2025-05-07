import React, { useEffect, useState } from 'react';
import bannerImg from '@/images/banner-girl-1.png';
import { useDocumentTitle, useRecommendedProducts, useScrollTop } from '@/hooks';
import axios from "axios";
import { MessageDisplay } from "@/components/common";
import { ProductShowcaseGrid } from "@/components/product";

const NewFeature = () => {
  useDocumentTitle('Try New Feature | Ayounek');
  useScrollTop();
  const {
    recommendedProducts,
    fetchRecommendedProducts,
    isLoading,
    error
  } = useRecommendedProducts();

  const [selectedProduct, setSelectedProduct] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [resultText, setResultText] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(
    () => {
      if (resultText === 'Square') {
        setSelectedProduct(recommendedProducts.filter((product) => product.category === 2));
      } else if (resultText === 'Rectangle') {
        setSelectedProduct(recommendedProducts.filter((product) => product.category === 3));
      } else if (resultText === 'Rounded') {
        setSelectedProduct(recommendedProducts.filter((product) => product.category === 1));
      }
    },
    [resultText]
  )

  const handleFileChange = (e) => {
    setResultText('');
    setUploadError('');
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select an image.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setIsUploading(true);
      const response = await axios.post('http://localhost:5000/predict', formData);
      setResultText(response.data);
      setUploadError('');
    } catch (error) {
      console.error(error);
      setUploadError('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <main className="content">
      <div className="featured">
        <div className="banner">
          <div className="banner-desc">
            <h1>Try Our <span style={{
              display: 'inline-block',
              fontSize: '5.6rem',
              background: 'linear-gradient(90deg, #12c2e9, #c471ed, #f64f59)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 20px rgba(198, 40, 255, 0.5)',
              animation: 'neonGlow 2s infinite alternate'
            }}>
              NEW AI
            </span>
              Feature</h1>
            <p>Upload an image and see the AI-powered prediction!</p>
          </div>
          <div className="banner-img">
            <img src={bannerImg} alt="Banner" />
          </div>
        </div>

        <div className="display">
          <div className="upload-box">
            <div className="upload-square" onClick={() => document.getElementById('hidden-file-input').click()}>
              {selectedFile ? (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  className="upload-preview"
                />
              ) : (
                <span className="upload-placeholder">Upload Photo</span>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                id="hidden-file-input"
                style={{ display: 'none' }}
              />
            </div>

            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="button"
              style={{
                background: isUploading
                  ? 'linear-gradient(90deg, #ff8a00, #e52e71)'
                  : 'linear-gradient(90deg, #00f0ff, #0088ff)',
                color: 'white',
                border: 'none',
                padding: '15px 20px',
                fontSize: '1.6rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                borderRadius: '50px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s',
                ':disabled': {
                  opacity: 0.7,
                  cursor: 'not-allowed'
                }
              }}
            >
              {isUploading ? 'Uploading...' : 'Send'}
            </button>

            {uploadError && (
              <p className="error-text">{uploadError}</p>
            )}

            {resultText && (
              <div className="result-box">
                <p><strong>The Best Category that goes with you is: </strong> {resultText} </p>
                <p> <strong>Those Are some Suggestions</strong></p>
              </div>
            )}
          </div>
        </div>
        <div className="display">
          <div className="product-display-grid">
            {(error && !isLoading) ? (
              <MessageDisplay
                message={error}
                action={fetchRecommendedProducts}
                buttonLabel="Try Again"
              />
            ) : (
              <ProductShowcaseGrid
                products={selectedProduct}
                skeletonCount={0}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default NewFeature;
