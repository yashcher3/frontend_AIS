import Button from "./Button/Button"

export default function TabsSection({active, onChange, onCreateCase, onViewCases, onViewTasks, userRole}) {
    const canCreate = userRole === 'admin' || userRole === 'manager';
    const isExecutor = userRole === 'user';
    
    return (
        <section style={{marginBottom: "1rem", display: "flex", gap: "10px", flexWrap: "wrap"}}>
            <Button isActive={active === "main"} onClick={() => onChange("main")}>
                Главная
            </Button>
            
            {canCreate && (
                <>
                    <Button isActive={active === "react flow"} onClick={() => onChange("react flow")}>
                        Создать шаблон
                    </Button>
                    <Button 
                        isActive={active === "creation cases"} 
                        onClick={onCreateCase}
                        style={{backgroundColor: "#28a745"}}
                    >
                        Создать дело
                    </Button>
                    <Button 
                        isActive={active === "cases list"} 
                        onClick={onViewCases}
                        style={{backgroundColor: "#17a2b8"}}
                    >
                        Просмотр дел
                    </Button>
                </>
            )}
            
            {isExecutor && (
                <Button 
                    isActive={active === "executor tasks"} 
                    onClick={onViewTasks}
                    style={{backgroundColor: "#ffc107", color: "#000"}}
                >
                    Мои задачи
                </Button>
            )}
            
            {!canCreate && !isExecutor && (
                <div style={{ 
                    padding: '10px', 
                    backgroundColor: '#f8f9fa', 
                    border: '1px solid #dee2e6',
                    borderRadius: '4px',
                    color: '#6c757d'
                }}>
                    <strong>Только для руководителей:</strong> Создание шаблонов и дел доступно администраторам и руководителям
                </div>
            )}
        </section>
    )
}