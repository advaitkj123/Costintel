// Mock Database using localStorage
// Fully simulates backend auth as requested

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const login = async (email: string, password: string) => {
    await delay(600); // Simulate network request
    
    const usersStr = localStorage.getItem('costintel_users');
    const users = usersStr ? JSON.parse(usersStr) : [];
    
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (!user) {
        throw { response: { data: { detail: 'Invalid email or password' } } };
    }
    
    // Create session
    const sessionData = { isAuthenticated: true, userId: user.id, name: user.full_name, workspace: user.workspace_name };
    localStorage.setItem('costintel_session', JSON.stringify(sessionData));
    
    return { access_token: "mock-jwt-token-123", user };
};

export const signup = async (userData: any) => {
    await delay(800); // Simulate network request
    
    const usersStr = localStorage.getItem('costintel_users');
    const users = usersStr ? JSON.parse(usersStr) : [];
    
    if (users.find((u: any) => u.email === userData.email)) {
        throw { response: { data: { detail: 'Account with this email already exists' } } };
    }
    
    const newUser = { 
        id: Date.now().toString(), 
        ...userData 
    };
    
    users.push(newUser);
    localStorage.setItem('costintel_users', JSON.stringify(users));
    
    return { access_token: "mock-jwt-token-created", user: newUser };
};

export const logout = () => {
    localStorage.removeItem('costintel_session');
};

export const isAuthenticated = () => {
    const sessionStr = localStorage.getItem('costintel_session');
    if (!sessionStr) return false;
    
    try {
        const session = JSON.parse(sessionStr);
        return session.isAuthenticated === true;
    } catch {
        return false;
    }
};

export const getCurrentUser = () => {
    const sessionStr = localStorage.getItem('costintel_session');
    return sessionStr ? JSON.parse(sessionStr) : null;
};
