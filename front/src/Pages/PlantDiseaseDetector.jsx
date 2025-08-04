import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { Upload, Scan, Leaf, AlertTriangle, Shield, Loader2, Image, X } from 'lucide-react';

const PlantDiseaseDetector = () => {
  const { t } = useTranslation();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('image', image);
      const response = await fetch('http://localhost:5000/api/plant-disease-detect', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to analyze image');
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-2" dir={t('direction')}>
      <div className="max-w-3xl mx-auto mb-10 text-center">
        <div className="flex flex-col items-center gap-2">
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-full w-20 h-20 flex items-center justify-center shadow-lg mb-2">
            <Leaf className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-800 mb-2">{t('title')}</h1>
          <p className="text-lg md:text-xl text-green-700 max-w-xl mx-auto">{t('description')}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl border border-green-100 p-4 md:p-8 flex flex-col md:flex-row gap-8 relative">
        {/* Upload Section */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <form onSubmit={handleSubmit} className="w-full">
            <div className={`relative border-2 border-dashed rounded-2xl p-6 md:p-8 text-center transition-all duration-500 group bg-green-50 ${preview ? 'border-green-500 bg-green-100/60' : 'border-green-200 hover:border-green-400 hover:bg-green-100/40'}`}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                disabled={loading}
              />
              {preview ? (
                <div className="space-y-4">
                  <div className="relative mx-auto w-fit">
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-w-full max-h-48 rounded-xl shadow-xl border border-green-200"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg text-white"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-green-700 font-medium">{t('uploadSection.ready')}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="w-20 h-20 mx-auto bg-green-100 rounded-2xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <Image className="w-10 h-10 text-green-400 group-hover:text-green-600 transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-green-800">{t('uploadSection.selectImage')}</h3>
                    <p className="text-green-700 mb-4">{t('uploadSection.instructions')}</p>
                    <div className="inline-flex items-center space-x-4 text-sm text-green-800">
                      <span>{t('uploadSection.formats')}</span>
                      <span>•</span>
                      <span>{t('uploadSection.maxSize')}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={!image || loading}
              className={`w-full mt-6 py-3 px-6 rounded-xl font-bold transition-all duration-300 transform flex items-center justify-center gap-2
                ${!image || loading
                  ? 'bg-green-200 text-green-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-green-500/25 hover:scale-105 active:scale-95'}
              `}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  <span>{t('buttons.analyzing')}</span>
                </>
              ) : (
                <>
                  <Scan className="w-5 h-5 text-white" />
                  <span>{t('buttons.analyze')}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div className="flex-1 flex flex-col items-center justify-center min-h-[340px]">
          <div className="w-full h-full flex flex-col items-center justify-center">
            {!result && !error && !loading && (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                  <Leaf className="w-8 h-8 text-green-400" />
                </div>
                <p className="text-green-700">{t('results.placeholder')}</p>
              </div>
            )}

            {loading && (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto bg-green-200 rounded-2xl flex items-center justify-center mb-4">
                  <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
                </div>
                <p className="text-green-700 font-medium">{t('results.analyzing')}</p>
                <div className="mt-4 w-full bg-green-100 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-600 to-green-400 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-200 rounded-2xl p-6 w-full max-w-md mx-auto">
                <div className="flex items-start space-x-4">
                  <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-red-600 mb-2">{t('results.errorTitle')}</h3>
                    <p className="text-red-500 text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-6 w-full max-w-md mx-auto">
                <div className="bg-gradient-to-r from-green-100 to-green-200 border border-green-200 rounded-2xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center mr-4">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-green-800">{t('results.diseaseDetection')}</h3>
                      <p className="text-green-700">{result.disease || t('results.unknownCondition')}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                  <h4 className="font-bold text-green-700 mb-3 flex items-center">
                    <Leaf className="w-5 h-5 mr-2" />
                    {t('results.treatment')}
                  </h4>
                  <div className="bg-white rounded-xl p-4 border border-green-100">
                    <p className="text-green-800 leading-relaxed">
                      {result.treatment || t('results.noTreatment')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantDiseaseDetector;