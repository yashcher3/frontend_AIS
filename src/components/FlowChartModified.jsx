import React, { useCallback, useState, useEffect, useMemo, useRef } from 'react';
import {
  ReactFlow,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { v4 as uuidv4 } from 'uuid';

// Modified Custom Node Component - УБРАНЫ ПОЛЯ ВВОДА КОЛИЧЕСТВА ПОЛЕЙ
const CustomNodeModified = React.memo(({ data, id }) => {
  const [showConditionInput, setShowConditionInput] = useState(false);
  const [newCondition, setNewCondition] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Count outgoing connections from this node
  const outgoingEdges = data.edges ? data.edges.filter(edge => edge.source === id) : [];
  const hasMultipleConnections = outgoingEdges.length >= 2;

  const handleSaveCondition = () => {
    if (newCondition.trim()) {
      data.onUpdateConditions(id, newCondition.trim());
      setNewCondition('');
      setShowConditionInput(false);
      setIsEditing(false);
    }
  };

  const handleRemoveCondition = () => {
    data.onUpdateConditions(id, '');
  };

  const handleEditCondition = () => {
    setNewCondition(data.condition || '');
    setShowConditionInput(true);
    setIsEditing(true);
  };

  const handleUpdateData = (field, value) => {
    data.onUpdateNodeData(id, { [field]: value });
  };

  // Обработчик для кнопки настроек
  const handleSettingsClick = (e) => {
    e.stopPropagation();
    console.log('Settings button clicked for node:', id);
    if (data.onOpenAttributePanel) {
      data.onOpenAttributePanel(id);
    } else {
      console.error('onOpenAttributePanel is not defined in data');
    }
  };

  // Larger handle styles
  const handleStyle = {
    width: 14,
    height: 14,
    borderRadius: '50%',
    background: '#555',
    border: '2px solid #fff',
    boxShadow: '0 0 4px rgba(0,0,0,0.3)',
  };

  return (
    <div style={{ 
      padding: '15px', 
      border: '1px solid #ddd', 
      borderRadius: '8px', 
      background: '#fff', 
      width: '320px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      position: 'relative'
    }}>
      {/* Input Handle - Left */}
      <Handle
        type="target"
        position={Position.Left}
        style={handleStyle}
        className="node-handle"
      />
      
      {/* Output Handle - Right */}
      <Handle
        type="source"
        position={Position.Right}
        style={handleStyle}
        className="node-handle"
        id="default"
      />
      
      <h3>Этап {data.numberDisplay}</h3>
      <div style={{ marginBottom: '10px' }}>
        <label>Название этапа</label>
        <textarea 
          value={data.name_stage || ''} 
          onChange={(e) => handleUpdateData('name_stage', e.target.value)} 
          style={{ width: '100%', minHeight: '50px' }}
        />
      </div>
      
      {/* УБРАНЫ ПОЛЯ ДЛЯ ВВОДА КОЛИЧЕСТВА ПОЛЕЙ */}
      
      <div style={{ marginBottom: '10px' }}>
        <label>Описание:</label>
        <textarea 
          value={data.desc || ''} 
          onChange={(e) => handleUpdateData('desc', e.target.value)} 
          style={{ width: '100%', minHeight: '70px' }}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Длительность:</label>
        <input 
          type="text" 
          value={data.duration || ''} 
          onChange={(e) => handleUpdateData('duration', e.target.value)} 
          style={{ width: '100%' }}
        />
      </div>

      {/* Кнопка для настройки названий полей */}
      <div style={{ marginTop: '10px' }}>
        <button 
          onClick={handleSettingsClick}
          style={{ 
            background: '#17a2b8', 
            color: 'white', 
            border: 'none', 
            borderRadius: '3px',
            padding: '8px 12px',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          Настроить поля
        </button>
      </div>

      {/* Conditions Section */}
      {data.condition && (
        <div style={{ marginTop: '10px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
          <strong>Условие ветвления:</strong>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            margin: '5px 0',
            padding: '5px',
            background: '#f8f9fa',
            borderRadius: '3px'
          }}>
            <span>{data.condition}</span>
            <button 
              onClick={handleEditCondition}
              style={{ 
                background: '#ffc107', 
                color: 'black', 
                border: 'none', 
                borderRadius: '3px',
                padding: '2px 6px',
                cursor: 'pointer',
                marginRight: '5px'
              }}
            >
              ✎
            </button>
            <button 
              onClick={handleRemoveCondition}
              style={{ 
                background: '#dc3545', 
                color: 'white', 
                border: 'none', 
                borderRadius: '3px',
                padding: '2px 6px',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      {/* External Add Condition Button Container */}
      <div 
        style={{ 
          position: 'absolute', 
          right: '-140px', 
          top: '50%', 
          transform: 'translateY(-50%)',
          display: hasMultipleConnections && (showConditionInput || !data.condition) ? 'block' : 'none'
        }}
      >
        {!showConditionInput ? (
          <button 
            onClick={() => {
              setIsEditing(false);
              setNewCondition('');
              setShowConditionInput(true);
            }}
            style={{ 
              background: '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '3px',
              padding: '5px 10px',
              cursor: 'pointer',
              fontSize: '12px',
              whiteSpace: 'nowrap'
            }}
          >
            + Add condition
          </button>
        ) : (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '5px',
            background: 'white',
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            minWidth: '150px'
          }}>
            <input
              type="text"
              value={newCondition}
              onChange={(e) => setNewCondition(e.target.value)}
              placeholder={isEditing ? "Редактировать условие" : "Введите условие"}
              style={{ width: '100%', padding: '5px' }}
              onKeyPress={(e) => e.key === 'Enter' && handleSaveCondition()}
            />
            <div style={{ display: 'flex', gap: '5px' }}>
              <button 
                onClick={handleSaveCondition}
                style={{ 
                  background: '#28a745', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '3px',
                  padding: '3px 8px',
                  cursor: 'pointer',
                  flex: 1
                }}
              >
                ✓
              </button>
              <button 
                onClick={() => {
                  setShowConditionInput(false);
                  setIsEditing(false);
                  setNewCondition('');
                }}
                style={{ 
                  background: '#6c757d', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '3px',
                  padding: '3px 8px',
                  cursor: 'pointer',
                  flex: 1
                }}
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

// ОБНОВЛЕННЫЙ КОМПОНЕНТ ПАНЕЛИ АТРИБУТОВ
const AttributePanel = React.memo(({ 
  isOpen, 
  onClose, 
  currentNode, 
  onSaveAttributes,
  onUpdateNodeData
}) => {
  const [fileFields, setFileFields] = useState([]);
  const [textFields, setTextFields] = useState([]);

  // Инициализируем поля при открытии панели
  useEffect(() => {
    if (isOpen && currentNode) {
      console.log('Initializing attributes for node:', currentNode.id);
      
      // Загружаем существующие шаблоны если есть
      const existingFileFields = currentNode.data.file_fields || 0;
      const existingTextFields = currentNode.data.text_fields || 0;
      
      // Создаем массивы полей
      const newFileFields = [];
      const newTextFields = [];
      
      for (let i = 0; i < existingFileFields; i++) {
        newFileFields.push({
          id: uuidv4(),
          label: `Файловое поле ${i + 1}`
        });
      }
      
      for (let i = 0; i < existingTextFields; i++) {
        newTextFields.push({
          id: uuidv4(),
          label: `Текстовое поле ${i + 1}`
        });
      }
      
      setFileFields(newFileFields);
      setTextFields(newTextFields);
    }
  }, [isOpen, currentNode]);

  const handleAddFileField = () => {
    const newField = {
      id: uuidv4(),
      label: `Файловое поле ${fileFields.length + 1}`
    };
    setFileFields(prev => [...prev, newField]);
  };

  const handleAddTextField = () => {
    const newField = {
      id: uuidv4(),
      label: `Текстовое поле ${textFields.length + 1}`
    };
    setTextFields(prev => [...prev, newField]);
  };

  const handleFieldLabelChange = (fieldType, index, value) => {
    if (fieldType === 'file') {
      const newFields = [...fileFields];
      newFields[index].label = value;
      setFileFields(newFields);
    } else {
      const newFields = [...textFields];
      newFields[index].label = value;
      setTextFields(newFields);
    }
  };

  const handleRemoveField = (fieldType, index) => {
    if (fieldType === 'file') {
      const newFields = fileFields.filter((_, i) => i !== index);
      setFileFields(newFields);
    } else {
      const newFields = textFields.filter((_, i) => i !== index);
      setTextFields(newFields);
    }
  };

  const handleSave = async () => {
    if (currentNode) {
      // Формируем массив атрибутов для отправки на бэкенд
      const attributes = [];
      
      // Добавляем файловые поля
      fileFields.forEach((field, index) => {
        attributes.push({
          field_type: 'file_field',
          field_index: index + 1,
          label: field.label
        });
      });
      
      // Добавляем текстовые поля
      textFields.forEach((field, index) => {
        attributes.push({
          field_type: 'text_field',
          field_index: fileFields.length + index + 1,
          label: field.label
        });
      });

      // Обновляем данные узла
      onUpdateNodeData(currentNode.id, {
        file_fields: fileFields.length,
        text_fields: textFields.length
      });

      // Сохраняем атрибуты
      await onSaveAttributes(currentNode.id, attributes);
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      left: 0,
      top: 0,
      width: '25%',
      height: '100vh',
      background: 'white',
      boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
      zIndex: 1000,
      padding: '20px',
      overflowY: 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3>Названия полей для этапа {currentNode?.data.numberDisplay}</h3>
        <button 
          onClick={onClose}
          style={{ 
            background: '#6c757d', 
            color: 'white', 
            border: 'none', 
            borderRadius: '3px',
            padding: '5px 10px',
            cursor: 'pointer'
          }}
        >
          ×
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <p><strong>Статистика полей:</strong></p>
        <p>Файловые поля: {fileFields.length}</p>
        <p>Текстовые поля: {textFields.length}</p>
        <p><strong>Всего полей: {fileFields.length + textFields.length}</strong></p>
      </div>

      {/* Кнопки добавления полей */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          onClick={handleAddFileField}
          style={{ 
            background: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            padding: '10px 15px',
            cursor: 'pointer',
            flex: 1
          }}
        >
          + Добавить файловое поле
        </button>
        <button 
          onClick={handleAddTextField}
          style={{ 
            background: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            padding: '10px 15px',
            cursor: 'pointer',
            flex: 1
          }}
        >
          + Добавить текстовое поле
        </button>
      </div>

      {/* Файловые поля */}
      <div style={{ marginBottom: '30px' }}>
        <h4>Файловые поля ({fileFields.length})</h4>
        {fileFields.map((field, index) => (
          <div key={field.id} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontWeight: 'bold' }}>
                Файловое поле {index + 1}:
              </label>
              <button 
                onClick={() => handleRemoveField('file', index)}
                style={{ 
                  background: '#dc3545', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '3px',
                  padding: '3px 8px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Удалить
              </button>
            </div>
            <input
              type="text"
              value={field.label}
              onChange={(e) => handleFieldLabelChange('file', index, e.target.value)}
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: '1px solid #ccc', 
                borderRadius: '4px'
              }}
              placeholder="Введите название для файлового поля"
            />
          </div>
        ))}
        {fileFields.length === 0 && (
          <p style={{ color: '#6c757d', fontStyle: 'italic' }}>Нет файловых полей</p>
        )}
      </div>

      {/* Текстовые поля */}
      <div style={{ marginBottom: '30px' }}>
        <h4>Текстовые поля ({textFields.length})</h4>
        {textFields.map((field, index) => (
          <div key={field.id} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontWeight: 'bold' }}>
                Текстовое поле {index + 1}:
              </label>
              <button 
                onClick={() => handleRemoveField('text', index)}
                style={{ 
                  background: '#dc3545', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '3px',
                  padding: '3px 8px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Удалить
              </button>
            </div>
            <input
              type="text"
              value={field.label}
              onChange={(e) => handleFieldLabelChange('text', index, e.target.value)}
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: '1px solid #ccc', 
                borderRadius: '4px'
              }}
              placeholder="Введите название для текстового поля"
            />
          </div>
        ))}
        {textFields.length === 0 && (
          <p style={{ color: '#6c757d', fontStyle: 'italic' }}>Нет текстовых полей</p>
        )}
      </div>

      <button 
        onClick={handleSave}
        style={{ 
          background: '#28a745', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          padding: '12px 20px',
          cursor: 'pointer',
          width: '100%',
          marginTop: '20px',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        Сохранить названия
      </button>
    </div>
  );
});

const FlowChartModified = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [rootNodeId, setRootNodeId] = useState(null);
  const [attributePanel, setAttributePanel] = useState({
    isOpen: false,
    currentNode: null
  });
  const [attributeTemplates, setAttributeTemplates] = useState({});

  // Используем useRef для хранения актуального состояния nodes
  const nodesRef = useRef(nodes);
  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  // Мемоизируем nodeTypes
  const nodeTypes = useMemo(() => ({
    customModified: CustomNodeModified,
  }), []);

  // Функция для получения детей узла
  const getNodeChildren = useCallback((nodeId) => {
    return edges
      .filter(edge => edge.source === nodeId)
      .map(edge => nodes.find(node => node.id === edge.target))
      .filter(Boolean);
  }, [edges, nodes]);

  // Проверка токенов
  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      return Date.now() >= exp;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  };

  // Функция для выхода
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    localStorage.removeItem('user_role');
    window.location.reload();
  };

  // Функции для обновления узлов
  const updateNodeConditions = useCallback((nodeId, condition) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, condition } }
          : node
      )
    );
  }, [setNodes]);

  const updateNodeData = useCallback((nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...newData } }
          : node
      )
    );
  }, [setNodes]);

  // Функция для открытия панели атрибутов
  const handleOpenAttributePanel = useCallback((nodeId) => {
    console.log('handleOpenAttributePanel called with nodeId:', nodeId);
    const node = nodesRef.current.find(n => n.id === nodeId);
    console.log('Found node:', node);
    
    if (node) {
      setAttributePanel({
        isOpen: true,
        currentNode: node
      });
      console.log('Attribute panel state set to open');
    } else {
      console.error('Node not found! Available nodes:', nodesRef.current.map(n => n.id));
    }
  }, []);

  // Создаем стабильные ссылки на функции для передачи в узлы
  const stableNodeData = useMemo(() => ({
    onUpdateConditions: updateNodeConditions,
    onUpdateNodeData: updateNodeData,
    onOpenAttributePanel: handleOpenAttributePanel,
  }), [updateNodeConditions, updateNodeData, handleOpenAttributePanel]);

  // Функция для сохранения атрибутов
  const handleSaveAttributes = useCallback(async (nodeId, attributes) => {
    let token = localStorage.getItem('access_token');
    
    if (token && isTokenExpired(token)) {
      try {
        const refreshResponse = await fetch('http://localhost:8000/token/refresh', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (refreshResponse.ok) {
          const newTokenData = await refreshResponse.json();
          token = newTokenData.access_token;
          localStorage.setItem('access_token', token);
        } else {
          handleLogout();
          alert('Сессия истекла. Пожалуйста, войдите снова.');
          return;
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        handleLogout();
        alert('Ошибка обновления сессии. Пожалуйста, войдите снова.');
        return;
      }
    }

    try {
    const stageNumber = nodesRef.current.find(n => n.id === nodeId)?.data.numberDisplay;
    if (!stageNumber) return;

    // Формируем данные согласно модели бэкенда
    const templates = attributes.map(attr => ({
      field_type: attr.field_type,
      field_index: attr.field_index,
      label: attr.label,
      stage_template_id: stageNumber // Добавляем обязательное поле
    }));

    console.log('Sending templates:', templates); // Для отладки

    const response = await fetch(`http://localhost:8000/stage_templates/${stageNumber}/attribute_templates/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(templates)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const savedTemplates = await response.json();
    setAttributeTemplates(prev => ({
      ...prev,
      [stageNumber]: savedTemplates
    }));
    alert('Названия полей успешно сохранены!');
    
  } catch (error) {
    console.error('Error saving attributes:', error);
    alert(`Ошибка при сохранении названий полей: ${error.message}`);
  }
}, []);

  // Функция для загрузки шаблонов атрибутов
  const loadAttributeTemplates = useCallback(async (stageId) => {
    let token = localStorage.getItem('access_token');
    
    try {
      const response = await fetch(`http://localhost:8000/stage_templates/${stageId}/attribute_templates/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const templates = await response.json();
        setAttributeTemplates(prev => ({
          ...prev,
          [stageId]: templates
        }));
        return templates;
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    }
    return [];
  }, []);

  // Функция для экспорта данных в API
  const exportToAPI = useCallback(async () => {
    let token = localStorage.getItem('access_token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('user_role');
    
    console.log('=== Frontend Debug ===');
    console.log('Token:', token ? `${token.substring(0, 20)}...` : 'missing');
    console.log('Username:', username);
    console.log('Role:', role);

    if (token && isTokenExpired(token)) {
      console.log('Token expired, attempting refresh...');
      try {
        const refreshResponse = await fetch('http://localhost:8000/token/refresh', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (refreshResponse.ok) {
          const newTokenData = await refreshResponse.json();
          token = newTokenData.access_token;
          localStorage.setItem('access_token', token);
          console.log('Token refreshed successfully');
        } else {
          handleLogout();
          alert('Сессия истекла. Пожалуйста, войдите снова.');
          return;
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        handleLogout();
        alert('Ошибка обновления сессии. Пожалуйста, войдите снова.');
        return;
      }
    }

    if (!token) {
      alert('Для экспорта необходимо авторизоваться');
      return;
    }

    const numberedNodes = nodes.filter(node => node.data.numberDisplay);
    
    if (numberedNodes.length === 0) {
      alert('Нет блоков с номерами для экспорта!');
      return;
    }

    // Загружаем шаблоны атрибутов для всех этапов
    const stagesWithTemplates = [];
    for (const node of numberedNodes) {
      const stageId = node.data.numberDisplay;
      let templates = attributeTemplates[stageId];
      
      if (!templates) {
        templates = await loadAttributeTemplates(stageId);
      }

      stagesWithTemplates.push({
        id: stageId,
        name_stage: node.data.name_stage,
        file_fields: parseInt(node.data.file_fields, 10) || 0,
        text_fields: parseInt(node.data.text_fields, 10) || 3,
        desc: node.data.desc,
        duration: node.data.duration,
        condition: node.data.condition && node.data.condition.trim() !== '' ? node.data.condition : null,
        attribute_templates: templates || []
      });
    }

    // Проверяем заполненность основных полей
    const incompleteNodes = stagesWithTemplates.filter(stage => {
      return !stage.name_stage || !stage.desc || !stage.duration;
    });

    if (incompleteNodes.length > 0) {
      const incompleteNumbers = incompleteNodes.map(stage => stage.id).join(', ');
      alert(`Следующие блоки имеют незаполненные поля: ${incompleteNumbers}`);
      return;
    }

    // Проверяем условия ветвления
    const nodesWithMissingConditions = [];
    numberedNodes.forEach(node => {
      const children = getNodeChildren(node.id);
      if (children.length >= 2 && (!node.data.condition || node.data.condition.trim() === '')) {
        nodesWithMissingConditions.push(node.data.numberDisplay);
      }
    });

    if (nodesWithMissingConditions.length > 0) {
      const missingConditionNumbers = nodesWithMissingConditions.join(', ');
      alert(`Следующие блоки имеют 2+ детей, но не имеют условия ветвления: ${missingConditionNumbers}`);
      return;
    }

    // Проверяем что все поля имеют названия
    const nodesWithMissingTemplates = stagesWithTemplates.filter(stage => {
      const totalFields = stage.file_fields + stage.text_fields;
      return stage.attribute_templates.length !== totalFields;
    });

    if (nodesWithMissingTemplates.length > 0) {
      const missingTemplateNumbers = nodesWithMissingTemplates.map(stage => stage.id).join(', ');
      alert(`Следующие блоки имеют незаполненные названия полей: ${missingTemplateNumbers}`);
      return;
    }

    const caseName = prompt('Введите название дела:');
    if (!caseName) return;

    const caseDescription = prompt('Введите описание дела:');
    if (!caseDescription) return;

    const exportData = {
      name: caseName,
      description: caseDescription,
      stages: stagesWithTemplates
    };

    console.log('Отправляемые данные:', exportData);

    try {
      const response = await fetch('http://localhost:8000/case_templates/export/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(exportData),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Данные успешно экспортированы! ID дела: ${result.id}`);
        console.log('Ответ сервера:', result);
      } else {
        const error = await response.json();
        alert(`Ошибка при экспорте: ${error.detail}`);
        console.error('Ошибка сервера:', error);
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка при отправке данных на сервер. Проверьте, запущен ли сервер.');
    }
  }, [nodes, edges, getNodeChildren, attributeTemplates, loadAttributeTemplates]);

  // Функция для обновления номеров всех блоков
  const updateBlockNumbers = useCallback(() => {
    if (nodes.length === 0) {
      setRootNodeId(null);
      return;
    }

    const rootNodes = nodes.filter(node => 
      !edges.some(edge => edge.target === node.id)
    );

    if (rootNodes.length > 0 && !rootNodeId) {
      setRootNodeId(rootNodes[0].id);
    }

    if (!rootNodeId || !nodes.find(n => n.id === rootNodeId)) {
      setNodes(nds => nds.map(node => ({
        ...node,
        data: { ...node.data, number: null, numberDisplay: '' }
      })));
      return;
    }

    const childrenMap = {};
    edges.forEach(edge => {
      if (!childrenMap[edge.source]) {
        childrenMap[edge.source] = [];
      }
      childrenMap[edge.source].push(edge.target);
    });

    const updateNumbersRecursively = (nodeId, parentNumber = null) => {
      const node = nodes.find(n => n.id === nodeId);
      if (!node) return;

      let newNumber;
      let newNumberDisplay;

      if (!parentNumber) {
        newNumber = [1];
        newNumberDisplay = '1';
      } else {
        const siblings = childrenMap[parentNumber.parentId] || [];
        const siblingIndex = siblings.indexOf(nodeId);
        
        newNumber = [parentNumber.number[0] + 1];
        
        if (parentNumber.number.length > 1) {
          newNumber.push(...parentNumber.number.slice(1));
        }
        
        if (siblings.length > 1) {
          newNumber.push(siblingIndex + 1);
        }
        
        newNumber = newNumber.slice(0, 4);
        newNumberDisplay = newNumber.join('.');
      }

      setNodes(nds => nds.map(n => 
        n.id === nodeId 
          ? { 
              ...n, 
              data: { 
                ...n.data, 
                number: newNumber,
                numberDisplay: newNumberDisplay
              } 
            } 
          : n
      ));

      const children = childrenMap[nodeId] || [];
      children.forEach(childId => {
        updateNumbersRecursively(childId, {
          parentId: nodeId,
          number: newNumber
        });
      });
    };

    updateNumbersRecursively(rootNodeId);
  }, [nodes, edges, rootNodeId, setNodes]);

  useEffect(() => {
    updateBlockNumbers();
  }, [edges, nodes.length, updateBlockNumbers]);

  const onConnect = useCallback(
    (params) => {
      let edgeParams = { ...params };
      if (params.sourceHandle && params.sourceHandle.startsWith('condition-')) {
        const sourceNode = nodes.find(n => n.id === params.source);
        if (sourceNode && sourceNode.data.condition) {
          edgeParams = {
            ...params,
            label: sourceNode.data.condition,
            labelBgStyle: { fill: '#ff6b6b', fillOpacity: 0.8 },
            labelStyle: { fill: 'white' },
          };
        }
      }
      setEdges((eds) => addEdge(edgeParams, eds));
    },
    [setEdges, nodes]
  );

  const addNode = useCallback(() => {
    const newNode = {
      id: uuidv4(),
      type: 'customModified',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { 
        ...stableNodeData,
        file_fields: 0, // начальное значение
        text_fields: 0, // начальное значение
        desc: '', 
        duration: '',
        name_stage: '',
        condition: '',
        number: null,
        numberDisplay: ''
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes, stableNodeData]);

  // Pass edges to nodes for connection counting
  const nodesWithEdges = useMemo(() => 
    nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        edges: edges
      }
    })), [nodes, edges]
  );

  return (
    <div style={{ width: '100%', height: '800px', position: 'relative' }}>
      <button 
        onClick={addNode} 
        style={{ 
          position: 'absolute', 
          top: '10px', 
          left: '10px', 
          zIndex: 10,
          background: '#007bff',
          color: 'white',
          border: 'none',
          padding: '10px 15px',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Добавить блок
      </button>
      
      <button 
        onClick={exportToAPI} 
        style={{ 
          position: 'absolute', 
          top: '10px', 
          left: '150px', 
          zIndex: 10,
          background: '#28a745',
          color: 'white',
          border: 'none',
          padding: '10px 15px',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Сохранить шаблон дела
      </button>
      
      <ReactFlow
        nodes={nodesWithEdges}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        connectionLineStyle={{ stroke: '#ddd', strokeWidth: 2 }}
        connectionRadius={20}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>

      <AttributePanel
        isOpen={attributePanel.isOpen}
        onClose={() => setAttributePanel({ isOpen: false, currentNode: null })}
        currentNode={attributePanel.currentNode}
        onSaveAttributes={handleSaveAttributes}
        onUpdateNodeData={updateNodeData}
      />
    </div>
  );
};

export default FlowChartModified;