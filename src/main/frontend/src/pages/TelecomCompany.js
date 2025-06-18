import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import './CompanyPage.css';

// 스타일 정의
const styles = {
  recentTransaction: {
    backgroundColor: '#cce5ff',
  },
  yearTransaction: {
    backgroundColor: '#d4edda',
  },
  selectedRow: {
    backgroundColor: '#fff3cd',
  }
};

function TelecomCompany() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // 금액 포맷팅 함수
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  // 거래 이력에 따른 행 스타일 결정 함수
  const getRowClassName = (lastTransactionDate) => {
    if (!lastTransactionDate) return '';
    
    const today = new Date();
    const transactionDate = new Date(lastTransactionDate);
    const diffTime = Math.abs(today - transactionDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 365) {
      return 'year-transaction';  // 1년 미만: 초록색
    } else {
      return 'recent-transaction';  // 1년 초과: 파란색
    }
  };

  useEffect(() => {
    // 임시 데이터 생성 함수
    const generateMockData = () => {
      const regions = ['서울', '부산', '인천', '대구', '광주', '대전', '울산', '세종', '경기', '강원'];
      const creditRatings = ['A+', 'A', 'A-', 'B+', 'B', 'B-'];
      const constructionQualities = ['A+', 'A', 'B+', 'B'];

      // 신용평가 기간 생성 함수
      const generateCreditRatingPeriod = () => {
        const startDate = new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
        const endDate = new Date(startDate);
        endDate.setFullYear(endDate.getFullYear() + 1);
        
        return {
          startDate: startDate.toLocaleDateString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit' }).replace(/\. /g, '.'),
          endDate: endDate.toLocaleDateString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit' }).replace(/\. /g, '.')
        };
      };

      // 최근 거래일 생성 함수
      const generateLastTransactionDate = (index) => {
        const today = new Date();
        const randomDays = Math.floor(Math.random() * 500); // 0~500일 전
        const date = new Date(today);
        date.setDate(date.getDate() - randomDays);
        return date.toISOString().split('T')[0];
      };

      return Array.from({ length: 50 }, (_, index) => {
        const creditPeriod = generateCreditRatingPeriod();
        const constructionCapabilityAmount = Math.floor(Math.random() * 9000000000) + 1000000000; // 10억 ~ 100억
        const threeYearAmount = Math.floor(Math.random() * 15000000000) + 5000000000; // 50억 ~ 200억
        const fiveYearAmount = Math.floor(Math.random() * 20000000000) + 10000000000; // 100억 ~ 300억

        return {
          id: index + 1,
          companyName: `통신협력사${index + 1}`,
          representative: `대표자${index + 1}`,
          businessNumber: `345-${String(index + 1).padStart(2, '0')}-${String(index + 1000).slice(1)}`,
          region: regions[index % regions.length],
          constructionCapabilityAmount: constructionCapabilityAmount,
          threeYearPerformance: threeYearAmount,
          fiveYearPerformance: fiveYearAmount,
          debtRatio: `${Math.floor(Math.random() * 50 + 120)}%`,
          currentRatio: `${Math.floor(Math.random() * 50 + 150)}%`,
          registrationDate: `202${Math.floor(index / 17)}-${String(Math.floor(Math.random() * 12 + 1)).padStart(2, '0')}-${String(Math.floor(Math.random() * 28 + 1)).padStart(2, '0')}`,
          creditRating: creditRatings[index % creditRatings.length],
          creditRatingPeriod: `${creditPeriod.startDate}~${creditPeriod.endDate}`,
          isWomenEnterprise: index % 5 === 0,
          employeeCount: Math.floor(Math.random() * 50 + 20),
          jobCreation: Math.floor(Math.random() * 15 + 3),
          constructionQuality: constructionQualities[index % constructionQualities.length],
          notes: index % 3 === 0 ? '우수협력사' : index % 7 === 0 ? '신규등록업체' : '',
          lastTransactionDate: generateLastTransactionDate(index)
        };
      });
    };

    setCompanies(generateMockData());
    setLoading(false);
  }, []);

  const handleCheckboxChange = (id) => {
    setSelectedItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // 검색 필터링 함수
  const filteredCompanies = companies.filter(company =>
    company.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 페이지네이션 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCompanies.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="company-page">
      <h2>통신협력사 목록</h2>
      <SearchBar 
        searchTerm={searchTerm} 
        onSearchChange={(value) => {
          setSearchTerm(value);
          setCurrentPage(1); // 검색 시 첫 페이지로 이동
        }}
      />
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>
                <input 
                  type="checkbox" 
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedItems(companies.map(c => c.id));
                    } else {
                      setSelectedItems([]);
                    }
                  }}
                />
              </th>
              <th>회사명</th>
              <th>대표자</th>
              <th>사업자번호</th>
              <th>지역</th>
              <th>전기시공능력평가액</th>
              <th>3년간실적액</th>
              <th>5년간실적액</th>
              <th>부채비율</th>
              <th>유동비율</th>
              <th>영업기간<br/>공사등록일</th>
              <th>신용평가</th>
              <th>여성기업</th>
              <th>건설고용자수</th>
              <th>일자리<br/>창출실적</th>
              <th>시공품질평가</th>
              <th>비고</th>
              <th>최근거래일</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map(company => (
              <tr 
                key={company.id}
                style={{
                  backgroundColor: company.lastTransactionDate ? 
                    (new Date() - new Date(company.lastTransactionDate)) / (1000 * 60 * 60 * 24) <= 365 ? 
                    '#d4edda' : '#cce5ff' 
                    : 'white'
                }}
              >
                <td>
                  <input 
                    type="checkbox"
                    checked={selectedItems.includes(company.id)}
                    onChange={() => handleCheckboxChange(company.id)}
                  />
                </td>
                <td>{company.companyName}</td>
                <td>{company.representative}</td>
                <td>{company.businessNumber}</td>
                <td>{company.region}</td>
                <td>{formatAmount(company.constructionCapabilityAmount)}원</td>
                <td>{formatAmount(company.threeYearPerformance)}원</td>
                <td>{formatAmount(company.fiveYearPerformance)}원</td>
                <td>{company.debtRatio}</td>
                <td>{company.currentRatio}</td>
                <td>{company.registrationDate}</td>
                <td>{`${company.creditRating} (${company.creditRatingPeriod})`}</td>
                <td>
                  <input 
                    type="checkbox" 
                    checked={company.isWomenEnterprise} 
                    readOnly 
                  />
                </td>
                <td>{company.employeeCount}명</td>
                <td>{company.jobCreation}명</td>
                <td>{company.constructionQuality}</td>
                <td>{company.notes || '-'}</td>
                <td>{company.lastTransactionDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredCompanies.length === 0 ? (
          <div className="text-center py-3">
            검색 결과가 없습니다.
          </div>
        ) : (
          <div className="d-flex justify-content-center mt-4">
            <nav>
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    이전
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                  <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(number)}
                    >
                      {number}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    다음
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}

export default TelecomCompany; 