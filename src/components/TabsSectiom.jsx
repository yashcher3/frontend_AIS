import Button from "./Button/Button"

export default function TabsSection({active, onChange, onCreateCase, onViewCases, onManagerApproval, userRole}) {
    const canCreate = userRole === 'admin' || userRole === 'manager';
    const isExecutor = userRole === 'user';
    
    return (
        <section style={{
            marginBottom: "1rem", 
            display: "flex", 
            gap: "8px", 
            flexWrap: "nowrap",
            alignItems: "center",
            overflowX: "auto",
            padding: "10px 0",
            minHeight: "50px"
        }}>
            {/* Кнопки для администраторов и менеджеров */}
            {canCreate && (
                <>
                    <Button 
                        isActive={active === "react flow"} 
                        onClick={() => onChange("react flow")}
                        style={{padding: "8px 16px", fontSize: "13px"}}
                    >
                        Создать шаблон
                    </Button>
                    
                    <Button 
                        isActive={active === "manager approval"} 
                        onClick={onManagerApproval}
                        style={{
                            padding: "8px 16px", 
                            fontSize: "13px",
                            backgroundColor: "#6f42c1", 
                            color: "white"
                        }}
                    >
                        Утверждение этапов
                    </Button>
                    
                    <Button 
                        isActive={active === "creation cases"} 
                        onClick={onCreateCase}
                        style={{
                            padding: "8px 16px", 
                            fontSize: "13px",
                            backgroundColor: "#28a745"
                        }}
                    >
                        Создать дело
                    </Button>
                    
                    <Button 
                        isActive={active === "cases list"} 
                        onClick={onViewCases}
                        style={{
                            padding: "8px 16px", 
                            fontSize: "13px",
                            backgroundColor: "#17a2b8"
                        }}
                    >
                        Просмотр дел
                    </Button>
                </>
            )}
            
            {/* Сообщение для пользователей без прав */}
            {!canCreate && !isExecutor && (
                <div style={{ 
                    padding: '8px 12px', 
                    backgroundColor: '#f8f9fa', 
                    border: '1px solid #dee2e6',
                    borderRadius: '4px',
                    color: '#6c757d',
                    fontSize: '13px'
                }}>
                    <strong>Только для руководителей:</strong> Создание шаблонов и дел доступно администраторам и руководителям
                </div>
            )}
        </section>
    )
}