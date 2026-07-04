import React, { useState, useRef } from 'react';
import './App.css';

function App() {
  // Input form states
  const [height, setHeight] = useState(172);
  const [weight, setWeight] = useState(68);
  const [gender, setGender] = useState('male');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  
  // App flow states
  const [isDragOver, setIsDragOver] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStateText, setAnalysisStateText] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  const fileInputRef = useRef(null);

  // File Upload Handlers
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    if (file.type.startsWith('image/')) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('이미지 파일만 업로드할 수 있습니다.');
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const removePhoto = (e) => {
    e.stopPropagation();
    setPhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Perform Actual OpenAI Style Consulting Analysis
  const startAnalysis = async () => {
    if (!photo) {
      alert('스타일 분석을 위해 전신 사진을 업로드해 주세요.');
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisStateText('이미지 업로드 및 분석 준비 중...');
    setErrorMsg('');

    // Fake progress animation
    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev < 30) {
          setAnalysisStateText('AI 엔진: 신체 실루엣 및 비율 검출 중...');
          return prev + 1.5;
        } else if (prev < 60) {
          setAnalysisStateText('체형 분석: 키, 몸무게 대비 골격 밸런스 진단 중...');
          return prev + 1;
        } else if (prev < 85) {
          setAnalysisStateText('스타일링 솔루션: 맞춤형 룩북 및 추천 코디 조합 중...');
          return prev + 0.8;
        } else if (prev < 95) {
          setAnalysisStateText('퍼스널 컬러 매칭 및 액세서리 제안 구성 중...');
          return prev + 0.3;
        }
        return prev;
      });
    }, 100);

    try {
      const formData = new FormData();
      formData.append('photo', photo);
      formData.append('height', height);
      formData.append('weight', weight);
      formData.append('gender', gender);

      const response = await fetch('/api/consult', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || '스타일 분석에 실패했습니다.');
      }

      const result = await response.json();
      setAnalysisResult(result);

      clearInterval(progressInterval);
      setAnalysisProgress(100);
      setAnalysisStateText('완료! 맞춤 스타일 보고서가 생성되었습니다.');

      setTimeout(() => {
        setIsAnalyzing(false);
        setShowResults(true);
      }, 800);

    } catch (err) {
      clearInterval(progressInterval);
      setIsAnalyzing(false);
      setErrorMsg(err.message);
      alert(`에러: ${err.message}`);
    }
  };

  const resetAnalyzer = () => {
    setPhoto(null);
    setPhotoPreview(null);
    setShowResults(false);
    setAnalysisResult(null);
    setErrorMsg('');
    setAnalysisProgress(0);
  };

  // Calculated Basic Metrics for extra context
  const heightInMeters = height / 100;
  const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
  const idealWeight = (heightInMeters * heightInMeters * 22).toFixed(1);
  const bmiNum = parseFloat(bmi);

  let bmiCategory = '';
  let bmiColor = '';
  if (bmiNum < 18.5) {
    bmiCategory = '저체중';
    bmiColor = '#38bdf8';
  } else if (bmiNum < 23.0) {
    bmiCategory = '정상';
    bmiColor = '#10b981';
  } else if (bmiNum < 25.0) {
    bmiCategory = '과체중';
    bmiColor = '#f59e0b';
  } else {
    bmiCategory = '비만';
    bmiColor = '#f43f5e';
  }

  // Combined score combining style compatibility
  const wellnessScore = Math.min(Math.max(Math.round(95 - Math.abs(bmiNum - 21.5) * 1.5), 70), 99);

  return (
    <main className="app-container">
      {/* 1. HEADER SECTION */}
      <header className="app-header">
        <div className="logo-badge" id="logo-badge">
          <span className="logo-dot"></span>
          AURA AI STYLE LAB
        </div>
        <h1 className="app-title gradient-text">
          AI 정밀 체형 및 스타일 컨설팅
        </h1>
        <p className="app-subtitle">
          최첨단 멀티모달 AI 분석 기술을 활용하여, 사진 한 장으로 당신의 체형을 진단하고 가장 돋보이게 만들 맞춤 패션 솔루션을 제안합니다.
        </p>
      </header>

      {/* 2. CORE FLOW: FORM ENTRY -> SCANNING -> RESULTS */}
      {!isAnalyzing && !showResults && (
        <section className="analyzer-grid">
          {/* PHOTO UPLOAD CARD */}
          <article className="glass-panel form-card">
            <h2 className="card-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
              </svg>
              1단계: 전신 사진 업로드
            </h2>
            <div className="upload-container">
              <div 
                className={`dropzone ${isDragOver ? 'active' : ''}`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
                id="photo-dropzone"
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="file-input"
                  id="photo-file-input"
                />
                
                {photoPreview ? (
                  <div className="image-preview-wrapper">
                    <img src={photoPreview} alt="Style profile preview" className="preview-image" />
                    <div className="image-overlay">
                      <button 
                        type="button" 
                        onClick={removePhoto} 
                        className="change-image-btn"
                        id="btn-remove-photo"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                        사진 변경하기
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="upload-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                      </svg>
                    </div>
                    <p className="upload-text">마우스로 전신 사진을 드래그하거나 클릭하여 업로드</p>
                    <p className="upload-hint">촬영 팁: 무늬가 없는 배경 앞에서 옷 실루엣이 잘 드러나도록 서서 촬영하면 더 정확한 분석이 가능합니다.</p>
                  </>
                )}
              </div>
            </div>
          </article>

          {/* METRICS ENTRY CARD */}
          <article className="glass-panel form-card">
            <h2 className="card-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
              </svg>
              2단계: 신체 정보 입력
            </h2>
            
            {/* Gender Select */}
            <div className="input-group">
              <span className="input-label-container">
                <label className="input-label">성별 (Gender)</label>
              </span>
              <div className="gender-select">
                <button 
                  type="button" 
                  className={`gender-btn ${gender === 'male' ? 'active male' : ''}`}
                  onClick={() => setGender('male')}
                  id="btn-gender-male"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 1 1 .518 1.4l-.041.02a.75.75 0 0 1-.518-1.4zM21 3h-6a.75.75 0 0 0 0 1.5h3.69l-3.97 3.97a7.5 7.5 0 1 0 1.06 1.06l3.97-3.97V9.25a.75.75 0 0 0 1.5 0V3z" />
                  </svg>
                  남성
                </button>
                <button 
                  type="button" 
                  className={`gender-btn ${gender === 'female' ? 'active female' : ''}`}
                  onClick={() => setGender('female')}
                  id="btn-gender-female"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15zM12 17.25v4.5M9.75 19.5h4.5" />
                  </svg>
                  여성
                </button>
              </div>
            </div>

            {/* Height Slider & Input */}
            <div className="input-group">
              <span className="input-label-container">
                <label htmlFor="height-slider" className="input-label">신장 (Height)</label>
                <span className="input-value-badge">{height} cm</span>
              </span>
              <div className="slider-input-wrapper">
                <input 
                  type="range" 
                  id="height-slider"
                  min="130" 
                  max="210" 
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="range-slider"
                />
                <input 
                  type="number" 
                  id="height-number"
                  min="130" 
                  max="210" 
                  value={height}
                  onChange={(e) => setHeight(Math.max(130, Math.min(210, Number(e.target.value))))}
                  className="number-input"
                />
              </div>
            </div>

            {/* Weight Slider & Input */}
            <div className="input-group">
              <span className="input-label-container">
                <label htmlFor="weight-slider" className="input-label">체중 (Weight)</label>
                <span className="input-value-badge">{weight} kg</span>
              </span>
              <div className="slider-input-wrapper">
                <input 
                  type="range" 
                  id="weight-slider"
                  min="35" 
                  max="140" 
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="range-slider"
                />
                <input 
                  type="number" 
                  id="weight-number"
                  min="35" 
                  max="140" 
                  value={weight}
                  onChange={(e) => setWeight(Math.max(35, Math.min(140, Number(e.target.value))))}
                  className="number-input"
                />
              </div>
            </div>

            <div className="flex-grow"></div>

            {/* Analyze Action Button */}
            <div className="action-container">
              <button 
                type="button" 
                onClick={startAnalysis}
                disabled={!photoPreview || isAnalyzing}
                className="analyze-submit-btn"
                id="btn-analyze"
              >
                AI 스타일 컨설팅 분석 시작
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.59 8.37m5.84 3.42a14.98 14.98 0 0 0-6.16 12.12c-.22 2.15-2.2 3.51-4.22 3.12a2.02 2.02 0 0 1-1.6-1.6c-.39-2.02.97-4 3.12-4.22a14.975 14.975 0 0 0 8.86-9.42ZM20.13 3.87l-2.26 2.26m0 0a3 3 0 1 1-4.24-4.24l2.26-2.26m0 0a14.94 14.94 0 0 0-2.26 2.26m0 0L8.03 14.37" />
                </svg>
              </button>
            </div>
          </article>
        </section>
      )}

      {/* 3. SIMULATED AI SCANNING LAYER */}
      {isAnalyzing && (
        <section className="glass-panel scanning-card" id="scanning-view">
          <div className="scanning-visual">
            <div className="pulse-ring"></div>
            <div className="scanner-loader"></div>
            <img src={photoPreview} alt="Analyzing preview" className="scan-image-preview" />
            <div className="scanline"></div>
          </div>
          <h2 className="scanning-progress-label">AI 스타일리스트 분석 중... {Math.round(analysisProgress)}%</h2>
          <p className="scanning-subtext">{analysisStateText}</p>
          <div className="scanning-bar-container">
            <div 
              className="scanning-bar" 
              style={{ width: `${analysisProgress}%` }}
            ></div>
          </div>
        </section>
      )}

      {/* 4. PREMIUM RESULTS DASHBOARD */}
      {showResults && analysisResult && (
        <section className="results-container" id="results-view">
          {/* Header Summary Card */}
          <article className="glass-panel results-header-card">
            <div className="results-user-info">
              <img src={photoPreview} alt="User Avatar" className="results-avatar" />
              <div className="results-header-titles">
                <h2>AI 맞춤 스타일 컨설팅 결과</h2>
                <div className="results-header-metadata">
                  <span className="results-metadata-item">
                    <span className="bold">{gender === 'male' ? '남성' : '여성'}</span>
                  </span>
                  <span className="results-metadata-item">
                    신장: <span className="bold">{height} cm</span>
                  </span>
                  <span className="results-metadata-item">
                    체중: <span className="bold">{weight} kg</span>
                  </span>
                  <span className="results-metadata-item">
                    BMI: <span className="bold" style={{ color: bmiColor }}>{bmi} ({bmiCategory})</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="score-panel">
              <div className="score-label">스타일 매칭 점수</div>
              <div className="score-number accent-gradient-text">{wellnessScore}점</div>
            </div>
          </article>

          {/* Results Details Grid */}
          <div className="results-dashboard-grid">
            {/* Left Side: Body Type & Analysis */}
            <div className="glass-panel posture-panel">
              <h3 className="card-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
                </svg>
                골격 및 체형 정밀 진단
              </h3>
              
              <div className="body-type-badge-container">
                <div className="body-type-label">판정 체형</div>
                <div className="body-type-value">{analysisResult.bodyType}</div>
              </div>

              <div className="body-analysis-text">
                <p>{analysisResult.bodyAnalysis}</p>
              </div>

              <div className="posture-list" style={{ marginTop: '20px' }}>
                <div className="posture-item">
                  <span className="posture-item-label">
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></span>
                    비율 밸런스
                  </span>
                  <span className="posture-item-value" style={{ color: 'var(--success)' }}>매우 양호</span>
                </div>
                <div className="posture-item">
                  <span className="posture-item-label">
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></span>
                    적정 표준 체중
                  </span>
                  <span className="posture-item-value">{idealWeight} kg</span>
                </div>
              </div>
            </div>

            {/* Right Side: Colors & Styling Tips */}
            <div className="glass-panel posture-panel">
              <h3 className="card-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122A3 3 0 0 0 10.5 17.75h.008a3 3 0 0 0 2.247-1.026l5.772-5.772a3.75 3.75 0 1 0-5.304-5.304l-5.772 5.772a3 3 0 0 0-1.026 2.247v.008c0 .37.06.726.173 1.06m7.53-7.53l-5.772 5.772m0 0a3.01 3.01 0 0 0-2.164 2.164m0 0a3 3 0 1 0 5.304 5.304l5.772-5.772m-5.772-5.772L10.5 4.5" />
                </svg>
                컬러 및 스타일링 솔루션
              </h3>
              
              <div className="color-section-box">
                <div className="color-section-title">추천 퍼스널 컬러 & 배색</div>
                <p className="color-recommend-text">{analysisResult.colorRecommendations}</p>
              </div>

              <div className="styling-tip-box">
                <div className="styling-tip-title">스타일리스트 핵심 코디 팁</div>
                <p className="styling-tip-text">{analysisResult.tip}</p>
              </div>
            </div>
          </div>

          {/* AI Tailored Recommendation Box */}
          <article className="glass-panel rec-card">
            <h3 className="card-title" style={{ borderBottom: 'none', marginBottom: '20px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21L7.188 15.904L2 15L7.188 14.096L9 9L9.813 14.096L15 15L9.813 15.904Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.071 4.929a10 10 0 0 0-14.142 0M12 12V3" />
              </svg>
              AuraAI 개인 맞춤형 스타일링 가이드라인
            </h3>
            
            <div className="rec-grid">
              {/* Recommended Styles */}
              <div className="rec-box">
                <div className="rec-title-row" style={{ color: 'var(--success)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  베스트 스타일 제안 (BEST CODES)
                </div>
                <div className="style-list">
                  {analysisResult.recommendedStyles.map((style, idx) => (
                    <div key={idx} className="style-recommend-item">
                      <div className="style-recommend-name">{style.title}</div>
                      <div className="style-recommend-desc">{style.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Avoid Styles */}
              <div className="rec-box">
                <div className="rec-title-row" style={{ color: 'var(--warning)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  워스트 스타일 가이드 (AVOID)
                </div>
                <div className="style-list">
                  {analysisResult.avoidStyles.map((style, idx) => (
                    <div key={idx} className="style-recommend-item avoid">
                      <div className="style-recommend-name">{style.title}</div>
                      <div className="style-recommend-desc">{style.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ padding: '16px', background: 'rgba(6, 182, 212, 0.05)', border: '1px solid rgba(6, 182, 212, 0.1)', borderRadius: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              <span className="bold" style={{ color: 'var(--primary)', marginRight: '6px' }}>[안내 사항]</span>
              이 결과는 업로드된 사진과 사용자의 키, 몸무게 정보 및 AI의 패션 이미지 인식 학습 데이터를 토대로 작성된 스타일 가이드라인입니다. 나다운 개성 넘치는 패션을 완성하는 데 유용하게 참고해 주세요.
            </div>
          </article>

          {/* Bottom Footer Actions */}
          <footer className="results-footer">
            <button 
              type="button" 
              onClick={resetAnalyzer} 
              className="reset-btn"
              id="btn-reanalyze"
            >
              다른 스타일 진단하기
            </button>
            <button 
              type="button" 
              onClick={() => {
                const text = `[AuraAI 스타일 컨설팅 리포트]\n\n체형: ${analysisResult.bodyType}\n\n추천 스타일:\n${analysisResult.recommendedStyles.map(s => `- ${s.title}: ${s.description}`).join('\n')}\n\n어울리는 컬러:\n${analysisResult.colorRecommendations}`;
                navigator.clipboard.writeText(text);
                alert('스타일 보고서 텍스트가 클립보드에 복사되었습니다!');
              }} 
              className="share-btn"
              id="btn-share-report"
            >
              보고서 텍스트 복사
            </button>
          </footer>
        </section>
      )}
    </main>
  );
}

export default App;
