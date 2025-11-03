import React, { useCallback, useState, useEffect } from 'react';
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

// Modified Custom Node Component with external Add Condition button
const CustomNodeModified = ({ data, id }) => {
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

  return (
    <div style={{ 
      padding: '15px', 
      border: '1px solid #ddd', 
      borderRadius: '5px', 
      background: '#fff', 
      width: '320px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      position: 'relative'
    }}>
      {/* Input Handle - Left */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#555' }}
      />
      
      {/* Output Handles - Right */}
      <Handle
        type="source"
        position={Position.Right}
        id="default"
        style={{ top: '50%', background: '#555' }}
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
      <div style={{ marginBottom: '10px' }}>
        <label>Количество текстовых документов:</label>
        <input 
          type="number" 
          value={data.docs || 0} 
          onChange={(e) => handleUpdateData('docs', e.target.value)} 
          style={{ width: '100%' }}
          min="0"
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Количество png документов:</label>
        <input 
          type="number" 
          value={data.png || 0} 
          onChange={(e) => handleUpdateData('png', e.target.value)} 
          style={{ width: '100%' }}
          min="0"
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Количество текстовых полей:</label>
        <input 
          type="number" 
          value={data.text_fields || 3} 
          onChange={(e) => handleUpdateData('text_fields', e.target.value)} 
          style={{ width: '100%' }}
          min="0"
        />
      </div>
      
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
};

const nodeTypes = {
  customModified: CustomNodeModified,
};

const FlowChartModified = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [rootNodeId, setRootNodeId] = useState(null);

  // Функция для получения детей узла
  const getNodeChildren = useCallback((nodeId) => {
    return edges
      .filter(edge => edge.source === nodeId)
      .map(edge => nodes.find(node => node.id === edge.target))
      .filter(Boolean);
  }, [edges, nodes]);

  // Функция для экспорта данных в консоль

// Проверка токенов
const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= exp;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

  
// Функция для экспорта данных в API

const exportToAPI = useCallback(async () => {
  let token = localStorage.getItem('access_token');
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('user_role');
  
  console.log('=== Frontend Debug ===');
  console.log('Token:', token ? `${token.substring(0, 20)}...` : 'missing');
  console.log('Username:', username);
  console.log('Role:', role);

  // Проверяем истек ли токен
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
        // Если не удалось обновить, разлогиниваем
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

  // Проверяем, что все обязательные поля заполнены
  const incompleteNodes = numberedNodes.filter(node => {
    const data = node.data;
    return !data.name_stage || data.docs === undefined || data.png === undefined || 
           data.text_fields === undefined || !data.desc || !data.duration;
  });

  if (incompleteNodes.length > 0) {
    const incompleteNumbers = incompleteNodes.map(node => node.data.numberDisplay).join(', ');
    alert(`Следующие блоки имеют незаполненные поля: ${incompleteNumbers}`);
    return;
  }

  // Проверяем условия ветвления для блоков с 2+ детьми
  const nodesWithMissingConditions = [];
  
  numberedNodes.forEach(node => {
    const children = getNodeChildren(node.id);
    
    // Если у узла 2 или больше детей, проверяем наличие условия
    if (children.length >= 2) {
      if (!node.data.condition || node.data.condition.trim() === '') {
        nodesWithMissingConditions.push(node.data.numberDisplay);
      }
    }
  });

  if (nodesWithMissingConditions.length > 0) {
    const missingConditionNumbers = nodesWithMissingConditions.join(', ');
    alert(`Следующие блоки имеют 2+ детей, но не имеют условия ветвления: ${missingConditionNumbers}`);
    return;
  }

  // Запрашиваем название и описание дела
  const caseName = prompt('Введите название дела:');
  if (!caseName) return;

  const caseDescription = prompt('Введите описание дела:');
  if (!caseDescription) return;

  // Формируем данные для экспорта
  const exportData = {
    name: caseName,
    description: caseDescription,
    stages: numberedNodes.map(node => {
      const children = getNodeChildren(node.id);
      
      return {
        id: node.data.numberDisplay,
        name_stage: node.data.name_stage,
        text_doc: parseInt(node.data.docs, 10) || 0,
        png_doc: parseInt(node.data.png, 10) || 0,
        text_fields: parseInt(node.data.text_fields, 10) || 3,
        desc: node.data.desc,
        duration: node.data.duration,
        condition: node.data.condition && node.data.condition.trim() !== '' ? node.data.condition : null
        // Убираем children из отправляемых данных
      };
    })
  };

  console.log('Отправляемые данные:', exportData);

  try {
    // Отправляем данные на сервер
    
    // const response = await fetch('http://localhost:8000/cases/export/', {
    //const response = await fetch('http://localhost:8000/test/export', {
    
    const response = await fetch('http://localhost:8000/cases/export/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',  // ← ДОБАВЬТЕ ЭТУ СТРОЧКУ
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
}, [nodes, edges, getNodeChildren]);

  // Функция для обновления номеров всех блоков
  const updateBlockNumbers = useCallback(() => {
    if (nodes.length === 0) {
      setRootNodeId(null);
      return;
    }

    // Находим корневой узел (без входящих связей)
    const rootNodes = nodes.filter(node => 
      !edges.some(edge => edge.target === node.id)
    );

    // Устанавливаем корневой узел если его нет
    if (rootNodes.length > 0 && !rootNodeId) {
      setRootNodeId(rootNodes[0].id);
    }

    // Если нет корневого узла, сбрасываем все номера
    if (!rootNodeId || !nodes.find(n => n.id === rootNodeId)) {
      setNodes(nds => nds.map(node => ({
        ...node,
        data: { ...node.data, number: null, numberDisplay: '' }
      })));
      return;
    }

    // Создаем карту детей для каждого узла
    const childrenMap = {};
    edges.forEach(edge => {
      if (!childrenMap[edge.source]) {
        childrenMap[edge.source] = [];
      }
      childrenMap[edge.source].push(edge.target);
    });

    // Рекурсивная функция для обновления номеров
    const updateNumbersRecursively = (nodeId, parentNumber = null) => {
      const node = nodes.find(n => n.id === nodeId);
      if (!node) return;

      let newNumber;
      let newNumberDisplay;

      if (!parentNumber) {
        // Корневой узел
        newNumber = [1];
        newNumberDisplay = '1';
      } else {
        // Получаем детей текущего родителя
        const siblings = childrenMap[parentNumber.parentId] || [];
        const siblingIndex = siblings.indexOf(nodeId);
        
        // Новая логика нумерации:
        // - Увеличиваем первую цифру на 1
        // - Копируем остальные цифры родителя
        // - Добавляем порядковый номер только если у родителя несколько детей
        newNumber = [parentNumber.number[0] + 1];
        
        // Копируем остальные цифры родителя (если есть)
        if (parentNumber.number.length > 1) {
          newNumber.push(...parentNumber.number.slice(1));
        }
        
        // Добавляем порядковый номер только если у родителя несколько детей
        if (siblings.length > 1) {
          newNumber.push(siblingIndex + 1);
        }
        
        // Ограничиваем глубину до 4 уровней
        newNumber = newNumber.slice(0, 4);
        newNumberDisplay = newNumber.join('.');
      }

      // Обновляем узел
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

      // Рекурсивно обновляем детей
      const children = childrenMap[nodeId] || [];
      children.forEach(childId => {
        updateNumbersRecursively(childId, {
          parentId: nodeId,
          number: newNumber
        });
      });
    };

    // Запускаем обновление с корневого узла
    updateNumbersRecursively(rootNodeId);
  }, [nodes, edges, rootNodeId, setNodes]);

  // Обновляем номера при изменении связей или узлов
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

  const addNode = () => {
    const newNode = {
      id: uuidv4(),
      type: 'customModified',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { 
        docs: 0, 
        png: 0,
        text_fields: 3,
        desc: '', 
        duration: '',
        name_stage: '',
        condition: '',
        onUpdateConditions: updateNodeConditions,
        onUpdateNodeData: updateNodeData,
        number: null,
        numberDisplay: ''
      },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  // Pass edges to nodes for connection counting
  const nodesWithEdges = nodes.map(node => ({
    ...node,
    data: {
      ...node.data,
      edges: edges
    }
  }));

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
      
      {/* Кнопка экспорта */}
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
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default FlowChartModified;