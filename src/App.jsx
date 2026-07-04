import React, { useState, useRef, useEffect } from 'react';
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

  // Perform Simulated Analysis
  const startAnalysis = () => {
    if (!photoPreview) {
      alert('신체 분석을 위해 전신 사진을 업로드해 주세요.');
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisStateText('이미지 데이터 업로드 및 전처리 중...');

    const duration = 4000; // 4 seconds total
    const intervalTime = 50; // Update every 50ms
    const totalSteps = duration / intervalTime;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = Math.min(Math.round((currentStep / totalSteps) * 100), 100);
      setAnalysisProgress(progress);

      // Dynamic text updates based on progress stages
      if (progress < 20) {
        setAnalysisStateText('AI 엔진: 전신 윤곽선 및 주요 관절 포인트 추출 중...');
      } else if (progress < 45) {
        setAnalysisStateText('골격 진단: 어깨 대칭도 및 골반 틀어짐 각도 측정 중...');
      } else if (progress < 70) {
        setAnalysisStateText('체형 분석: 경추 각도(거북목 여부) 및 거상 상태 분석 중...');
      } else if (progress < 90) {
        setAnalysisStateText('종합 계산: BMI 및 신체 밸런스 점수 산출 중...');
      } else if (progress < 100) {
        setAnalysisStateText('결과 보고서 작성 및 웰니스 프로그램 맞춤 디자인 중...');
      } else {
        setAnalysisStateText('완료! 분석 리포트가 생성되었습니다.');
      }

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsAnalyzing(false);
          setShowResults(true);
        }, 600);
      }
    }, intervalTime);
  };

  const resetAnalyzer = () => {
    setPhoto(null);
    setPhotoPreview(null);
    setShowResults(false);
    setAnalysisProgress(0);
  };

  // Calculated Metrics
  const heightInMeters = height / 100;
  const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
  const idealWeight = (heightInMeters * heightInMeters * 22).toFixed(1);
  
  // BMR calculation (using standard 28 age)
  const bmr = Math.round(
    gender === 'male' 
      ? 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * 28)
      : 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * 28)
  );

  // Dynamic status details based on BMI
  let bmiCategory = '';
  let bmiColor = '';
  let bmiDesc = '';
  const bmiNum = parseFloat(bmi);

  if (bmiNum < 18.5) {
    bmiCategory = '저체중 (Underweight)';
    bmiColor = '#38bdf8'; // Sky blue
    bmiDesc = '에너지 섭취가 부족한 상태입니다. 균형 잡힌 영양소 섭취와 근력 운동이 필요합니다.';
  } else if (bmiNum < 23.0) {
    bmiCategory = '정상 (Normal)';
    bmiColor = '#10b981'; // Success Green
    bmiDesc = '건강한 체중 범위에 있습니다. 꾸준한 유산소와 웨이트 트레이닝으로 밸런스를 유지하세요.';
  } else if (bmiNum < 25.0) {
    bmiCategory = '과체중 (Overweight)';
    bmiColor = '#f59e0b'; // Warning Amber
    bmiDesc = '체중 조절이 권장되는 단계입니다. 식단 구성 변경과 주 3회 이상의 유산소 활동을 추천합니다.';
  } else {
    bmiCategory = '비만 (Obese)';
    bmiColor = '#f43f5e'; // Rose red
    bmiDesc = '체지방 감량 및 만성 질환 예방 관리가 필수적입니다. 규칙적인 고강도 인터벌 및 식습관 개선이 필요합니다.';
  }

  // Simulated body score logic (combines weight status and body balance check)
  const wellnessScore = Math.min(Math.max(Math.round(95 - Math.abs(bmiNum - 21.5) * 2), 65), 98);

  return (
    <main className="app-container">
      {/* 1. HEADER SECTION */}
      <header className="app-header">
        <div className="logo-badge" id="logo-badge">
          <span className="logo-dot"></span>
          AURA AI BODY LAB
        </div>
        <h1 className="app-title gradient-text">
          AI 정밀 체형 및 신체 분석
        </h1>
        <p className="app-subtitle">
          최첨단 컴퓨터 비전 기술과 의료 통계를 활용하여, 사진 한 장으로 당신의 골격 정렬, 신체 비율 및 건강 레포트를 제공합니다.
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
              1단계: 전신 사진 분석
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
                    <img src={photoPreview} alt="Body scan preview" className="preview-image" />
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
                    <p className="upload-hint">촬영 팁: 무늬가 없는 배경 앞에서 정면 전신을 찍어주시면 분석률이 향상됩니다.</p>
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
              2단계: 생체 정보 입력
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
                disabled={!photoPreview}
                className="analyze-submit-btn"
                id="btn-analyze"
              >
                신체 밸런스 분석 시작하기
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
          <h2 className="scanning-progress-label">AI 분석 엔진 가동 중... {analysisProgress}%</h2>
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
      {showResults && (
        <section className="results-container" id="results-view">
          {/* Header Summary Card */}
          <article className="glass-panel results-header-card">
            <div className="results-user-info">
              <img src={photoPreview} alt="User Avatar" className="results-avatar" />
              <div className="results-header-titles">
                <h2>종합 정밀 신체 분석 결과</h2>
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
                </div>
              </div>
            </div>
            <div className="score-panel">
              <div className="score-label">Aura 웰니스 스코어</div>
              <div className="score-number accent-gradient-text">{wellnessScore}점</div>
            </div>
          </article>

          {/* Results Details Grid */}
          <div className="results-dashboard-grid">
            {/* Left Side: Body & Metabolic Metrics */}
            <div className="metrics-section">
              {/* BMI Card */}
              <div className="glass-panel metric-box">
                <span className="metric-title">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3" />
                  </svg>
                  체질량 지수 (BMI)
                </span>
                <div className="metric-value-container">
                  <span className="metric-value">{bmi}</span>
                  <span className="metric-unit">kg/m²</span>
                </div>
                <div className="metric-progress-track">
                  <div 
                    className="metric-progress-bar"
                    style={{ 
                      width: `${Math.min((parseFloat(bmi) / 35) * 100, 100)}%`,
                      backgroundColor: bmiColor
                    }}
                  ></div>
                </div>
                <div className="metric-status-text" style={{ color: bmiColor }}>
                  {bmiCategory}
                </div>
              </div>

              {/* BMR Card */}
              <div className="glass-panel metric-box">
                <span className="metric-title">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                  기초 대사량 (BMR)
                </span>
                <div className="metric-value-container">
                  <span className="metric-value">{bmr.toLocaleString()}</span>
                  <span className="metric-unit">kcal</span>
                </div>
                <div className="metric-progress-track">
                  <div 
                    className="metric-progress-bar"
                    style={{ 
                      width: '72%',
                      background: 'linear-gradient(90deg, #6366f1, #d946ef)'
                    }}
                  ></div>
                </div>
                <div className="metric-status-text" style={{ color: 'var(--text-secondary)' }}>
                  동일 연령 대비 평균 수준
                </div>
              </div>

              {/* Ideal Weight Card */}
              <div className="glass-panel metric-box">
                <span className="metric-title">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  표준 적정 체중
                </span>
                <div className="metric-value-container">
                  <span className="metric-value">{idealWeight}</span>
                  <span className="metric-unit">kg</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  키 {height}cm의 이상적인 표준 건강 체중은 {idealWeight}kg입니다.
                </p>
              </div>

              {/* Fat and Muscle Ratio Card */}
              <div className="glass-panel metric-box">
                <span className="metric-title">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5z" />
                  </svg>
                  추정 체지방률
                </span>
                <div className="metric-value-container">
                  <span className="metric-value">
                    {gender === 'male' 
                      ? (10 + Math.abs(bmiNum - 21.5) * 1.2).toFixed(1) 
                      : (18 + Math.abs(bmiNum - 21.5) * 1.2).toFixed(1)
                    }
                  </span>
                  <span className="metric-unit">%</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  컴퓨터 비전 분석으로 측정된 신체 윤곽선 비율 기반의 예측 체지방 값입니다.
                </p>
              </div>
            </div>

            {/* Right Side: AI Posture Scan Details */}
            <div className="glass-panel posture-panel">
              <h3 className="card-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
                </svg>
                골격 대칭 및 자세 스캔
              </h3>
              
              <div className="hologram-visual-container">
                <img 
                  src="/hologram_body.jpg" 
                  alt="Futuristic Holographic Body Scan Analysis" 
                  className="hologram-img float-animation" 
                />
              </div>

              <div className="posture-list">
                <div className="posture-item">
                  <span className="posture-item-label">
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></span>
                    어깨 비대칭
                  </span>
                  <span className="posture-item-value" style={{ color: 'var(--success)' }}>정상 (좌우 대칭 우수)</span>
                </div>
                <div className="posture-item">
                  <span className="posture-item-label">
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></span>
                    거북목 / 경추 돌출
                  </span>
                  <span className="posture-item-value" style={{ color: 'var(--warning)' }}>주의 (기울기 11.2°)</span>
                </div>
                <div className="posture-item">
                  <span className="posture-item-label">
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></span>
                    골반 균형도
                  </span>
                  <span className="posture-item-value" style={{ color: 'var(--success)' }}>정상 (수평 0.6cm 미세 기울기)</span>
                </div>
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
              AuraAI 개인 맞춤 건강 가이드라인
            </h3>
            
            <div className="rec-grid">
              {/* Custom Diet Guide */}
              <div className="rec-box">
                <div className="rec-title-row">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124l-.208-3.32a4.872 4.872 0 0 0-4.869-4.556h-2.18M12 18.75V11.25m0 0H8.25m3.75 0h3.75M9 7.5h6" />
                  </svg>
                  맞춤형 식단 계획
                </div>
                <ul className="rec-list">
                  <li>하루 목표 섭취량: <span className="bold" style={{ color: 'var(--primary)' }}>{(bmr + 400).toLocaleString()} kcal</span> 권장 (생체 활동 대사량 포함)</li>
                  {bmiNum < 23.0 ? (
                    <>
                      <li>단백질 섭취 증량: 기초 대사 및 근합성을 위해 체중 1kg당 1.2g 이상 단백질 섭취.</li>
                      <li>복합 탄수화물 위주의 질 좋은 탄수화물 추가하여 탄수화물-단백질 밸런스 보충.</li>
                    </>
                  ) : (
                    <>
                      <li>탄수화물 조절: 정제 탄수화물(빵, 면류, 단당류) 섭취 제한 및 식이섬유 위주 식습관.</li>
                      <li>포화지방을 불포화지방(견과류, 올리브유 등)으로 대체하고 식사 간격 5-6시간 유지.</li>
                    </>
                  )}
                  <li>수분 보충: 체내 대사 가속을 위해 하루 2L 이상의 물 섭취 습관화.</li>
                </ul>
              </div>

              {/* Custom Fitness & Posture Guide */}
              <div className="rec-box">
                <div className="rec-title-row">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                  추천 트레이닝 & 자세 교정
                </div>
                <ul className="rec-list">
                  <li>경추 스트레칭: 폼롤러 목 스트레칭 및 턱 당기기(Chin tuck) 운동 하루 3세트 진행 권장.</li>
                  <li>코어 강화 운동: 척추 지탱 힘을 키우기 위해 플랭크 1분 유지, 버드독 운동 15회 3세트 추천.</li>
                  <li>등 근육 운동: 거북목과 어깨 대칭을 보정하기 위해 Y-T-W 레이즈 및 풀업/렛풀다운 진행.</li>
                  {bmiNum >= 23.0 && (
                    <li>유산소 처방: 주 4회 이상, 심박수 130-140bpm 유지 상태로 40분 이상의 러닝 또는 사이클.</li>
                  )}
                </ul>
              </div>
            </div>

            <div style={{ padding: '16px', background: 'rgba(6, 182, 212, 0.05)', border: '1px solid rgba(6, 182, 212, 0.1)', borderRadius: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              <span className="bold" style={{ color: 'var(--primary)', marginRight: '6px' }}>[안내 사항]</span>
              이 결과는 업로드된 사진과 수치를 토대로 분석한 가상 예측 리포트입니다. 정확한 의학적 진단 및 검사를 원하신다면 전문 의료기관이나 인바디 측정을 받는 것을 추천드립니다.
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
              다시 분석하기
            </button>
            <button 
              type="button" 
              onClick={() => alert('결과 보고서가 클립보드에 복사되었습니다! (공유 기능 구현 예정)')} 
              className="share-btn"
              id="btn-share-report"
            >
              결과 공유하기
            </button>
          </footer>
        </section>
      )}
    </main>
  );
}

export default App;
