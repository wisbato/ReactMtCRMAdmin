import { useAuth } from '../context/AuthContext';

const useCan = () => {
    const { user } = useAuth();
    
    const can = (menuKey: any) => {
        if (!user) return false;
        if (user.role === 'admin') return true;
        return user.menuPermissions?.includes(menuKey) ;
    };

    return can;
};

export default useCan;