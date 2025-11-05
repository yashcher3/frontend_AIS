import React, { useState, useEffect } from 'react';
import { styled } from 'styled-components';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Section = styled.div`
  background: white;
  border-radius: 8px;
  padding: 25px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 25px;
  border-bottom: 2px solid #007bff;
  padding-bottom: 12px;
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
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const SmallButton = styled.button`
  background: ${props => props.$danger ? '#dc3545' : '#6c757d'};
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin-left: 10px;
  
  &:hover {
    background: ${props => props.$danger ? '#c82333' : '#545b62'};
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  margin-top: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
`;

const TableHeader = styled.thead`
  background: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #e9ecef;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f8f9fa;
  }
`;

const TableHeaderCell = styled.th`
  padding: 15px 12px;
  text-align: left;
  font-weight: 600;
  color: #495057;
  white-space: nowrap;
`;

const TableCell = styled.td`
  padding: 15px 12px;
  vertical-align: top;
  border-bottom: 1px solid #e9ecef;
`;

const StatusBadge = styled.span`
  background: ${props => {
    switch(props.status) {
      case 'in_progress': return '#17a2b8';
      case 'completed': return '#28a745';
      case 'waiting_approval': return '#ffc107';
      case 'rework': return '#fd7e14'; 
      case 'pending': return '#6c757d';
      default: return '#6c757d';
    }
  }};
  color: ${props => props.status === 'waiting_approval' ? '#212529' : 'white'};
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  display: inline-block;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  align-items: end;
`;

const SearchInput = styled.input`
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-width: 300px;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 8px;
  max-width: 800px;
  width: 95%;
  max-height: 90vh;
  overflow-y: auto;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
`;

const TextInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-height: 100px;
  resize: vertical;
`;

const FileInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const FileInfo = styled.div`
  margin-top: 10px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FieldContainer = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 6px;
  margin-bottom: 20px;
  border-left: 4px solid #007bff;
`;

const RequiredStar = styled.span`
  color: #dc3545;
  margin-left: 4px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-style: italic;
`;

const SuccessMessage = styled.div`
  background: #d4edda;
  color: #155724;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
  border: 1px solid #c3e6cb;
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
  border: 1px solid #f5c6cb;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: #e9ecef;
  border-radius: 2px;
  overflow: hidden;
  margin-top: 5px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: #007bff;
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const StageDescription = styled.div`
  margin-bottom: 15px;
  color: #666;
  font-style: ${props => props.$empty ? 'italic' : 'normal'};
  opacity: ${props => props.$empty ? 0.7 : 1};
  line-height: 1.5;
`;

const StageInfoSection = styled.div`
  background: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
  border-left: 4px solid #007bff;
`;

const CaseName = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: #333;
  margin-bottom: 5px;
`;

const CaseId = styled.div`
  font-size: 12px;
  color: #666;
`;

export default function ExecutorTasks({ onBack, userRole, currentUser }) {
  const [stages, setStages] = useState([]);
  const [filteredStages, setFilteredStages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [attributeTemplates, setAttributeTemplates] = useState([]);
  const [existingAttributes, setExistingAttributes] = useState([]);
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [initialFormData, setInitialFormData] = useState({});
  const [stageDescription, setStageDescription] = useState('');
  const [caseName, setCaseName] = useState('');

  useEffect(() => {
    loadStages();
  }, []);

  useEffect(() => {
    filterStages();
  }, [stages, searchTerm]);

  const loadStages = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/executor/stages/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const stagesData = await response.json();
        setStages(stagesData);
      } else {
        throw new Error('Ошибка загрузки этапов');
      }
    } catch (error) {
      console.error('Error loading stages:', error);
      setMessage({ type: 'error', text: 'Ошибка при загрузке задач' });
    } finally {
      setLoading(false);
    }
  };

  const filterStages = () => {
    let filtered = stages;

    if (searchTerm) {
      filtered = filtered.filter(stage => 
        stage.case_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredStages(filtered);
  };

  // Функция для форматирования номера этапа (оставляет только часть после первой точки)
  const formatStageNumber = (stageTemplateId) => {
    if (!stageTemplateId) return '';
    const parts = stageTemplateId.split('.');
    return parts.length > 1 ? parts.slice(1).join('.') : stageTemplateId;
  };

  const loadStageData = async (stage) => {
    try {
      const token = localStorage.getItem('access_token');

      // Загружаем шаблоны атрибутов
      const templatesResponse = await fetch(`http://localhost:8000/stage_templates/${stage.stage_template_id}/attribute_templates/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Загружаем существующие атрибуты
      const attributesResponse = await fetch(`http://localhost:8000/stages/${stage.id}/attributes/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      let templates = [];
      let existingAttrs = [];

      if (templatesResponse.ok) {
        templates = await templatesResponse.json();
      }

      if (attributesResponse.ok) {
        existingAttrs = await attributesResponse.json();
      }

      setAttributeTemplates(templates);
      setExistingAttributes(existingAttrs);

      // Загружаем информацию о шаблоне этапа для получения описания
      try {
        const stageTemplateResponse = await fetch(`http://localhost:8000/stage_templates/${stage.stage_template_id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (stageTemplateResponse.ok) {
          const stageTemplate = await stageTemplateResponse.json();
          setStageDescription(stageTemplate.desc || 'Описание отсутствует');
        } else {
          setStageDescription('Описание отсутствует');
        }
      } catch (error) {
        console.error('Error loading stage template:', error);
        setStageDescription('Описание отсутствует');
      }

      // Загружаем информацию о деле для получения названия
      try {
        const caseResponse = await fetch(`http://localhost:8000/cases/${stage.case_id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (caseResponse.ok) {
          const caseData = await caseResponse.json();
          setCaseName(caseData.name || `Дело #${stage.case_id}`);
        } else {
          setCaseName(`Дело #${stage.case_id}`);
        }
      } catch (error) {
        console.error('Error loading case:', error);
        setCaseName(`Дело #${stage.case_id}`);
      }

      // Инициализируем formData с существующими значениями
      const initialFormData = {};
      templates.forEach(template => {
        const existingAttr = existingAttrs.find(attr =>
          attr.attribute_template_id === template.id
        );

        initialFormData[template.id] = {
          attribute_template_id: template.id,
          user_text: existingAttr?.user_text || '',
          user_file_path: existingAttr?.user_file_path || '',
          attribute_id: existingAttr?.id || null,
          file: null
        };
      });

      setFormData(initialFormData);
      setInitialFormData(initialFormData);
      
      const editableStatuses = ['in_progress', 'rework'];
      setIsEditing(editableStatuses.includes(stage.status));
    } catch (error) {
      console.error('Error loading stage data:', error);
      setMessage({ type: 'error', text: 'Ошибка загрузки данных этапа' });
      setStageDescription('Не удалось загрузить описание');
      setCaseName(`Дело #${stage.case_id}`);
    }
  };

  const handleStageClick = async (stage) => {
    setSelectedStage(stage);
    setMessage({ type: '', text: '' });
    setStageDescription(''); // Сбрасываем описание перед загрузкой нового
    setCaseName(''); // Сбрасываем название дела перед загрузкой нового

    const editableStatuses = ['in_progress', 'rework'];
    setIsEditing(editableStatuses.includes(stage.status));
    
    await loadStageData(stage);
  };

  const handleInputChange = (templateId, field, value) => {
    setFormData(prev => ({
      ...prev,
      [templateId]: {
        ...prev[templateId],
        [field]: value
      }
    }));
  };

  const handleFileUpload = async (templateId, file) => {
    if (!file) return;

    setUploading(true);
    try {
      const token = localStorage.getItem('access_token');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('case_id', selectedStage.case_id);
      formData.append('stage_id', selectedStage.id);

      const response = await fetch('http://localhost:8000/upload-file/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        handleInputChange(templateId, 'user_file_path', result.file_path);
        setMessage({ type: 'success', text: 'Файл успешно загружен' });
      } else {
        throw new Error('Ошибка загрузки файла');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage({ type: 'error', text: 'Ошибка при загрузке файла' });
    } finally {
      setUploading(false);
    }
  };

  const handleFileDelete = async (templateId) => {
    const attributeData = formData[templateId];
    if (!attributeData?.user_file_path) return;

    try {
      const token = localStorage.getItem('access_token');

      if (attributeData.attribute_id) {
        const deleteResponse = await fetch(`http://localhost:8000/attributes/${attributeData.attribute_id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!deleteResponse.ok) {
          const errorData = await deleteResponse.json();
          throw new Error(errorData.detail || 'Ошибка удаления файла');
        }
      }

      handleInputChange(templateId, 'user_file_path', '');
      
      setMessage({ type: 'success', text: 'Файл удален' });
    } catch (error) {
      console.error('Error deleting file:', error);
      setMessage({ type: 'error', text: error.message });
    }
  };

  const validateForm = () => {
    for (const template of attributeTemplates) {
      const fieldData = formData[template.id];
      if (!fieldData || (!fieldData.user_text && !fieldData.user_file_path)) {
        setMessage({ type: 'error', text: `Заполните обязательное поле: ${template.label}` });
        return false;
      }
    }
    return true;
  };

  const isFormValid = () => {
    return attributeTemplates.every(template => {
      const fieldData = formData[template.id];
      return fieldData && (fieldData.user_text || fieldData.user_file_path);
    });
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('access_token');

      const attributesData = Object.values(formData).map(attr => ({
        attribute_template_id: attr.attribute_template_id,
        user_text: attr.user_text || null,
        user_file_path: attr.user_file_path || null
      }));

      const attributesResponse = await fetch(`http://localhost:8000/stages/${selectedStage.id}/attributes/batch/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(attributesData)
      });

      if (!attributesResponse.ok) {
        throw new Error('Ошибка сохранения данных');
      }

      if (selectedStage.status === 'rework') {
        const reworkResponse = await fetch(`http://localhost:8000/stages/${selectedStage.id}/rework-submit/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (reworkResponse.ok) {
          const result = await reworkResponse.json();
          setMessage({ type: 'success', text: 'Исправления отправлены на проверку руководителю' });
          
          setTimeout(() => {
            setSelectedStage(null);
            setFormData({});
            setExistingAttributes([]);
            loadStages();
          }, 2000);
        } else {
          const errorData = await reworkResponse.json();
          throw new Error(errorData.detail || 'Ошибка отправки исправлений');
        }
      } else {
        const completeResponse = await fetch(`http://localhost:8000/stages/${selectedStage.id}/complete/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (completeResponse.ok) {
          const result = await completeResponse.json();

          let successMessage = 'Данные успешно сохранены! ';
          if (selectedStage.closing_rule === 'executor_closing') {
            successMessage += 'Этап завершен.';
            if (result.case_status === 'completed') {
              successMessage += ' Дело завершено.';
            }
            
            setTimeout(() => {
              setSelectedStage(null);
              setFormData({});
              setExistingAttributes([]);
              loadStages();
            }, 2000);
          } else {
            successMessage += ' Этап отправлен на проверку руководителю.';
            
            const updatedStage = {
              ...selectedStage,
              status: 'waiting_approval'
            };
            setSelectedStage(updatedStage);
            setIsEditing(false);
            
            loadStages();
          }

          setMessage({ type: 'success', text: successMessage });

        } else {
          const errorData = await completeResponse.json();
          throw new Error(errorData.detail || 'Ошибка завершения этапа');
        }
      }

    } catch (error) {
      console.error('Error submitting data:', error);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData(initialFormData);
    setMessage({ type: '', text: '' });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'in_progress': return 'В работе';
      case 'completed': return 'Завершен';
      case 'waiting_approval': return 'Ожидает проверки';
      case 'rework': return 'На доработке';
      case 'pending': return 'Ожидание';
      default: return status;
    }
  };

  const getFileNameFromPath = (filePath) => {
    if (!filePath) return '';
    return filePath.split('/').pop();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const getFormProgress = () => {
    if (!attributeTemplates || attributeTemplates.length === 0) return 0;
    
    const filledFields = attributeTemplates.filter(template => {
      const fieldData = formData[template.id];
      return fieldData && (fieldData.user_text || fieldData.user_file_path);
    }).length;
    
    return (filledFields / attributeTemplates.length) * 100;
  };

  if (loading) {
    return <LoadingMessage>Загрузка задач...</LoadingMessage>;
  }

  return (
    <Container>
      <Title>Мои текущие задачи</Title>

      <Section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <Button onClick={onBack}>← Назад</Button>
          <Button $primary onClick={loadStages}>Обновить</Button>
        </div>

        <SearchContainer>
          <div>
            <Label>Поиск по названию дела</Label>
            <SearchInput
              type="text"
              placeholder="Введите название дела..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </SearchContainer>

        {message.text && (
          message.type === 'success' ? 
            <SuccessMessage>{message.text}</SuccessMessage> : 
            <ErrorMessage>{message.text}</ErrorMessage>
        )}

        <TableContainer>
          {filteredStages.length === 0 ? (
            <EmptyMessage>
              {stages.length === 0 ? 
                'У вас нет текущих задач' : 
                'Задачи по вашему запросу не найдены'
              }
            </EmptyMessage>
          ) : (
            <Table>
              <TableHeader>
                <tr>
                  <TableHeaderCell>Название дела</TableHeaderCell> {/* Изменено с "Дело" на "Название дела" */}
                  <TableHeaderCell>Этап</TableHeaderCell>
                  <TableHeaderCell>Дедлайн</TableHeaderCell>
                  <TableHeaderCell>Статус</TableHeaderCell>
                  <TableHeaderCell>Правило завершения</TableHeaderCell>
                </tr>
              </TableHeader>
              <tbody>
                {filteredStages.map(stage => (
                  <TableRow key={stage.id} onClick={() => handleStageClick(stage)}>
                    <TableCell>
                      <CaseName>
                        {stage.case_name || `Дело #${stage.case_id}`}
                      </CaseName>
                      {/* Убрал блок с CaseId */}
                    </TableCell>
                    <TableCell>
                      <div style={{ fontSize: '13px', fontWeight: 'bold' }}>
                        Этап {formatStageNumber(stage.stage_template_id)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div style={{ fontSize: '13px' }}>
                        {formatDate(stage.deadline)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={stage.status}>
                        {getStatusText(stage.status)}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      <div style={{ fontSize: '13px' }}>
                        {stage.closing_rule === 'executor_closing' 
                          ? 'Завершает исполнитель' 
                          : 'Завершает руководитель'}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          )}
        </TableContainer>
      </Section>

      {selectedStage && (
        <Modal onClick={() => !submitting && setSelectedStage(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h3 style={{ margin: 0 }}>
                Заполнение этапа: {formatStageNumber(selectedStage.stage_template_id)}
              </h3>
              <Button 
                onClick={() => setSelectedStage(null)} 
                disabled={submitting}
              >
                ×
              </Button>
            </div>

            {/* Блок с информацией о деле */}
            <StageInfoSection>
              <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Информация о деле:</h4>
              <CaseName>{caseName || 'Загрузка...'}</CaseName>
            </StageInfoSection>

            {/* Блок с описанием шаблона этапа */}
            <StageInfoSection>
              <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Описание этапа:</h4>
              <StageDescription $empty={!stageDescription || stageDescription === 'Описание отсутствует'}>
                {stageDescription || 'Загрузка описания...'}
              </StageDescription>
            </StageInfoSection>

            <div style={{ marginBottom: '20px' }}>
              <p><strong>Дедлайн:</strong> {formatDate(selectedStage.deadline)}</p>
              <p><strong>Правило завершения:</strong> {
                selectedStage.closing_rule === 'executor_closing' 
                  ? 'Вы можете завершить этот этап' 
                  : 'После заполнения этап отправится на проверку руководителю'
              }</p>
              
              <div style={{ marginTop: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontSize: '14px' }}>Прогресс заполнения:</span>
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                    {Math.round(getFormProgress())}%
                  </span>
                </div>
                <ProgressBar>
                  <ProgressFill progress={getFormProgress()} />
                </ProgressBar>
              </div>
            </div>

            {message.text && (
              message.type === 'success' ? 
                <SuccessMessage>{message.text}</SuccessMessage> : 
                <ErrorMessage>{message.text}</ErrorMessage>
            )}

            {attributeTemplates && attributeTemplates.map(template => {
              const fieldData = formData[template.id];
              const isFieldFilled = fieldData && (fieldData.user_text || fieldData.user_file_path);

              if (!isEditing && selectedStage?.status === 'waiting_approval') {
                return (
                  <FieldContainer key={template.id}>
                    <Label>
                      {template.label}
                      <RequiredStar>*</RequiredStar>
                    </Label>
                    
                    {fieldData?.user_text ? (
                      <div style={{ 
                        padding: '10px', 
                        background: '#f8f9fa', 
                        border: '1px solid #dee2e6',
                        borderRadius: '4px',
                        marginBottom: '10px'
                      }}>
                        {fieldData.user_text}
                      </div>
                    ) : fieldData?.user_file_path ? (
                      <FileInfo>
                        <span>Прикрепленный файл: {getFileNameFromPath(fieldData.user_file_path)}</span> {/* Убрал смайлик */}
                      </FileInfo>
                    ) : (
                      <div style={{ color: '#6c757d', fontStyle: 'italic' }}>
                        Не заполнено
                      </div>
                    )}
                  </FieldContainer>
                );
              }

              return (
                <FieldContainer key={template.id}>
                  <Label>
                    {template.label}
                    <RequiredStar>*</RequiredStar>
                  </Label>

                  {template.field_type === 'text_field' ? (
                    template.field_index <= 1 ? (
                      <TextInput
                        type="text"
                        value={fieldData?.user_text || ''}
                        onChange={(e) => handleInputChange(template.id, 'user_text', e.target.value)}
                        placeholder={`Введите ${template.label.toLowerCase()}`}
                        disabled={submitting || !isEditing}
                      />
                    ) : (
                      <TextArea
                        value={fieldData?.user_text || ''}
                        onChange={(e) => handleInputChange(template.id, 'user_text', e.target.value)}
                        placeholder={`Введите ${template.label.toLowerCase()}`}
                        disabled={submitting || !isEditing}
                      />
                    )
                  ) : (
                    <div>
                      {fieldData?.user_file_path ? (
                        <FileInfo>
                          <span>Прикрепленный файл: {getFileNameFromPath(fieldData.user_file_path)}</span> {/* Убрал смайлик */}
                          {isEditing && (
                            <SmallButton
                              $danger
                              onClick={() => handleFileDelete(template.id)}
                              disabled={submitting}
                            >
                              Удалить
                            </SmallButton>
                          )}
                        </FileInfo>
                      ) : (
                        <FileInput
                          type="file"
                          onChange={(e) => handleFileUpload(template.id, e.target.files[0])}
                          disabled={uploading || submitting || !isEditing}
                        />
                      )}
                      {uploading && <div>Загрузка файла...</div>}
                    </div>
                  )}

                  {isFieldFilled && (
                    <div style={{ fontSize: '12px', color: '#28a745', marginTop: '5px' }}>
                      Поле заполнено {/* Убрал галочку */}
                    </div>
                  )}
                </FieldContainer>
              );
            })}

            <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
              {isEditing ? (
                <>
                  <Button
                    $primary
                    onClick={handleSubmit}
                    disabled={submitting || uploading || !isFormValid()}
                  >
                    {submitting ? 'Сохранение...' : /* Убрал смайлик */
                    selectedStage.closing_rule === 'executor_closing'
                      ? 'Завершить этап'
                      : 'Отправить на проверку'}
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    disabled={submitting}
                  >
                    Отмена
                  </Button>
                </>
              ) : selectedStage?.status === 'waiting_approval' ? (
                <>
                  <Button
                    $primary
                    onClick={handleEdit}
                  >
                    Изменить
                  </Button>
                  <Button
                    onClick={() => setSelectedStage(null)}
                  >
                    Закрыть
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    $primary
                    onClick={handleSubmit}
                    disabled={submitting || uploading || !isFormValid()}
                  >
                    {submitting ? 'Сохранение...' :
                    selectedStage.closing_rule === 'executor_closing'
                      ? 'Завершить этап'
                      : 'Отправить на проверку'}
                  </Button>
                  <Button
                    onClick={() => setSelectedStage(null)}
                    disabled={submitting}
                  >
                    Отмена
                  </Button>
                </>
              )}
            </div>
            
            {!isFormValid() && isEditing && (
              <div style={{ fontSize: '14px', color: '#dc3545', marginTop: '10px' }}>
                Заполните все обязательные поля для отправки 
              </div>
            )}

            {(selectedStage.status === 'rework' || selectedStage.status === 'waiting_approval') && selectedStage.manager_comment && (
              <FieldContainer style={{ 
                borderLeftColor: '#fd7e14', 
                background: '#fff3cd',
                marginBottom: '20px'
              }}>
                <Label style={{ color: '#856404', fontWeight: 'bold' }}>
                  Комментарий руководителя:
                </Label>
                <div style={{ 
                  padding: '12px', 
                  background: 'white', 
                  border: '1px solid #ffeaa7', 
                  borderRadius: '4px',
                  fontStyle: 'italic',
                  color: '#856404'
                }}>
                  {selectedStage.manager_comment}
                </div>
              </FieldContainer>
            )}
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
}