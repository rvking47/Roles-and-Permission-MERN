import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Layout from '../layout/Layout';

const UserHome = () => {
  const navigate = useNavigate();

  return (
    <>
      <Layout>
        
      </Layout>
      <Toaster />
    </>
  )
}

export default UserHome