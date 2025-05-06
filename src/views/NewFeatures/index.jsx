import React, {useEffect, useState} from 'react';
import bannerImg from '@/images/banner-girl-1.png';
import {useDocumentTitle, useRecommendedProducts, useScrollTop} from '@/hooks';
import axios from "axios";
import {MessageDisplay} from "@/components/common";
import {ProductShowcaseGrid} from "@/components/product";

const NewFeature = () => {
  useDocumentTitle('Try New Feature | Ayounek');
  useScrollTop();
  const {
    recommendedProducts,
    fetchRecommendedProducts,
    isLoading,
    error
  } = useRecommendedProducts();

  const [selectedProduct,setSelectedProduct] = useState([]);
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
              <h1>Try Our New Feature</h1>
              <p>Upload an image and see the AI-powered prediction!</p>
            </div>
            <div className="banner-img">
              <img src={bannerImg} alt="Banner"/>
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
                    style={{display: 'none'}}
                />
              </div>

              <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="button"
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
