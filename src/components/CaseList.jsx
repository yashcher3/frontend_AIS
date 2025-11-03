import React, { useState, useEffect } from 'react';
import { styled } from 'styled-components';

const Container = styled.div`
  padding: 20px;
  max-width: 95vw;
  margin: 0 auto;
  width: 100%;
`;

const Section = styled.div`
  background: white;
  border-radius: 8px;
  padding: 25px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  width: 100%;
  box-sizing: border-box;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 25px;
  border-bottom: 2px solid #007bff;
  padding-bottom: 12px;
  font-size: 24px;
`;

const Button = styled.button`
  background: ${props => props.$primary ? '#007bff' : '#6c757d'};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 12px;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.$primary ? '#0056b3' : '#545b62'};
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const TableContainer = styled.div`
  overflow-x: visible;
  margin-top: 20px;
  width: 100%;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  min-width: auto;
`;

const TableHeader = styled.thead`
  background: #f8f9fa;
  border-bottom: 3px solid #dee2e6;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #e9ecef;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f0f8ff;
    transform: scale(1.01);
  }
  
  &:nth-child(even) {
    background-color: #fafafa;
  }
`;

const TableHeaderCell = styled.th`
  padding: 18px 15px;
  text-align: left;
  font-weight: 700;
  color: #2c3e50;
  white-space: nowrap;
  border-bottom: 3px solid #dee2e6;
  cursor: pointer;
  user-select: none;
  background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
  
  &:hover {
    background: linear-gradient(180deg, #e9ecef 0%, #dee2e6 100%);
  }
  
  // Обновленные ширины для колонок
  &:nth-child(1) { width: 80px; }  /* ID */
  &:nth-child(2) { width: 300px; } /* Название дела */
  &:nth-child(3) { width: 120px; } /* Текущий этап */
  &:nth-child(4) { width: 250px; } /* Исполнитель (ФИО) */
  &:nth-child(5) { width: 180px; } /* Дедлайн */
  &:nth-child(6) { width: 250px; } /* Шаблон */
  &:nth-child(7) { width: 140px; } /* Статус */
`;

const SortIcon = styled.span`
  margin-left: 8px;
  font-weight: bold;
  color: #007bff;
  font-size: 12px;
`;

const TableCell = styled.td`
  padding: 18px 15px;
  vertical-align: middle;
  border-bottom: 1px solid #e9ecef;
  line-height: 1.4;
  
  // Соответствующие ширины для ячеек
  &:nth-child(1) { width: 80px; font-weight: 700; color: #007bff; }
  &:nth-child(2) { width: 300px; }
  &:nth-child(3) { width: 120px; }
  &:nth-child(4) { width: 250px; }
  &:nth-child(5) { width: 180px; }
  &:nth-child(6) { width: 250px; }
  &:nth-child(7) { width: 140px; }
`;

const StatusBadge = styled.span`
  background: ${props => {
    switch(props.status) {
      case 'active': return '#28a745';
      case 'completed': return '#6c757d';
      case 'cancelled': return '#dc3545';
      default: return '#ffc107';
    }
  }};
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  display: inline-block;
  text-align: center;
  min-width: 80px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 25px;
  flex-wrap: wrap;
  align-items: end;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
`;

const SearchInput = styled.input`
  padding: 12px 15px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
  min-width: 250px;
  transition: border-color 0.2s;
  
  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const Select = styled.select`
  padding: 12px 15px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  min-width: 200px;
  transition: border-color 0.2s;
  
  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  flex-wrap: wrap;
  gap: 20px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e9ecef;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  flex: 1;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 200px;
`;

const FilterLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 13px;
  color: #495057;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  padding: 20px 0;
  border-top: 2px solid #dee2e6;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
`;

const PaginationInfo = styled.div`
  font-size: 14px;
  color: #495057;
  font-weight: 600;
`;

const PaginationControls = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
`;

const PageButton = styled.button`
  padding: 10px 16px;
  border: 2px solid #dee2e6;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  min-width: 45px;
  font-weight: 600;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background: #007bff;
    color: white;
    border-color: #007bff;
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: #f8f9fa;
    color: #6c757d;
    cursor: not-allowed;
    transform: none;
  }
  
  &.active {
    background: #007bff;
    color: white;
    border-color: #007bff;
  }
`;

const PageSizeSelect = styled.select`
  padding: 10px 15px;
  border: 2px solid #dee2e6;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  font-weight: 600;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 60px;
  color: #666;
  font-size: 18px;
  background: #f8f9fa;
  border-radius: 8px;
  margin: 20px 0;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 60px;
  color: #666;
  font-style: italic;
  font-size: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  margin: 20px 0;
`;

// Модальное окно
const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  padding: 40px;
  border-radius: 12px;
  max-width: 800px;
  width: 95%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
`;

export default function CaseList({ onBack, userRole }) {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  
  // Состояния для фильтрации
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [executorFilter, setExecutorFilter] = useState('all');
  
  // Состояния для сортировки
  const [sortColumn, setSortColumn] = useState('id');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Состояния для пагинации
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const [caseTemplates, setCaseTemplates] = useState({});
  const [allExecutors, setAllExecutors] = useState([]);

  // Загрузка данных при изменении параметров
  useEffect(() => {
    loadCases();
  }, [currentPage, pageSize, sortColumn, sortDirection]);

  useEffect(() => {
    loadCaseTemplates();
    loadAllExecutors();
  }, []);

  const loadCases = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const params = new URLSearchParams({
        page: currentPage.toString(),
        page_size: pageSize.toString(),
        sort_by: sortColumn,
        sort_order: sortDirection
      });

      if (searchTerm) params.append('name', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (executorFilter !== 'all') params.append('executor', executorFilter);

      const response = await fetch(`http://localhost:8000/cases/?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Cases data:', data);
        
        if (data.cases !== undefined) {
          setCases(data.cases || []);
          setTotalCount(data.total_count || 0);
          setTotalPages(data.total_pages || 1);
        } else {
          setCases(Array.isArray(data) ? data : []);
          setTotalCount(Array.isArray(data) ? data.length : 0);
          setTotalPages(1);
        }
      } else {
        throw new Error('Ошибка загрузки дел');
      }
    } catch (error) {
      console.error('Error loading cases:', error);
      alert('Ошибка при загрузке списка дел');
      setCases([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const loadCaseTemplates = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/case_templates/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const templates = await response.json();
        const templateMap = {};
        templates.forEach(template => {
          templateMap[template.id] = template.name;
        });
        setCaseTemplates(templateMap);
      }
    } catch (error) {
      console.error('Error loading case templates:', error);
    }
  };

  const loadAllExecutors = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/executors/list', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const executors = await response.json();
        setAllExecutors(executors);
      }
    } catch (error) {
      console.error('Error loading executors:', error);
    }
  };

  // Функция для получения ФИО исполнителя по логину
  const getExecutorFullName = (login) => {
    if (!login) return 'Не назначен';
    
    const executor = allExecutors.find(exec => exec.login === login);
    return executor ? executor.full_name : login;
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadCases();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(Number(newSize));
    setCurrentPage(1);
  };

  const getCurrentStage = (caseItem) => {
    if (!caseItem.current_stage) return null;
    return (caseItem.stages || []).find(stage => 
      stage.stage_template_id === caseItem.current_stage
    );
  };

  // Функция для получения части stage_template_id после первой точки
  const getAfterFirstDot = (stageTemplateId) => {
    if (!stageTemplateId) return 'Не указан';
    
    // Разделяем по точке и берем все после первой точки
    const parts = stageTemplateId.split('.');
    
    // Если есть точка и есть часть после нее
    if (parts.length > 1) {
      return parts.slice(1).join('.');
    }
    
    // Если точки нет, возвращаем исходное значение
    return stageTemplateId;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU');
    } catch (e) {
      return '-';
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('ru-RU');
    } catch (e) {
      return '-';
    }
  };

  const getSortIcon = (column) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  // Генерация номеров страниц для пагинации
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (loading && cases.length === 0) {
    return <LoadingMessage>Загрузка дел...</LoadingMessage>;
  }

  return (
    <Container>
      <Title>📋 Реестр дел</Title>

      <Section>
        <ActionBar>
          <Button onClick={onBack}>← Назад к панели управления</Button>
          <Button $primary onClick={loadCases}>🔄 Обновить данные</Button>
        </ActionBar>

        {/* Поиск и фильтры */}
        <SearchContainer>
          <FilterGroup>
            <FilterLabel>Поиск по названию</FilterLabel>
            <SearchInput
              type="text"
              placeholder="Введите название дела..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Статус дела</FilterLabel>
            <Select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Все статусы</option>
              <option value="active">Активные</option>
              <option value="completed">Завершенные</option>
              <option value="cancelled">Отмененные</option>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Исполнитель</FilterLabel>
            <Select 
              value={executorFilter} 
              onChange={(e) => setExecutorFilter(e.target.value)}
            >
              <option value="all">Все исполнители</option>
              {allExecutors.map(executor => (
                <option key={executor.login} value={executor.login}>
                  {executor.full_name}
                </option>
              ))}
            </Select>
          </FilterGroup>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'end' }}>
            <Button onClick={handleSearch}>
              🔍 Применить фильтры
            </Button>

            <Button onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setExecutorFilter('all');
              setCurrentPage(1);
            }}>
              🗑️ Сбросить
            </Button>
          </div>
        </SearchContainer>

        {/* Таблица дел */}
        <TableContainer>
          {cases.length === 0 && !loading ? (
            <EmptyMessage>Дела не найдены. Измените параметры поиска или создайте новые дела.</EmptyMessage>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <tr>
                    <TableHeaderCell onClick={() => handleSort('id')}>
                      ID {getSortIcon('id')}
                    </TableHeaderCell>
                    <TableHeaderCell onClick={() => handleSort('name')}>
                      Название дела {getSortIcon('name')}
                    </TableHeaderCell>
                    <TableHeaderCell>
                      Текущий этап
                    </TableHeaderCell>
                    <TableHeaderCell>
                      Исполнитель
                    </TableHeaderCell>
                    <TableHeaderCell>
                      Дедлайн
                    </TableHeaderCell>
                    <TableHeaderCell>
                      Шаблон
                    </TableHeaderCell>
                    <TableHeaderCell onClick={() => handleSort('status')}>
                      Статус {getSortIcon('status')}
                    </TableHeaderCell>
                  </tr>
                </TableHeader>
                <tbody>
                  {cases.map(caseItem => {
                    const currentStage = getCurrentStage(caseItem);
                    const templateName = caseTemplates[caseItem.case_template_id] || `Шаблон #${caseItem.case_template_id}`;
                    
                    return (
                      <TableRow key={caseItem.id} onClick={() => setSelectedCase(caseItem)}>
                        <TableCell>
                          <strong>#{caseItem.id}</strong>
                        </TableCell>
                        <TableCell>
                          <div style={{ fontWeight: '600', fontSize: '14px' }}>
                            {caseItem.name || 'Без названия'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div style={{ 
                            fontSize: '13px', 
                            fontWeight: 'bold',
                            color: '#007bff',
                            textAlign: 'center'
                          }}>
                            {getAfterFirstDot(caseItem.current_stage)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div style={{ fontSize: '13px' }}>
                            {getExecutorFullName(currentStage?.executor)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div style={{ fontSize: '13px' }}>
                            {currentStage?.deadline ? formatDateTime(currentStage.deadline) : 'Не установлен'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div style={{ fontSize: '13px', color: '#666' }}>
                            {templateName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={caseItem.status}>
                            {caseItem.status === 'active' ? 'Активно' : 
                             caseItem.status === 'completed' ? 'Завершено' : 'Отменено'}
                          </StatusBadge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </tbody>
              </Table>

              {/* Пагинация */}
              {totalPages > 1 && (
                <PaginationContainer>
                  <PaginationInfo>
                    Показано {cases.length} из {totalCount} дел
                  </PaginationInfo>
                  
                  <PaginationControls>
                    <PageSizeSelect 
                      value={pageSize} 
                      onChange={(e) => handlePageSizeChange(e.target.value)}
                    >
                      <option value="5">5 на странице</option>
                      <option value="10">10 на странице</option>
                      <option value="20">20 на странице</option>
                      <option value="50">50 на странице</option>
                    </PageSizeSelect>

                    <PageButton 
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                    >
                      ⟪
                    </PageButton>

                    <PageButton 
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      ⟨
                    </PageButton>

                    {getPageNumbers().map(page => (
                      <PageButton
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={currentPage === page ? 'active' : ''}
                      >
                        {page}
                      </PageButton>
                    ))}

                    <PageButton 
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      ⟩
                    </PageButton>

                    <PageButton 
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                    >
                      ⟫
                    </PageButton>
                  </PaginationControls>

                  <PaginationInfo>
                    Страница {currentPage} из {totalPages}
                  </PaginationInfo>
                </PaginationContainer>
              )}
            </>
          )}
        </TableContainer>
      </Section>

      {/* Модальное окно с деталями дела */}
      {selectedCase && (
        <Modal onClick={() => setSelectedCase(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h3 style={{ margin: 0, color: '#2c3e50' }}>Детали дела: {selectedCase.name}</h3>
              <Button onClick={() => setSelectedCase(null)}>×</Button>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <p><strong>ID:</strong> {selectedCase.id}</p>
              <p><strong>Статус:</strong> 
                <StatusBadge status={selectedCase.status} style={{ marginLeft: '10px' }}>
                  {selectedCase.status === 'active' ? 'Активно' : 
                   selectedCase.status === 'completed' ? 'Завершено' : 'Отменено'}
                </StatusBadge>
              </p>
              <p><strong>Создано:</strong> {formatDateTime(selectedCase.created_at)}</p>
              <p><strong>Шаблон:</strong> {caseTemplates[selectedCase.case_template_id] || 'Загрузка...'}</p>
              <p><strong>Текущий этап:</strong> {selectedCase.current_stage || 'Не указан'}</p>
            </div>

            {/* Дополнительная информация о деле */}
            {selectedCase.stages && selectedCase.stages.length > 0 && (
              <div>
                <h4 style={{ color: '#2c3e50', marginBottom: '15px' }}>Этапы дела:</h4>
                {selectedCase.stages.map((stage, index) => (
                  <div key={stage.id} style={{ 
                    background: stage.stage_template_id === selectedCase.current_stage ? '#e3f2fd' : '#f8f9fa',
                    padding: '15px', 
                    margin: '8px 0', 
                    borderRadius: '6px',
                    borderLeft: stage.stage_template_id === selectedCase.current_stage ? '4px solid #007bff' : '4px solid #6c757d'
                  }}>
                    <p><strong>Этап {index + 1}:</strong> {stage.stage_template_id} {stage.stage_template_id === selectedCase.current_stage && '(Текущий)'}</p>
                    <p><strong>Исполнитель:</strong> {getExecutorFullName(stage.executor)}</p>
                    <p><strong>Статус:</strong> 
                      <StatusBadge status={stage.status} style={{ marginLeft: '10px' }}>
                        {stage.status === 'pending' ? 'Ожидание' :
                         stage.status === 'in_progress' ? 'В работе' :
                         stage.status === 'completed' ? 'Завершен' : stage.status}
                      </StatusBadge>
                    </p>
                    {stage.completed_at && (
                      <p><strong>Завершен:</strong> {formatDateTime(stage.completed_at)}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
}