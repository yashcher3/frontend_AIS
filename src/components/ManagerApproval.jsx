import React, { useState, useEffect } from 'react';
import { styled } from 'styled-components';

// Стили (аналогично предыдущему компоненту, но с небольшими изменениями)
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
  background: ${props => {
    if (props.$primary) return '#007bff';
    if (props.$success) return '#28a745';
    if (props.$warning) return '#fd7e14';
    if (props.$danger) return '#dc3545';
    return '#6c757d';
  }};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 12px;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => {
      if (props.$primary) return '#0056b3';
      if (props.$success) return '#218838';
      if (props.$warning) return '#e66a2a';
      if (props.$danger) return '#c82333';
      return '#545b62';
    }};
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
      case 'waiting_approval': return '#ffc107';
      case 'completed': return '#28a745';
      case 'in_progress': return '#17a2b8';
      case 'rework': return '#fd7e14';
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
  max-width: 900px;
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    border-color: #007bff;
    outline: none;
  }
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

const FieldContainer = styled.div`
  background: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 15px;
  border-left: 4px solid #007bff;
`;

const AttributeLabel = styled.span`
  font-weight: 600;
  color: #495057;
  display: block;
  margin-bottom: 5px;
`;

const AttributeValue = styled.div`
  padding: 8px;
  background: white;
  border-radius: 4px;
  border: 1px solid #e9ecef;
`;

const CommentBubble = styled.div`
  background: #e3f2fd;
  padding: 12px 15px;
  border-radius: 8px;
  margin: 10px 0;
  border-left: 4px solid #2196f3;
`;

export default function ManagerApproval({ onBack, userRole }) {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [attributeTemplates, setAttributeTemplates] = useState({});

  useEffect(() => {
    loadPendingStages();
    loadAttributeTemplates();
  }, []);

  const loadPendingStages = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('Токен авторизации не найден');
    }

    console.log('Making request to /manager/pending-stages/');
    
    const response = await fetch('http://localhost:8000/manager/pending-stages/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      mode: 'cors', // Явно указываем режим CORS
      credentials: 'include', // Включаем учетные данные
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Successfully loaded stages:', data);
    setStages(data);
    
  } catch (error) {
    console.error('Error loading pending stages:', error);
    setMessage({ 
      type: 'error', 
      text: `Ошибка при загрузке этапов для проверки: ${error.message}` 
    });
    setStages([]); // Сбрасываем stages при ошибке
  } finally {
    setLoading(false);
  }
};

const downloadFile = async (attributeId, filename) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setMessage({ type: 'error', text: 'Токен авторизации не найден' });
      return;
    }

    const response = await fetch(`http://localhost:8000/download-file/${attributeId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      // Создаем blob и скачиваем файл
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } else {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Ошибка при загрузке файла');
    }
  } catch (error) {
    console.error('Error downloading file:', error);
    setMessage({ type: 'error', text: `Ошибка при скачивании файла: ${error.message}` });
  }
};

  const loadAttributeTemplates = async () => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.warn('No token for attribute templates');
      return;
    }

    console.log('Making request to /attribute-templates/');
    
    const response = await fetch('http://localhost:8000/attribute-templates/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      credentials: 'include',
    });

    console.log('Attribute templates response status:', response.status);
    
    if (response.ok) {
      const templates = await response.json();
      console.log('Loaded attribute templates:', templates.length);
      const templateMap = {};
      templates.forEach(template => {
        templateMap[template.id] = template;
      });
      setAttributeTemplates(templateMap);
    } else {
      console.warn('Failed to load attribute templates, status:', response.status);
    }
  } catch (error) {
    console.error('Error loading attribute templates:', error);
    // Не показываем ошибку пользователю, так как это вспомогательные данные
  }
};
  const getFileNameFromPath = (filePath) => {
  if (!filePath) return 'Файл';
    const parts = filePath.split('/');
  return parts[parts.length - 1] || 'Файл';
};

  

  const handleStageClick = (stage) => {
  console.log('Selected stage data:', stage); // ДОБАВЛЕНО: отладочный вывод
  console.log('Stage attributes:', stage.attributes); // ДОБАВЛЕНО: проверка атрибутов
  setSelectedStage(stage);
  setComment('');
  setMessage({ type: '', text: '' });
};

  const handleApprove = async () => {
    if (!comment.trim()) {
      setMessage({ type: 'error', text: 'Комментарий обязателен' });
      return;
    }

    setProcessing(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/stages/${selectedStage.id}/manager-approve/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          approved: true,
          comment: comment.trim()
        })
      });

      if (response.ok) {
        const result = await response.json();
        setMessage({ type: 'success', text: 'Этап успешно утвержден' });
        
        setTimeout(() => {
          setSelectedStage(null);
          loadPendingStages();
        }, 2000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка при утверждении этапа');
      }
    } catch (error) {
      console.error('Error approving stage:', error);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setProcessing(false);
    }
  };

  const handleRework = async () => {
    if (!comment.trim()) {
      setMessage({ type: 'error', text: 'Комментарий обязателен при возврате на доработку' });
      return;
    }

    setProcessing(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/stages/${selectedStage.id}/manager-rework/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          approved: false,
          comment: comment.trim()
        })
      });

      if (response.ok) {
        const result = await response.json();
        setMessage({ type: 'success', text: 'Этап возвращен на доработку' });
        
        setTimeout(() => {
          setSelectedStage(null);
          loadPendingStages();
        }, 2000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка при возврате этапа');
      }
    } catch (error) {
      console.error('Error returning stage for rework:', error);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setProcessing(false);
    }
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

  const getAttributeLabel = (attributeTemplateId) => {
    const template = attributeTemplates[attributeTemplateId];
    return template ? template.label : `Поле #${attributeTemplateId}`;
  };

  if (loading) {
    return <LoadingMessage>Загрузка этапов для проверки...</LoadingMessage>;
  }

  return (
    <Container>
      <Title>Утверждение этапов</Title>

      <Section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <Button onClick={onBack}>← Назад к панели управления</Button>
          <Button $primary onClick={loadPendingStages}>🔄 Обновить список</Button>
        </div>

        {message.text && (
          message.type === 'success' ? 
            <SuccessMessage>{message.text}</SuccessMessage> : 
            <ErrorMessage>{message.text}</ErrorMessage>
        )}

        <TableContainer>
          {stages.length === 0 ? (
            <EmptyMessage>Нет этапов, ожидающих утверждения</EmptyMessage>
          ) : (
            <Table>
              <TableHeader>
                <tr>
                  <TableHeaderCell>Дело</TableHeaderCell>
                  <TableHeaderCell>Этап</TableHeaderCell>
                  <TableHeaderCell>Исполнитель</TableHeaderCell>
                  <TableHeaderCell>Дедлайн</TableHeaderCell>
                  <TableHeaderCell>Дата завершения</TableHeaderCell>
                  <TableHeaderCell>Статус</TableHeaderCell>
                </tr>
              </TableHeader>
              <tbody>
                {stages.map(stage => (
                  <TableRow key={stage.id} onClick={() => handleStageClick(stage)}>
                    <TableCell>
                      <div style={{ fontWeight: '600' }}>
                        {stage.case_name || `Дело #${stage.case_id}`}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                        ID дела: {stage.case_id}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div style={{ fontSize: '13px', fontWeight: 'bold' }}>
                        {stage.stage_template_id}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div style={{ fontSize: '13px' }}>
                        {stage.executor}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div style={{ fontSize: '13px' }}>
                        {formatDate(stage.deadline)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div style={{ fontSize: '13px' }}>
                        {formatDateTime(stage.completed_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={stage.status}>
                        {stage.status === 'waiting_approval' ? 'Ожидает утверждения' : 
                         stage.status === 'completed' ? 'Завершен' : 
                         stage.status === 'in_progress' ? 'В работе' : 
                         stage.status === 'rework' ? 'На доработке' : stage.status}
                      </StatusBadge>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          )}
        </TableContainer>
      </Section>

      {/* Модальное окно проверки этапа */}
      {selectedStage && (
        <Modal onClick={() => !processing && setSelectedStage(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h3 style={{ margin: 0, color: '#2c3e50' }}>
                Проверка этапа: {selectedStage.stage_template_id}
              </h3>
              <Button 
                onClick={() => setSelectedStage(null)} 
                disabled={processing}
              >
                ×
              </Button>
            </div>

            {/* Информация о деле и этапе */}
            <div style={{ marginBottom: '25px', padding: '15px', background: '#f8f9fa', borderRadius: '6px' }}>
              <p><strong>Дело:</strong> {selectedStage.case_name || `Дело #${selectedStage.case_id}`}</p>
              <p><strong>Исполнитель:</strong> {selectedStage.executor}</p>
              <p><strong>Дедлайн этапа:</strong> {formatDate(selectedStage.deadline)}</p>
              <p><strong>Завершен исполнителем:</strong> {formatDateTime(selectedStage.completed_at)}</p>
              <p><strong>Правило закрытия:</strong> Утверждает менеджер</p>
            </div>

            {message.text && (
              message.type === 'success' ? 
                <SuccessMessage>{message.text}</SuccessMessage> : 
                <ErrorMessage>{message.text}</ErrorMessage>
            )}

            {/* Заполненные атрибуты */}
<div style={{ marginBottom: '25px' }}>
  <h4 style={{ color: '#2c3e50', marginBottom: '15px' }}>Заполненные данные:</h4>
  {selectedStage.attributes && selectedStage.attributes.length > 0 ? (
    selectedStage.attributes.map(attribute => {
      const template = attributeTemplates[attribute.attribute_template_id];
      const fieldLabel = template ? template.label : `Поле #${attribute.attribute_template_id}`;
      
      return (
        <FieldContainer key={attribute.id}>
          <AttributeLabel>
            {fieldLabel}
          </AttributeLabel>
          
          {/* Текстовые данные */}
          {attribute.user_text && (
            <AttributeValue>
              {attribute.user_text}
            </AttributeValue>
          )}
          
          {/* Файловые данные */}
          {attribute.user_file_path && (
            <div style={{ marginTop: attribute.user_text ? '10px' : '0' }}>
              <button 
                onClick={() => downloadFile(attribute.id, getFileNameFromPath(attribute.user_file_path))}
                style={{ 
                  background: 'none',
                  border: 'none',
                  color: '#007bff',
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: 'inherit'
                }}
              >
                📎 {getFileNameFromPath(attribute.user_file_path)}
              </button>
            </div>
          )}
          
          {/* Если ничего не заполнено */}
          {!attribute.user_text && !attribute.user_file_path && (
            <div style={{ color: '#6c757d', fontStyle: 'italic' }}>
              Не заполнено
            </div>
          )}
        </FieldContainer>
      );
    })
  ) : (
    <div style={{ textAlign: 'center', color: '#6c757d', fontStyle: 'italic', padding: '20px' }}>
      Нет заполненных данных
    </div>
  )}
</div>

            {/* Комментарий менеджера */}
            <FormGroup>
              <Label>
                Комментарий менеджера {!comment.trim() && '(обязателен)'}
              </Label>
              <TextArea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Введите комментарий... Обязателен для всех действий."
                disabled={processing}
              />
            </FormGroup>

            {/* Кнопки действий */}
            <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
              <Button
                $success
                onClick={handleApprove}
                disabled={processing || !comment.trim()}
              >
                Зачесть этап
              </Button>
              <Button
                $warning
                onClick={handleRework}
                disabled={processing || !comment.trim()}
              >
                Вернуть на доработку
              </Button>
              <Button
                onClick={() => setSelectedStage(null)}
                disabled={processing}
              >
                Отмена
              </Button>
            </div>

            {!comment.trim() && (
              <div style={{ fontSize: '14px', color: '#dc3545', marginTop: '10px' }}>
                ⚠ Для выполнения действия необходимо указать комментарий
              </div>
            )}
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
}