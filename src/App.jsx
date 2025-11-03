import {useState} from "react"
import IntroSection from "./components/IntoSection.jsx"
import TabsSection from "./components/TabsSectiom.jsx"
import FeedbackSection from "./components/FeedbackSection.jsx"
import Button from "./components/Button/Button.jsx"
import FlowChartModified from "./components/FlowChartModified.jsx"
import CreateCase from "./components/CreateCase.jsx"
import CaseList from "./components/CaseList.jsx" 
import {styled} from "styled-components"
import ExecutorTasks from "./components/ExecutorTasks.jsx"

const HeaderContainer = styled.header`
  height: 50px;
  display: flex;
  padding: 0 2rem;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  background: #fafafa;
`

function App() {
  const [tab, setTab] = useState("Войти")
  const [text_autorization, set_Autorization] = useState("Войти");
  const [login, set_Login] = useState("aboba");
  const [userRole, setUserRole] = useState(null);

  const handleAuthorizationSuccess = (status) => {
    set_Autorization(status);
    setTab("main");
  };
  
  const handleLogin_user = (userData) => {
    set_Login(userData?.username);
    setUserRole(userData?.role);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    localStorage.removeItem('user_role');
    set_Autorization("Войти");
    setTab("Войти");
    setUserRole(null);
    set_Login("aboba");
  };

  const canCreateCases = () => {
    return userRole === 'admin' || userRole === 'manager';
  };

  const isExecutor = () => {
    return userRole === 'user';
  };

  const getHeaderButton = () => {
    if (text_autorization !== "authorized") {
      return null;
    }
    
    if (tab === "profile") {
      return <Button onClick={() => setTab("main")}>На главную</Button>;
    } else {
      return <Button onClick={() => setTab("profile")}>Профиль</Button>;
    }
  };

  return (
    <>
      <HeaderContainer>
        {tab === "Войти" && (
          <Button onClick={() => setTab("feedback")}>Войти</Button>
        )} 
        {getHeaderButton()}             
      </HeaderContainer>
      
      <main>
        {tab === "Войти" && <IntroSection/>}
  
        {(tab === "profile" && text_autorization === "authorized") && (
          <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h3>Профиль пользователя</h3>
            <div style={{ 
              background: 'white', 
              padding: '20px', 
              borderRadius: '8px', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              marginBottom: '20px'
            }}>
              <p><strong>Логин:</strong> {login}</p>
              <p><strong>Роль:</strong> {userRole}</p>
              {canCreateCases() && <p><strong>Доступ:</strong> Создание дел разрешено</p>}
              {isExecutor() && <p><strong>Доступ:</strong> Просмотр задач исполнителя</p>}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button onClick={() => setTab("main")}>На главную</Button>
              <Button 
                onClick={handleLogout}
                style={{ backgroundColor: '#dc3545' }}
              >
                Выйти из аккаунта
              </Button>
            </div>
          </div>
        )}

        {/* TabsSection показываем всем авторизованным пользователям */}
        {(tab === "main" && text_autorization === "authorized") && ( 
          <TabsSection 
            active={tab} 
            onChange={(current) => setTab(current)}
            onCreateCase={() => setTab("creation cases")}
            onViewCases={() => setTab("cases list")}
            onViewTasks={() => setTab("executor tasks")}
            userRole={userRole}
          />
        )}         

        {tab === "feedback" && ( 
          <FeedbackSection 
            onAuthorizationSuccess={handleAuthorizationSuccess} 
            login_user={handleLogin_user}
            userRole={userRole}
          />
        )} 

        {/* Компонент задач исполнителя - доступен только для user */}
        {(tab === "executor tasks" && text_autorization === "authorized" && isExecutor()) && (
          <ExecutorTasks 
            onBack={() => setTab("main")}
            userRole={userRole}
            currentUser={{ username: login }}
          />
        )}    

        {tab === "react flow" && text_autorization === "authorized" && <FlowChartModified/>}
        
        {/* Раздел для создания дела - только для админов и менеджеров */}
        {tab === "creation cases" && text_autorization === "authorized" && canCreateCases() && (
          <CreateCase 
            onCancel={() => setTab("main")}
            onCreateSuccess={(createdCase) => {
              console.log('Дело создано:', createdCase);
              setTab("main");
            }}
          />
        )}

        {/* Раздел для просмотра дел - только для админов и менеджеров */}
        {tab === "cases list" && text_autorization === "authorized" && canCreateCases() && (
          <CaseList 
            onBack={() => setTab("main")}
            userRole={userRole}
          />
        )}
      </main>
    </>
  )
}

export default App