import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { styled } from 'styled-components';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Section = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 20px;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: white;
  
  &:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
  }
`;

const Button = styled.button`
  background: ${props => props.$primary ? '#007bff' : '#6c757d'};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 10px;
  
  &:hover {
    background: ${props => props.$primary ? '#0056b3' : '#545b62'};
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;


const StageCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
  background: #fafafa;
`;

const StageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
`;

const StageTitle = styled.h3`
  color: #333;
  margin: 0;
  flex: 1;
`;

const StageNumber = styled.span`
  background: #007bff;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  margin-right: 10px;
`;

const FieldList = styled.div`
  margin: 15px 0;
`;

const FieldItem = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
`;

const FieldType = styled.span`
  background: ${props => props.type === 'file' ? '#28a745' : '#17a2b8'};
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: bold;
  margin-right: 10px;
`;

const FieldLabel = styled.span`
  flex: 1;
  font-weight: 500;
`;

const DurationBadge = styled.span`
  background: #ffc107;
  color: #212529;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: bold;
  margin-left: 10px;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 20px;
  margin: 10px 0;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  
  input {
    margin-right: 8px;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 12px;
  margin-top: 5px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  font-size: 14px;
`;

const TemplateList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const TemplateItem = styled.div`
  padding: 12px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f8f9fa;
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  ${props => props.selected && `
    background-color: #e7f3ff;
    border-left: 3px solid #007bff;
  `}
`;

const TemplateName = styled.div`
  font-weight: 600;
  color: #333;
`;

const TemplateDescription = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 4px;
`;

const ExecutorSearchContainer = styled.div`
  position: relative;
`;

const ExecutorSuggestions = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 4px 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ExecutorSuggestion = styled.div`
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  
  &:hover {
    background-color: #f8f9fa;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const ExecutorInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ExecutorName = styled.span`
  font-weight: 500;
`;

const ExecutorDetails = styled.span`
  font-size: 12px;
  color: #666;
`;

const DeadlineInfo = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 5px;
`;

const Required = styled.span`
  color: #dc3545;
  margin-left: 4px;
`;



const DateInputDMY = ({ value, onChange, id, min }) => {
  const [displayValue, setDisplayValue] = useState('');

  // Преобразование YYYY-MM-DD в ДД/ММ/ГГГГ для отображения
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Преобразование ДД/ММ/ГГГГ в YYYY-MM-DD для хранения
  const parseDateFromDisplay = (displayString) => {
    if (!displayString) return '';
    
    // Удаляем все нецифровые символы, кроме слешей
    const cleanValue = displayString.replace(/[^\d/]/g, '');
    
    // Автоматически добавляем слеши
    let formattedValue = cleanValue;
    if (cleanValue.length > 2) {
      formattedValue = cleanValue.slice(0, 2) + '/' + cleanValue.slice(2);
    }
    if (cleanValue.length > 4) {
      formattedValue = formattedValue.slice(0, 5) + '/' + formattedValue.slice(5, 9);
    }
    
    setDisplayValue(formattedValue);

    // Если дата полная, преобразуем в YYYY-MM-DD
    if (formattedValue.length === 10) {
      const [day, month, year] = formattedValue.split('/');
      if (day && month && year && year.length === 4) {
        try {
          const date = new Date(year, month - 1, day);
          if (!isNaN(date.getTime())) {
            return date.toISOString().split('T')[0];
          }
        } catch (e) {
          console.error('Date parsing error:', e);
        }
      }
    }
    
    return value; // Возвращаем старое значение, если новое невалидно
  };

  // Инициализация значения при монтировании
  useEffect(() => {
    setDisplayValue(formatDateForDisplay(value));
  }, [value]);

  const handleChange = (e) => {
    const newDisplayValue = e.target.value;
    const newValue = parseDateFromDisplay(newDisplayValue);
    
    if (newValue !== value) {
      onChange(newValue);
    }
  };

  const handleBlur = () => {
    // При потере фокуса форматируем дату, если она неполная
    if (displayValue && displayValue.length < 10) {
      const currentDate = new Date();
      const [day, month, partialYear] = displayValue.split('/');
      
      let year = partialYear;
      if (partialYear && partialYear.length === 2) {
        // Преобразуем двухзначный год в четырехзначный
        const currentYear = currentDate.getFullYear();
        const century = Math.floor(currentYear / 100) * 100;
        year = (century + parseInt(partialYear)).toString();
      }
      
      if (day && month && year) {
        try {
          const date = new Date(year, month - 1, day);
          if (!isNaN(date.getTime())) {
            const formattedDate = date.toISOString().split('T')[0];
            onChange(formattedDate);
            setDisplayValue(formatDateForDisplay(formattedDate));
          }
        } catch (e) {
          console.error('Date parsing error on blur:', e);
        }
      }
    }
  };

  return (
    <Input
      id={id}
      type="text"
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder="ДД/ММ/ГГГГ"
      style={{ textAlign: 'center' }}
    />
  );
};


export default function CreateCase({ onCancel, onCreateSuccess }) {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [executors, setExecutors] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [caseName, setCaseName] = useState('');
  const [stages, setStages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [executorSearch, setExecutorSearch] = useState({});
  const [showSuggestions, setShowSuggestions] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Загрузка шаблонов и исполнителей
  useEffect(() => {
    loadTemplatesAndExecutors();
  }, []);

  // Полнотекстовый поиск шаблонов
  useEffect(() => {
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      const filtered = templates.filter(template => {
        const nameMatch = template.name.toLowerCase().includes(searchLower);
        const descMatch = template.description.toLowerCase().includes(searchLower);
        return nameMatch || descMatch;
      });
      setFilteredTemplates(filtered);
    } else {
      setFilteredTemplates(templates);
    }
  }, [searchTerm, templates]);

  // Фильтрация исполнителей для автодополнения
  const getFilteredExecutors = useCallback((stageIndex) => {
    const searchTerm = executorSearch[stageIndex] || '';
    if (!searchTerm.trim()) {
      return executors.slice(0, 10); // Показываем первые 10 при пустом поиске
    }
    
    const searchLower = searchTerm.toLowerCase();
    return executors.filter(executor => {
      const nameMatch = executor.full_name.toLowerCase().includes(searchLower);
      const loginMatch = executor.login.toLowerCase().includes(searchLower);
      const areaMatch = executor.expert_area?.toLowerCase().includes(searchLower);
      return nameMatch || loginMatch || areaMatch;
    }).slice(0, 10); // Ограничиваем 10 результатами
  }, [executorSearch, executors]);

  const loadTemplatesAndExecutors = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      throw new Error('Токен авторизации не найден');
    }

    const headers = {
      'Authorization': `Bearer ${token}`
    };

    console.log("Загружаем шаблоны...");
    const templatesResponse = await fetch('http://localhost:8000/case_templates/', { headers });
    console.log("Шаблоны статус:", templatesResponse.status);
    
    if (!templatesResponse.ok) {
      const errorText = await templatesResponse.text();
      throw new Error(`Ошибка загрузки шаблонов: ${templatesResponse.status} ${templatesResponse.statusText}. ${errorText}`);
    }

    console.log("Загружаем исполнителей...");
    const executorsResponse = await fetch('http://localhost:8000/executors/list', { headers });
    console.log("Исполнители статус:", executorsResponse.status);
    
    if (!executorsResponse.ok) {
      const errorText = await executorsResponse.text();
      console.error("Ошибка исполнителей:", errorText);
      throw new Error(`Ошибка загрузки исполнителей: ${executorsResponse.status} ${executorsResponse.statusText}. ${errorText}`);
    }

    const templatesData = await templatesResponse.json();
    const executorsData = await executorsResponse.json();
    
    console.log("Загружено шаблонов:", templatesData.length);
    console.log("Загружено исполнителей:", executorsData.length);
    console.log("Данные исполнителей:", executorsData);
    
    setTemplates(templatesData);
    setFilteredTemplates(templatesData);
    setExecutors(executorsData);
    
  } catch (error) {
    console.error('Error loading data:', error);
    
    // Попробуем загрузить диагностическую информацию
    try {
      const debugResponse = await fetch('http://localhost:8000/debug/executors');
      const debugData = await debugResponse.json();
      console.log("Диагностика исполнителей:", debugData);
    } catch (debugError) {
      console.error("Диагностика не удалась:", debugError);
    }
    
    let errorMessage = 'Ошибка при загрузке данных: ';
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      errorMessage += 'Не удалось подключиться к серверу. Проверьте, что бэкенд запущен на localhost:8000';
    } else {
      errorMessage += error.message;
    }
    
    alert(errorMessage);
  } finally {
    setLoading(false);
  }
};
  // Функция для парсинга длительности из строки (например: "5 дней" -> 5)
  const parseDuration = (durationStr) => {
    if (!durationStr) return 7; // Значение по умолчанию
    
    const match = durationStr.match(/(\d+)/);
    return match ? parseInt(match[1]) : 7;
  };

  // Расчет дедлайнов на основе длительности этапов
  const calculateDeadlines = useCallback((stageTemplates) => {
    const deadlines = [];
    let currentDate = new Date();
    
    stageTemplates.forEach((stage, index) => {
      const durationDays = parseDuration(stage.duration);
      currentDate.setDate(currentDate.getDate() + durationDays);
      
      deadlines.push({
        ...stage,
        deadline: currentDate.toISOString().split('T')[0],
        executor: '',
        closing_rule: 'executor_closing'
      });
    });
    
    return deadlines;
  }, []);

  const handleTemplateSelect = async (template) => {
    setSelectedTemplate(template);
    setCaseName(`Дело на основе: ${template.name}`);
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/case_templates/${template.id}/stage_templates/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const stageTemplates = await response.json();
        
        // Загружаем атрибуты для каждого этапа и рассчитываем дедлайны
        const stagesWithData = await Promise.all(
          stageTemplates.map(async (stageTemplate) => {
            const attrResponse = await fetch(
              `http://localhost:8000/stage_templates/${stageTemplate.id}/attribute_templates/`,
              { headers: { 'Authorization': `Bearer ${token}` } }
            );
            
            const attributes = attrResponse.ok ? await attrResponse.json() : [];
            
            return {
              ...stageTemplate,
              attributes
            };
          })
        );

        // Сортируем этапы по номеру и рассчитываем дедлайны
        const sortedStages = stagesWithData.sort((a, b) => {
          const aParts = a.id.split('.').map(Number);
          const bParts = b.id.split('.').map(Number);
          
          for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
            const aVal = aParts[i] || 0;
            const bVal = bParts[i] || 0;
            if (aVal !== bVal) return aVal - bVal;
          }
          return 0;
        });

        const stagesWithDeadlines = calculateDeadlines(sortedStages);
        setStages(stagesWithDeadlines);
      }
    } catch (error) {
      console.error('Error loading stage templates:', error);
      alert('Ошибка при загрузке этапов шаблона');
    }
  };

  const updateStage = (stageIndex, field, value) => {
    const updatedStages = [...stages];
    updatedStages[stageIndex] = {
      ...updatedStages[stageIndex],
      [field]: value
    };
    setStages(updatedStages);
  };

  const handleExecutorSearch = (stageIndex, value) => {
    setExecutorSearch(prev => ({
      ...prev,
      [stageIndex]: value
    }));
    setShowSuggestions(prev => ({
      ...prev,
      [stageIndex]: true
    }));
  };

  const selectExecutor = (stageIndex, executor) => {
    updateStage(stageIndex, 'executor', executor.login);
    setExecutorSearch(prev => ({
      ...prev,
      [stageIndex]: executor.full_name
    }));
    setShowSuggestions(prev => ({
      ...prev,
      [stageIndex]: false
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!caseName.trim()) {
      newErrors.caseName = 'Введите название дела';
    }

    if (!selectedTemplate) {
      newErrors.template = 'Выберите шаблон дела';
    }

    stages.forEach((stage, index) => {
      if (!stage.executor) {
        newErrors[`stage_${index}_executor`] = `Выберите исполнителя для этапа ${stage.name_stage}`;
      }
      if (!stage.closing_rule) {
        newErrors[`stage_${index}_closing_rule`] = `Выберите тип выполнения для этапа ${stage.name_stage}`;
      }
      if (!stage.deadline) {
        newErrors[`stage_${index}_deadline`] = `Установите дедлайн для этапа ${stage.name_stage}`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
  if (!validateForm()) {
    alert('Пожалуйста, заполните все обязательные поля');
    return;
  }

  setIsSubmitting(true);
  try {
    const token = localStorage.getItem('access_token');
    
    const caseData = {
      name: caseName,
      case_template_id: selectedTemplate.id,
      stages: stages.map(stage => ({
        stage_template_id: stage.id,
        executor: stage.executor,
        deadline: stage.deadline + 'T00:00:00', // Добавляем время для корректного формата
        closing_rule: stage.closing_rule,
        next_stage_rule: stage.next_stage_rule || ''
      }))
    };

    console.log('Sending case data:', caseData);

    const response = await fetch('http://localhost:8000/cases/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(caseData)
    });

    if (!response.ok) {
      let errorDetails;
      try {
        errorDetails = await response.json();
      } catch (e) {
        errorDetails = await response.text();
      }
      throw new Error(JSON.stringify(errorDetails));
    }

    const createdCase = await response.json();
    alert('Дело успешно создано!');
    if (onCreateSuccess) {
      onCreateSuccess(createdCase);
    }
  } catch (error) {
    console.error('Error creating case:', error);
    
    // Парсим детали ошибки
    let errorMessage = 'Ошибка при создании дела: ';
    try {
      const errorData = JSON.parse(error.message);
      if (errorData.detail) {
        if (Array.isArray(errorData.detail)) {
          errorMessage += errorData.detail.map(err => `${err.loc?.join('.')}: ${err.msg}`).join('; ');
        } else {
          errorMessage += errorData.detail;
        }
      } else {
        errorMessage += error.message;
      }
    } catch (e) {
      errorMessage += error.message;
    }
    
    alert(errorMessage);
  } finally {
    setIsSubmitting(false);
  }
};


  if (loading) {
    return <LoadingMessage>Загрузка шаблонов и исполнителей...</LoadingMessage>;
  }

  return (
    <Container>
      <Title>Создание нового дела</Title>

      
      <Section>
        <FormGroup>
          <Label htmlFor="template-search">
            Поиск шаблона дела <Required>*</Required>
          </Label>
          <SearchInput
            id="template-search"
            type="text"
            placeholder="Введите название или описание шаблона для поиска..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label>Выберите шаблон дела <Required>*</Required></Label>
          <TemplateList>
            {filteredTemplates.length > 0 ? (
              filteredTemplates.map(template => (
                <TemplateItem
                  key={template.id}
                  selected={selectedTemplate?.id === template.id}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <TemplateName>{template.name}</TemplateName>
                  <TemplateDescription>{template.description}</TemplateDescription>
                </TemplateItem>
              ))
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                {searchTerm ? 'Шаблоны не найдены' : 'Нет доступных шаблонов'}
              </div>
            )}
          </TemplateList>
          {errors.template && <ErrorMessage>{errors.template}</ErrorMessage>}
        </FormGroup>

        {selectedTemplate && (
          <div style={{ marginTop: '15px', padding: '10px', background: '#e7f3ff', borderRadius: '4px' }}>
            <strong>Выбран шаблон:</strong> {selectedTemplate.name}
            <br />
            <strong>Описание:</strong> {selectedTemplate.description}
          </div>
        )}
      </Section>

      {selectedTemplate && (
        <Section>
          <FormGroup>
            <Label htmlFor="case-name">
              Название дела <Required>*</Required>
            </Label>
            <Input
              id="case-name"
              type="text"
              value={caseName}
              onChange={(e) => setCaseName(e.target.value)}
              placeholder="Введите название дела..."
            />
            {errors.caseName && <ErrorMessage>{errors.caseName}</ErrorMessage>}
          </FormGroup>
        </Section>
      )}

      
      {selectedTemplate && stages.length > 0 && (
        <Section>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>
            Настройка этапов ({stages.length} этапов)
          </h3>

          {stages.map((stage, index) => {
            const filteredExecutors = getFilteredExecutors(index);
            const currentExecutorSearch = executorSearch[index] || '';
            
            return (
              <StageCard key={stage.id}>
                <StageHeader>
                  <StageNumber>Этап {stage.id}</StageNumber>
                  <StageTitle>{stage.name_stage}</StageTitle>
                  {stage.duration && (
                    <DurationBadge>Длительность: {stage.duration}</DurationBadge>
                  )}
                </StageHeader>

                {stage.desc && (
                  <div style={{ marginBottom: '15px', color: '#666' }}>
                    <strong>Описание:</strong> {stage.desc}
                  </div>
                )}

                
                {stage.attributes && stage.attributes.length > 0 && (
                  <FieldList>
                    <Label>Поля этапа:</Label>
                    {stage.attributes.map(attr => (
                      <FieldItem key={attr.id}>
                        <FieldType type={attr.field_type === 'file_field' ? 'file' : 'text'}>
                          {attr.field_type === 'file_field' ? 'ФАЙЛ' : 'ТЕКСТ'}
                        </FieldType>
                        <FieldLabel>{attr.label}</FieldLabel>
                      </FieldItem>
                    ))}
                  </FieldList>
                )}

                
                <FormGroup>
                  <Label>
                    Тип выполнения этапа <Required>*</Required>
                  </Label>
                  <RadioGroup>
                    <RadioLabel>
                      <input
                        type="radio"
                        name={`closing_rule_${index}`}
                        value="executor_closing"
                        checked={stage.closing_rule === 'executor_closing'}
                        onChange={(e) => updateStage(index, 'closing_rule', e.target.value)}
                      />
                      Исполнитель завершает этап
                    </RadioLabel>
                    <RadioLabel>
                      <input
                        type="radio"
                        name={`closing_rule_${index}`}
                        value="manager_closing"
                        checked={stage.closing_rule === 'manager_closing'}
                        onChange={(e) => updateStage(index, 'closing_rule', e.target.value)}
                      />
                      Руководитель завершает этап
                    </RadioLabel>
                  </RadioGroup>
                  {errors[`stage_${index}_closing_rule`] && (
                    <ErrorMessage>{errors[`stage_${index}_closing_rule`]}</ErrorMessage>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor={`executor_${index}`}>
                    Исполнитель этапа <Required>*</Required>
                  </Label>
                  <ExecutorSearchContainer>
                    <Input
                      id={`executor_${index}`}
                      type="text"
                      value={currentExecutorSearch}
                      onChange={(e) => handleExecutorSearch(index, e.target.value)}
                      onFocus={() => setShowSuggestions(prev => ({ ...prev, [index]: true }))}
                      placeholder="Начните вводить ФИО или логин исполнителя..."
                    />
                    {showSuggestions[index] && filteredExecutors.length > 0 && (
                      <ExecutorSuggestions>
                        {filteredExecutors.map(executor => (
                          <ExecutorSuggestion
                            key={executor.id}
                            onClick={() => selectExecutor(index, executor)}
                          >
                            <ExecutorInfo>
                              <ExecutorName>{executor.full_name}</ExecutorName>
                              <ExecutorDetails>
                                {executor.login} • {executor.expert_area}
                              </ExecutorDetails>
                            </ExecutorInfo>
                          </ExecutorSuggestion>
                        ))}
                      </ExecutorSuggestions>
                    )}
                  </ExecutorSearchContainer>
                  {stage.executor && (
                    <DeadlineInfo>
                      Выбран: {executors.find(e => e.login === stage.executor)?.full_name}
                    </DeadlineInfo>
                  )}
                  {errors[`stage_${index}_executor`] && (
                    <ErrorMessage>{errors[`stage_${index}_executor`]}</ErrorMessage>
                  )}
                </FormGroup>

                 <FormGroup>
                  <Label htmlFor={`deadline_${index}`}>
                    Дедлайн этапа <Required>*</Required>
                  </Label>
                  
                  
                  <DateInputDMY
                    id={`deadline_${index}`}
                    value={stage.deadline}
                    onChange={(newDate) => updateStage(index, 'deadline', newDate)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  
                  <DeadlineInfo>
                    Рассчитан автоматически
                  </DeadlineInfo>
                  {errors[`stage_${index}_deadline`] && (
                    <ErrorMessage>{errors[`stage_${index}_deadline`]}</ErrorMessage>
                  )}
                </FormGroup>
              </StageCard>
            );
          })}
        </Section>
      )}

      
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
  <Button onClick={onCancel} disabled={isSubmitting}>
    Отмена
  </Button>
  <Button 
    $primary  
    onClick={handleSubmit}
    disabled={isSubmitting || !selectedTemplate || stages.length === 0}
  >
    {isSubmitting ? 'Создание...' : 'Создать дело'}
  </Button>
</div>
    </Container>
  );
}