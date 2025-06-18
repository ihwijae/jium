import React, { useState, useEffect, useRef } from 'react';
import './Evaluation.css';

function CompanySearchModal({ 
  isOpen, 
  onClose, 
  onSelect, 
  companies, 
  title, 
  excludeCompanyId 
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCompanies = searchTerm
    ? companies.filter(company => 
        (company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.businessNumber.includes(searchTerm)) &&
        company.id !== excludeCompanyId
      )
    : [];

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h4>{title}</h4>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <input
            type="text"
            className="form-control search-input"
            placeholder="회사명 또는 사업자번호로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          <div className="company-list">
            {filteredCompanies.map(company => (
              <div
                key={company.id}
                className="company-item"
                onClick={() => {
                  onSelect(company);
                  onClose();
                  setSearchTerm('');
                }}
              >
                <div className="company-name">{company.name}</div>
                <div className="company-number">{company.businessNumber}</div>
              </div>
            ))}
            {searchTerm && filteredCompanies.length === 0 && (
              <div className="no-results">검색 결과가 없습니다.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PpsUnder50Evaluation() {
  const [companies, setCompanies] = useState([]);
  const [selectedMainCompany, setSelectedMainCompany] = useState(null);
  const [selectedSubCompanies, setSelectedSubCompanies] = useState(Array(4).fill(null));
  const [scores, setScores] = useState(null);
  
  // 모달 상태 관리
  const [mainModalOpen, setMainModalOpen] = useState(false);
  const [subModalOpen, setSubModalOpen] = useState(Array(4).fill(false));

  // 공고 정보 상태
  const [noticeInfo, setNoticeInfo] = useState({
    noticeNumber: '',
    noticeName: '',
  });

  // 금액 정보 상태
  const [priceInfo, setPriceInfo] = useState({
    estimatedPrice: '',
    basePrice: '',
    constructionCapacityLimit: '',
    perfectPerformancePrice: '',
  });

  // 결과 섹션에 대한 ref 추가
  const scoresRef = useRef(null);

  // 금액 입력 처리 함수
  const handlePriceInput = (e, field) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value === '') {
      setPriceInfo(prev => ({ ...prev, [field]: '' }));
      return;
    }
    const numberValue = Number(value);
    setPriceInfo(prev => ({
      ...prev,
      [field]: numberValue.toLocaleString()
    }));
  };

  useEffect(() => {
    const mockCompanies = [
      { 
        id: 1, 
        name: '전기협력사1', 
        businessNumber: '123-45-67890',
        managementScore: 13.5, 
        performanceScore: 14.2 
      },
      { 
        id: 2, 
        name: '전기협력사2', 
        businessNumber: '123-45-67891',
        managementScore: 12.8, 
        performanceScore: 13.5 
      },
      { 
        id: 3, 
        name: '전기협력사3', 
        businessNumber: '123-45-67892',
        managementScore: 14.2, 
        performanceScore: 14.8 
      },
    ];
    setCompanies(mockCompanies);
  }, []);

  const handleMainCompanySelect = (company) => {
    setSelectedMainCompany(company);
  };

  const handleSubCompanySelect = (company, index) => {
    const newSubCompanies = [...selectedSubCompanies];
    newSubCompanies[index] = company;
    setSelectedSubCompanies(newSubCompanies);
  };

  const toggleSubModal = (index) => {
    const newSubModalOpen = [...subModalOpen];
    newSubModalOpen[index] = !newSubModalOpen[index];
    setSubModalOpen(newSubModalOpen);
  };

  const calculateScores = () => {
    if (!selectedMainCompany) {
      alert('대표사를 선택해주세요.');
      return;
    }

    const managementScore = selectedMainCompany.managementScore;
    const performanceScore = selectedMainCompany.performanceScore;
    const bidScore = 65;
    const totalScore = managementScore + performanceScore + bidScore;

    setScores({
      management: managementScore,
      performance: performanceScore,
      bid: bidScore,
      total: totalScore
    });

    // 점수 계산 후 결과 섹션으로 스크롤
    setTimeout(() => {
      scoresRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  return (
    <div className="evaluation-page">
      <h2>조달청 적격심사 (50억미만)</h2>
      <div className="evaluation-container">
        {/* 공고 정보 섹션 */}
        <div className="notice-info-section">
          <h3>공고 정보</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>공고번호</label>
              <input
                type="text"
                value={noticeInfo.noticeNumber}
                onChange={(e) => setNoticeInfo(prev => ({
                  ...prev,
                  noticeNumber: e.target.value
                }))}
                placeholder="공고번호를 입력하세요"
              />
            </div>
            <div className="info-item">
              <label>공고명</label>
              <input
                type="text"
                value={noticeInfo.noticeName}
                onChange={(e) => setNoticeInfo(prev => ({
                  ...prev,
                  noticeName: e.target.value
                }))}
                placeholder="공고명을 입력하세요"
              />
            </div>
          </div>
        </div>

        {/* 금액 정보 섹션 */}
        <div className="price-info-section">
          <h3>금액 정보</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>추정가격</label>
              <div className="price-input-wrapper">
                <input
                  type="text"
                  value={priceInfo.estimatedPrice}
                  onChange={(e) => handlePriceInput(e, 'estimatedPrice')}
                  placeholder="0"
                />
                <span className="price-unit">원</span>
              </div>
            </div>
            <div className="info-item">
              <label>기초금액</label>
              <div className="price-input-wrapper">
                <input
                  type="text"
                  value={priceInfo.basePrice}
                  onChange={(e) => handlePriceInput(e, 'basePrice')}
                  placeholder="0"
                />
                <span className="price-unit">원</span>
              </div>
            </div>
            <div className="info-item">
              <label>시공능력제한액</label>
              <div className="price-input-wrapper">
                <input
                  type="text"
                  value={priceInfo.constructionCapacityLimit}
                  onChange={(e) => handlePriceInput(e, 'constructionCapacityLimit')}
                  placeholder="0"
                />
                <span className="price-unit">원</span>
              </div>
            </div>
            <div className="info-item">
              <label>실적만점금액</label>
              <div className="price-input-wrapper">
                <input
                  type="text"
                  value={priceInfo.perfectPerformancePrice}
                  onChange={(e) => handlePriceInput(e, 'perfectPerformancePrice')}
                  placeholder="0"
                />
                <span className="price-unit">원</span>
              </div>
            </div>
          </div>
        </div>

        <div className="evaluation-grid">
          {/* 왼쪽 섹션 - 대표사 선택 */}
          <div className="main-company-section">
            <h3>대표사 선택</h3>
            <div className="company-select-box">
              <div className="selected-company">
                {selectedMainCompany ? (
                  <>
                    <div className="company-info">
                      <div className="company-name">{selectedMainCompany.name}</div>
                      <div className="company-number">{selectedMainCompany.businessNumber}</div>
                    </div>
                    <button 
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => setSelectedMainCompany(null)}
                    >
                      변경
                    </button>
                  </>
                ) : (
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => setMainModalOpen(true)}
                  >
                    대표사 검색
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 오른쪽 섹션 - 구성사 선택 */}
          <div className="sub-companies-section">
            <h3>구성사 선택</h3>
            {selectedSubCompanies.map((subCompany, index) => (
              <div className="company-select-box" key={index}>
                <div className="selected-company">
                  {subCompany ? (
                    <>
                      <div className="company-info">
                        <div className="company-name">{subCompany.name}</div>
                        <div className="company-number">{subCompany.businessNumber}</div>
                      </div>
                      <button 
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => {
                          const newSubCompanies = [...selectedSubCompanies];
                          newSubCompanies[index] = null;
                          setSelectedSubCompanies(newSubCompanies);
                        }}
                      >
                        변경
                      </button>
                    </>
                  ) : (
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => toggleSubModal(index)}
                    >
                      구성사 {index + 1} 검색
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button 
          className="btn btn-primary mt-4"
          onClick={calculateScores}
        >
          점수 산출
        </button>

        {scores && (
          <div className="scores-section mt-4" ref={scoresRef}>
            <h3>평가 결과</h3>
            <div className="score-card">
              <div className="score-item">
                <label>경영상태</label>
                <span className="score-value">{scores.management.toFixed(2)}점</span>
              </div>
              <div className="score-item">
                <label>시공실적</label>
                <span className="score-value">{scores.performance.toFixed(2)}점</span>
              </div>
              <div className="score-item">
                <label>입찰가격</label>
                <span className="score-value">{scores.bid.toFixed(2)}점</span>
              </div>
              <div className="score-item total">
                <label>총점</label>
                <span className="score-value">{scores.total.toFixed(2)}점</span>
              </div>
            </div>
          </div>
        )}

        {/* 모달 컴포넌트들 */}
        <CompanySearchModal
          isOpen={mainModalOpen}
          onClose={() => setMainModalOpen(false)}
          onSelect={handleMainCompanySelect}
          companies={companies}
          title="대표사 검색"
        />

        {subModalOpen.map((isOpen, index) => (
          <CompanySearchModal
            key={index}
            isOpen={isOpen}
            onClose={() => toggleSubModal(index)}
            onSelect={(company) => handleSubCompanySelect(company, index)}
            companies={companies}
            title={`구성사 ${index + 1} 검색`}
            excludeCompanyId={selectedMainCompany?.id}
          />
        ))}
      </div>
    </div>
  );
}

export default PpsUnder50Evaluation; 