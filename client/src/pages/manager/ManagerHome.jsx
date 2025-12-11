import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Layout from '../layout/Layout';
import { useEffect } from 'react';

const ManagerHome = () => {

  const navigate = useNavigate();

  return (
    <>
      <Layout>

      </Layout>
      <Toaster />
    </>
  )
}

export default ManagerHome