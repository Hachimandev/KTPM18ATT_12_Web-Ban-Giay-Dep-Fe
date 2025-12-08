import { Outlet } from 'react-router-dom';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import FloatingChatbot from '../common/FloatingChatbot';

const CustomerLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
            <FloatingChatbot />
        </div>
    );
};

export default CustomerLayout;