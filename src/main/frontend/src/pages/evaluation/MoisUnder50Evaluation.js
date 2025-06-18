// import React, { useState, useEffect, useRef } from 'react';
// import './Evaluation.css';

// // CompanySearchModal 컴포넌트는 변경사항이 없습니다.
// function CompanySearchModal({ 
//   isOpen, 
//   onClose, 
//   onSelect, 
//   companies, 
//   title, 
//   excludeCompanyIds // 여러 ID를 받을 수 있도록 이름 변경
// }) {
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     if (!isOpen) {
//       setSearchTerm('');
//     }
//   }, [isOpen]);

//   const filteredCompanies = searchTerm
//     ? companies.filter(company => 
//         (company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         company.businessNumber.includes(searchTerm)) &&
//         !excludeCompanyIds.includes(company.id) // excludeCompanyId -> excludeCompanyIds로 변경
//       )
//     : [];

//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <div className="modal-header">
//           <h4>{title}</h4>
//           <button className="close-button" onClick={onClose}>×</button>
//         </div>
//         <div className="modal-body">
//           <input
//             type="text"
//             className="form-control search-input"
//             placeholder="회사명 또는 사업자번호로 검색"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             autoFocus
//           />
//           <div className="company-list">
//             {filteredCompanies.map(company => (
//               <div
//                 key={company.id}
//                 className="company-item"
//                 onClick={() => {
//                   onSelect(company);
//                   onClose();
//                 }}
//               >
//                 <div className="company-name">{company.name}</div>
//                 <div className="company-number">{company.businessNumber}</div>
//               </div>
//             ))}
//             {searchTerm && filteredCompanies.length === 0 && (
//               <div className="no-results">검색 결과가 없습니다.</div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// function MoisUnder50Evaluation() {
//   const [companies, setCompanies] = useState([]);
  
//   // --- ⬇️ 1. 상태 구조 변경 ---
//   // 이제 null 또는 { company: { ... }, ratio: '' } 형태의 객체를 저장합니다.
//   const [selectedMainCompany, setSelectedMainCompany] = useState(null);
//   const [selectedSubCompanies, setSelectedSubCompanies] = useState(Array(4).fill(null));
//   // --- ⬆️ 1. 상태 구조 변경 ---

//   const [scores, setScores] = useState(null);
  
//   const [mainModalOpen, setMainModalOpen] = useState(false);
//   const [subModalOpen, setSubModalOpen] = useState(Array(4).fill(false));

//   const [noticeInfo, setNoticeInfo] = useState({ noticeNumber: '', noticeName: '' });
//   const [priceInfo, setPriceInfo] = useState({
//     estimatedPrice: '',
//     basePrice: '',
//     constructionCapacityLimit: '',
//     perfectPerformancePrice: '',
//   });

//   const scoresRef = useRef(null);

//   const handlePriceInput = (e, field) => {
//     const value = e.target.value.replace(/[^0-9]/g, '');
//     const numberValue = value === '' ? '' : Number(value).toLocaleString();
//     setPriceInfo(prev => ({ ...prev, [field]: numberValue }));
//   };

//   useEffect(() => {
//     const numericString = priceInfo.estimatedPrice.replace(/,/g, '');
//     if (numericString === '') {
//       setPriceInfo(prev => ({ ...prev, perfectPerformancePrice: '' }));
//       return;
//     }
//     const estimatedPriceNumber = Number(numericString);
//     const calculatedPrice = estimatedPriceNumber * 0.8;
//     setPriceInfo(prev => ({
//       ...prev,
//       perfectPerformancePrice: calculatedPrice.toLocaleString()
//     }));
//   }, [priceInfo.estimatedPrice]);

//   useEffect(() => {
//     const mockCompanies = [
//       { id: 1, name: '전기협력사1', businessNumber: '123-45-67890', managementScore: 13.5, performanceScore: 14.2 },
//       { id: 2, name: '전기협력사2', businessNumber: '123-45-67891', managementScore: 12.8, performanceScore: 13.5 },
//       { id: 3, name: '전기협력사3', businessNumber: '123-45-67892', managementScore: 14.2, performanceScore: 14.8 },
//       { id: 4, name: '건설파트너A', businessNumber: '222-11-33333', managementScore: 14.0, performanceScore: 14.0 },
//       { id: 5, name: '(주)대한전력', businessNumber: '111-22-99999', managementScore: 13.9, performanceScore: 14.5 },
//     ];
//     setCompanies(mockCompanies);
//   }, []);

//   // --- ⬇️ 2. 핸들러 함수 수정 및 추가 ---

//   // 대표사 선택 시, { company, ratio } 객체로 상태를 업데이트합니다.
//   const handleMainCompanySelect = (company) => {
//     setSelectedMainCompany({ company: company, ratio: '' });
//   };

//   // 구성사 선택 시, 배열의 해당 인덱스를 { company, ratio } 객체로 업데이트합니다.
//   const handleSubCompanySelect = (company, index) => {
//     const newSubCompanies = [...selectedSubCompanies];
//     newSubCompanies[index] = { company: company, ratio: '' };
//     setSelectedSubCompanies(newSubCompanies);
//   };
  
//   // 대표사 지분율 입력 핸들러
//   const handleMainRatioChange = (e) => {
//     const value = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 입력받도록 처리
//     if (Number(value) > 100) return; // 100 초과 입력 방지
//     setSelectedMainCompany(prev => ({ ...prev, ratio: value }));
//   };

//   // 구성사 지분율 입력 핸들러
//   const handleSubRatioChange = (e, index) => {
//     const value = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 입력받도록 처리
//     if (Number(value) > 100) return; // 100 초과 입력 방지
//     const newSubCompanies = [...selectedSubCompanies];
//     if (newSubCompanies[index]) {
//       newSubCompanies[index] = { ...newSubCompanies[index], ratio: value };
//       setSelectedSubCompanies(newSubCompanies);
//     }
//   };

//   // --- ⬆️ 2. 핸들러 함수 수정 및 추가 ---

//   const toggleSubModal = (index) => {
//     const newSubModalOpen = [...subModalOpen];
//     newSubModalOpen[index] = !newSubModalOpen[index];
//     setSubModalOpen(newSubModalOpen);
//   };

//   const calculateScores = () => {
//     // 이제 selectedMainCompany.company 로 접근해야 합니다.
//     if (!selectedMainCompany?.company) {
//       alert('대표사를 선택해주세요.');
//       return;
//     }
    
//     // (향후 지분율을 계산에 활용할 경우를 대비하여)
//     // console.log("대표사 지분율:", selectedMainCompany.ratio);
//     // selectedSubCompanies.forEach((sub, i) => {
//     //   if(sub?.company) console.log(`구성사${i+1} 지분율:`, sub.ratio);
//     // });

//     const managementScore = selectedMainCompany.company.managementScore;
//     const performanceScore = selectedMainCompany.company.performanceScore;
//     const bidScore = 65;
//     const totalScore = managementScore + performanceScore + bidScore;

//     setScores({ management: managementScore, performance: performanceScore, bid: bidScore, total: totalScore });
    
//     setTimeout(() => {
//       scoresRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     }, 100);
//   };

//   // 모달에서 제외할 회사 ID 목록을 만듭니다.
//   const getExcludedIds = (currentIndex = -1) => {
//     const ids = [];
//     if (selectedMainCompany?.company?.id) {
//       ids.push(selectedMainCompany.company.id);
//     }
//     selectedSubCompanies.forEach((sub, index) => {
//       if (sub?.company?.id && index !== currentIndex) {
//         ids.push(sub.company.id);
//       }
//     });
//     return ids;
//   }

//   return (
//     <div className="evaluation-page">
//       <h2>행안부 적격심사 (50억미만)</h2>
//       <div className="evaluation-container">
//         {/* 공고/금액 정보 섹션 (변경 없음) ... */}
//         <div className="notice-info-section">
//           <h3>공고 정보</h3>
//           <div className="info-grid">
//             <div className="info-item"><label>공고번호</label><input type="text" value={noticeInfo.noticeNumber} onChange={(e) => setNoticeInfo(prev => ({ ...prev, noticeNumber: e.target.value }))} placeholder="공고번호를 입력하세요"/></div>
//             <div className="info-item"><label>공고명</label><input type="text" value={noticeInfo.noticeName} onChange={(e) => setNoticeInfo(prev => ({ ...prev, noticeName: e.target.value }))} placeholder="공고명을 입력하세요"/></div>
//           </div>
//         </div>
//         <div className="price-info-section">
//           <h3>금액 정보</h3>
//           <div className="info-grid">
//             <div className="info-item"><label>추정가격</label><div className="price-input-wrapper"><input type="text" value={priceInfo.estimatedPrice} onChange={(e) => handlePriceInput(e, 'estimatedPrice')} placeholder="0"/><span className="price-unit">원</span></div></div>
//             <div className="info-item"><label>기초금액</label><div className="price-input-wrapper"><input type="text" value={priceInfo.basePrice} onChange={(e) => handlePriceInput(e, 'basePrice')} placeholder="0"/><span className="price-unit">원</span></div></div>
//             <div className="info-item"><label>시공능력제한액</label><div className="price-input-wrapper"><input type="text" value={priceInfo.constructionCapacityLimit} onChange={(e) => handlePriceInput(e, 'constructionCapacityLimit')} placeholder="0"/><span className="price-unit">원</span></div></div>
//             <div className="info-item"><label>실적만점금액 (자동계산)</label><div className="price-input-wrapper"><input type="text" value={priceInfo.perfectPerformancePrice} placeholder="0" readOnly className="auto-calculated"/><span className="price-unit">원</span></div></div>
//           </div>
//         </div>


//         <div className="evaluation-grid">
//           {/* --- ⬇️ 3. JSX(UI) 수정 --- */}
//           <div className="main-company-section">
//             <h3>대표사 선택</h3>
//             <div className="company-select-box">
//               <div className="selected-company">
//                 {selectedMainCompany?.company ? (
//                   <>
//                     <div className="company-info-wrapper">
//                       <div className="company-info">
//                         <div className="company-name">{selectedMainCompany.company.name}</div>
//                         <div className="company-number">{selectedMainCompany.company.businessNumber}</div>
//                       </div>
//                       <div className="ratio-input-wrapper">
//                         <input
//                           type="text"
//                           className="ratio-input"
//                           placeholder="지분율"
//                           value={selectedMainCompany.ratio}
//                           onChange={handleMainRatioChange}
//                         />
//                         <span className="percent-sign">%</span>
//                       </div>
//                     </div>
//                     <button 
//                       className="btn btn-outline-secondary btn-sm"
//                       onClick={() => setSelectedMainCompany(null)}
//                     >
//                       변경
//                     </button>
//                   </>
//                 ) : (
//                   <button 
//                     className="btn btn-outline-primary"
//                     onClick={() => setMainModalOpen(true)}
//                   >
//                     대표사 검색
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
          
//           <div className="sub-companies-section">
//             <h3>구성사 선택</h3>
//             {selectedSubCompanies.map((subCompany, index) => (
//               <div className="company-select-box" key={index}>
//                 <div className="selected-company">
//                   {subCompany?.company ? (
//                     <>
//                       <div className="company-info-wrapper">
//                         <div className="company-info">
//                           <div className="company-name">{subCompany.company.name}</div>
//                           <div className="company-number">{subCompany.company.businessNumber}</div>
//                         </div>
//                         <div className="ratio-input-wrapper">
//                            <input
//                             type="text"
//                             className="ratio-input"
//                             placeholder="지분율"
//                             value={subCompany.ratio}
//                             onChange={(e) => handleSubRatioChange(e, index)}
//                           />
//                           <span className="percent-sign">%</span>
//                         </div>
//                       </div>
//                       <button 
//                         className="btn btn-outline-secondary btn-sm"
//                         onClick={() => {
//                           const newSubCompanies = [...selectedSubCompanies];
//                           newSubCompanies[index] = null;
//                           setSelectedSubCompanies(newSubCompanies);
//                         }}
//                       >
//                         변경
//                       </button>
//                     </>
//                   ) : (
//                     <button 
//                       className="btn btn-outline-primary"
//                       onClick={() => toggleSubModal(index)}
//                     >
//                       구성사 {index + 1} 검색
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//            {/* --- ⬆️ 3. JSX(UI) 수정 --- */}
//         </div>

//         <button className="btn btn-primary mt-4" onClick={calculateScores}>
//           점수 산출
//         </button>

//         {scores && (
//           <div className="scores-section mt-4" ref={scoresRef}>
//             <h3>평가 결과</h3>
//             <div className="score-card">
//               <div className="score-item"><label>경영상태</label><span className="score-value">{scores.management.toFixed(2)}점</span></div>
//               <div className="score-item"><label>시공실적</label><span className="score-value">{scores.performance.toFixed(2)}점</span></div>
//               <div className="score-item"><label>입찰가격</label><span className="score-value">{scores.bid.toFixed(2)}점</span></div>
//               <div className="score-item total"><label>총점</label><span className="score-value">{scores.total.toFixed(2)}점</span></div>
//             </div>
//           </div>
//         )}

//         {/* 모달 컴포넌트들 */}
//         <CompanySearchModal
//           isOpen={mainModalOpen}
//           onClose={() => setMainModalOpen(false)}
//           onSelect={handleMainCompanySelect}
//           companies={companies}
//           title="대표사 검색"
//           excludeCompanyIds={getExcludedIds()} // 이미 선택된 회사들은 검색 결과에서 제외
//         />

//         {subModalOpen.map((isOpen, index) => (
//           <CompanySearchModal
//             key={index}
//             isOpen={isOpen}
//             onClose={() => toggleSubModal(index)}
//             onSelect={(company) => handleSubCompanySelect(company, index)}
//             companies={companies}
//             title={`구성사 ${index + 1} 검색`}
//             excludeCompanyIds={getExcludedIds(index)} // 본인을 제외한 다른 선택된 회사들은 제외
//           />
//         ))}

//       </div>
//     </div>
//   );

  
// }

// export default MoisUnder50Evaluation;







import React, { useState, useEffect, useRef } from 'react';
import './Evaluation.css';

// CompanySearchModal 컴포넌트는 변경사항이 없습니다.
function CompanySearchModal({ 
  isOpen, 
  onClose, 
  onSelect, 
  companies, 
  title, 
  excludeCompanyIds 
}) {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  const filteredCompanies = searchTerm
    ? companies.filter(company => 
        (company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.businessNumber.includes(searchTerm)) &&
        !excludeCompanyIds.includes(company.id)
      )
    : [];

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h4>{title}</h4>
          <button className="close-button" onClick={onClose}>×</button>
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


function MoisUnder50Evaluation() {
  const [companies, setCompanies] = useState([]);
  
  const [selectedMainCompany, setSelectedMainCompany] = useState(null);
  const [selectedSubCompanies, setSelectedSubCompanies] = useState(Array(4).fill(null));

  const [scores, setScores] = useState(null);
  
  const [mainModalOpen, setMainModalOpen] = useState(false);
  const [subModalOpen, setSubModalOpen] = useState(Array(4).fill(false));

  const [noticeInfo, setNoticeInfo] = useState({ noticeNumber: '', noticeName: '' });
  const [priceInfo, setPriceInfo] = useState({
    estimatedPrice: '',
    basePrice: '',
    constructionCapacityLimit: '',
    perfectPerformancePrice: '',
  });

  const scoresRef = useRef(null);

  const handlePriceInput = (e, field) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    const numberValue = value === '' ? '' : Number(value).toLocaleString();
    setPriceInfo(prev => ({ ...prev, [field]: numberValue }));
  };

  useEffect(() => {
    const numericString = priceInfo.estimatedPrice.replace(/,/g, '');
    if (numericString === '') {
      setPriceInfo(prev => ({ ...prev, perfectPerformancePrice: '' }));
      return;
    }
    const estimatedPriceNumber = Number(numericString);
    const calculatedPrice = estimatedPriceNumber * 0.8;
    setPriceInfo(prev => ({
      ...prev,
      perfectPerformancePrice: calculatedPrice.toLocaleString()
    }));
  }, [priceInfo.estimatedPrice]);

  useEffect(() => {
    // --- ⬇️ [수정됨] 1. 업체 데이터에서 불필요한 capacityAmount 제거 ---
    const mockCompanies = [
      { id: 1, name: '전기협력사1', businessNumber: '123-45-67890', managementScore: 13.5, performanceScore: 14.2 },
      { id: 2, name: '전기협력사2', businessNumber: '123-45-67891', managementScore: 12.8, performanceScore: 13.5 },
      { id: 3, name: '전기협력사3', businessNumber: '123-45-67892', managementScore: 14.2, performanceScore: 14.8 },
      { id: 4, name: '건설파트너A', businessNumber: '222-11-33333', managementScore: 14.0, performanceScore: 14.0 },
      { id: 5, name: '(주)대한전력', businessNumber: '111-22-99999', managementScore: 13.9, performanceScore: 14.5 },
    ];
    // --- ⬆️ [수정됨] 1. 수정 완료 ---
    setCompanies(mockCompanies);
  }, []);

  const handleMainCompanySelect = (company) => {
    setSelectedMainCompany({ company: company, ratio: '' });
  };

  const handleSubCompanySelect = (company, index) => {
    const newSubCompanies = [...selectedSubCompanies];
    newSubCompanies[index] = { company: company, ratio: '' };
    setSelectedSubCompanies(newSubCompanies);
  };
  
  const handleMainRatioChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (Number(value) > 100) return;
    setSelectedMainCompany(prev => ({ ...prev, ratio: value }));
  };

  const handleSubRatioChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (Number(value) > 100) return;
    const newSubCompanies = [...selectedSubCompanies];
    if (newSubCompanies[index]) {
      newSubCompanies[index] = { ...newSubCompanies[index], ratio: value };
      setSelectedSubCompanies(newSubCompanies);
    }
  };

  const toggleSubModal = (index) => {
    const newSubModalOpen = [...subModalOpen];
    newSubModalOpen[index] = !newSubModalOpen[index];
    setSubModalOpen(newSubModalOpen);
  };

  const calculateScores = () => {
    if (!selectedMainCompany?.company) {
      alert('대표사를 선택해주세요.');
      return;
    }
    
    const managementScore = selectedMainCompany.company.managementScore;
    const performanceScore = selectedMainCompany.company.performanceScore;
    const bidScore = 65;
    const totalScore = managementScore + performanceScore + bidScore;

    setScores({ management: managementScore, performance: performanceScore, bid: bidScore, total: totalScore });
    
    setTimeout(() => {
      scoresRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const getExcludedIds = (currentIndex = -1) => {
    const ids = [];
    if (selectedMainCompany?.company?.id) {
      ids.push(selectedMainCompany.company.id);
    }
    selectedSubCompanies.forEach((sub, index) => {
      if (sub?.company?.id && index !== currentIndex) {
        ids.push(sub.company.id);
      }
    });
    return ids;
  }

  // --- ⬇️ [수정됨] 2. 사용자가 입력한 두 필드로 지분율을 계산하도록 로직 변경 ---
  let actualParticipationRatio = null;

  // '시공능력제한액'과 '기초금액'이 모두 입력되었는지 확인
  if (priceInfo.constructionCapacityLimit && priceInfo.basePrice) {
    // 사용자가 입력한 필드에서 직접 값을 가져와 숫자로 변환
    const capacityLimit = Number(priceInfo.constructionCapacityLimit.replace(/,/g, ''));
    const basePrice = Number(priceInfo.basePrice.replace(/,/g, ''));

    // 기초금액이 0보다 큰 경우에만 계산 (0으로 나누기 오류 방지)
    if (basePrice > 0) {
      const ratio = (capacityLimit / basePrice) * 100;
      // 소수점 둘째 자리까지 표시
      actualParticipationRatio = ratio.toFixed(2);
    }
  }
  // --- ⬆️ [수정됨] 2. 수정 완료 ---

  return (
    <div className="evaluation-page">
      <h2>행안부 적격심사 (50억미만)</h2>
      <div className="evaluation-container">
        {/* 공고/금액 정보 섹션 */}
        <div className="notice-info-section">
          <h3>공고 정보</h3>
          <div className="info-grid">
            <div className="info-item"><label>공고번호</label><input type="text" value={noticeInfo.noticeNumber} onChange={(e) => setNoticeInfo(prev => ({ ...prev, noticeNumber: e.target.value }))} placeholder="공고번호를 입력하세요"/></div>
            <div className="info-item"><label>공고명</label><input type="text" value={noticeInfo.noticeName} onChange={(e) => setNoticeInfo(prev => ({ ...prev, noticeName: e.target.value }))} placeholder="공고명을 입력하세요"/></div>
          </div>
        </div>
        <div className="price-info-section">
          <h3>금액 정보</h3>
          <div className="info-grid">
            <div className="info-item"><label>추정가격</label><div className="price-input-wrapper"><input type="text" value={priceInfo.estimatedPrice} onChange={(e) => handlePriceInput(e, 'estimatedPrice')} placeholder="0"/><span className="price-unit">원</span></div></div>
            <div className="info-item"><label>기초금액</label><div className="price-input-wrapper"><input type="text" value={priceInfo.basePrice} onChange={(e) => handlePriceInput(e, 'basePrice')} placeholder="0"/><span className="price-unit">원</span></div></div>
            <div className="info-item"><label>시공능력제한액</label><div className="price-input-wrapper"><input type="text" value={priceInfo.constructionCapacityLimit} onChange={(e) => handlePriceInput(e, 'constructionCapacityLimit')} placeholder="0"/><span className="price-unit">원</span></div></div>
            <div className="info-item"><label>실적만점금액 (자동계산)</label><div className="price-input-wrapper"><input type="text" value={priceInfo.perfectPerformancePrice} placeholder="0" readOnly className="auto-calculated"/><span className="price-unit">원</span></div></div>
          </div>
        </div>

        <div className="evaluation-grid">
          <div className="main-company-section">
            <h3>대표사 선택</h3>
            <div className="company-select-box">
              <div className="selected-company">
                {selectedMainCompany?.company ? (
                  <>
                    <div className="company-info-wrapper">
                      {/* UI 부분은 이전과 동일하나, 이제 올바른 계산 결과를 표시합니다 */}
                      <div className="company-info">
                        <div className="company-name">{selectedMainCompany.company.name}</div>
                        <div className="company-number">{selectedMainCompany.company.businessNumber}</div>
                        
                        {/* 대표사가 선택되었고, 계산이 완료되었을 때만 표시됩니다 */}
                        {actualParticipationRatio !== null && (
                          <div className="actual-ratio-display">
                            <span className="actual-ratio-label">실제 참여가능 지분율:</span>
                            <span className="actual-ratio-value">{actualParticipationRatio} %</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="ratio-input-wrapper">
                        <input
                          type="text"
                          className="ratio-input"
                          placeholder="지분율"
                          value={selectedMainCompany.ratio}
                          onChange={handleMainRatioChange}
                        />
                        <span className="percent-sign">%</span>
                      </div>
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
          
          <div className="sub-companies-section">
            <h3>구성사 선택</h3>
            {selectedSubCompanies.map((subCompany, index) => (
              <div className="company-select-box" key={index}>
                <div className="selected-company">
                  {subCompany?.company ? (
                    <>
                      <div className="company-info-wrapper">
                        <div className="company-info">
                          <div className="company-name">{subCompany.company.name}</div>
                          <div className="company-number">{subCompany.company.businessNumber}</div>
                        </div>
                        <div className="ratio-input-wrapper">
                           <input
                            type="text"
                            className="ratio-input"
                            placeholder="지분율"
                            value={subCompany.ratio}
                            onChange={(e) => handleSubRatioChange(e, index)}
                          />
                          <span className="percent-sign">%</span>
                        </div>
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

        <button className="btn btn-primary mt-4" onClick={calculateScores}>
          점수 산출
        </button>

        {scores && (
          <div className="scores-section mt-4" ref={scoresRef}>
            <h3>평가 결과</h3>
            <div className="score-card">
              <div className="score-item"><label>경영상태</label><span className="score-value">{scores.management.toFixed(2)}점</span></div>
              <div className="score-item"><label>시공실적</label><span className="score-value">{scores.performance.toFixed(2)}점</span></div>
              <div className="score-item"><label>입찰가격</label><span className="score-value">{scores.bid.toFixed(2)}점</span></div>
              <div className="score-item total"><label>총점</label><span className="score-value">{scores.total.toFixed(2)}점</span></div>
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
          excludeCompanyIds={getExcludedIds()}
        />

        {subModalOpen.map((isOpen, index) => (
          <CompanySearchModal
            key={index}
            isOpen={isOpen}
            onClose={() => toggleSubModal(index)}
            onSelect={(company) => handleSubCompanySelect(company, index)}
            companies={companies}
            title={`구성사 ${index + 1} 검색`}
            excludeCompanyIds={getExcludedIds(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default MoisUnder50Evaluation;