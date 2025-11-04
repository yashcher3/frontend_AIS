import Button from "./Button/Button"

export default function TabsSection({active, onChange, onCreateCase, onViewCases, onViewTasks, onManagerApproval, userRole}) {
    const canCreate = userRole === 'admin' || userRole === 'manager';
    const isExecutor = userRole === 'user';
    const canApprove = userRole === 'admin' || userRole === 'manager';
    
    // Определяем порядок кнопок
    const managerButtons = [];
    
    if (canCreate) {
        managerButtons.push(
            { key: "react flow", label: "Создать шаблон", onClick: () => onChange("react flow") },
            { key: "manager approval", label: "Утверждение этапов", onClick: onManagerApproval, style: {backgroundColor: "#6f42c1", color: "white"} },
            { key: "creation cases", label: "Создать дело", onClick: onCreateCase, style: {backgroundColor: "#28a745"} },
            { key: "cases list", label: "Просмотр дел", onClick: onViewCases, style: {backgroundColor: "#17a2b8"} }
        );
    }
    
    const executorButtons = isExecutor ? [
        { key: "executor tasks", label: "Мои задачи", onClick: onViewTasks, style: {backgroundColor: "#ffc107", color: "#000"} }
    ] : [];
    
    return (
        <section style={{
            marginBottom: "1rem", 
            display: "flex", 
            gap: "10px", 
            flexWrap: "nowrap", // Запрещаем перенос
            alignItems: "center",
            overflowX: "auto", // Добавляем горизонтальную прокрутку если нужно
            paddingBottom: "5px"
        }}>
            {/* Кнопки для администраторов и менеджеров */}
            {managerButtons.map(button => (
                <Button 
                    key={button.key}
                    isActive={active === button.key} 
                    onClick={button.onClick}
                    style={button.style}
                >
                    {button.label}
                </Button>
            ))}
            
            {/* Кнопка для исполнителей */}
            {executorButtons.map(button => (
                <Button 
                    key={button.key}
                    isActive={active === button.key} 
                    onClick={button.onClick}
                    style={button.style}
                >
                    {button.label}
                </Button>
            ))}
            
            {/* Сообщение для пользователей без прав */}
            {!canCreate && !isExecutor && (
                <div style={{ 
                    padding: '10px', 
                    backgroundColor: '#f8f9fa', 
                    border: '1px solid #dee2e6',
                    borderRadius: '4px',
                    color: '#6c757d',
                    whiteSpace: "nowrap"
                }}>
                    <strong>Только для руководителей:</strong> Создание шаблонов и дел доступно администраторам и руководителям
                </div>
            )}
        </section>
    )
}