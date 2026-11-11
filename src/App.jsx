import { AuthProvider } from './contexts/AuthContext';
import { AppRoutes } from './routes/AppRoutes'
import { Toaster } from 'react-hot-toast';

export function App() {
  return (
  <AuthProvider>
    <AppRoutes />
    <Toaster 
      position="top-right"
      containerStyle={{ zIndex: 99999 }} 
      toastOptions={{
        duration: 2500,
        style: {
          background: '#333',
          color: '#fff',
        },
      }} 
    />
  </AuthProvider>
  );
}

export default App;