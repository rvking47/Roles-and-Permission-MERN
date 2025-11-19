import axios from "axios";
import Charts from "../chart/Charts";
import Layout from "../layout/Layout"
import { FiUsers, FiActivity, FiUserPlus } from "react-icons/fi";

const base_url="http://localhost:7001";

const AdminHome = () => {

  const handleUsers=async()=>{
    try{
     const result=await axios.get(`${base_url}/api/auth/`)
    }
    catch(err)
    {

    }
  }

  return (
    <Layout>
      <div className="pt-20 ml-0 nunito-uniquifier">

        <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

        <div className="row g-4">

          {/* Total Users */}
          <div className="col-lg-4 col-md-6 col-sm-12">
            <div className="bg-white shadow-md p-5 rounded-xl flex items-center gap-4 hover:shadow-lg transition">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-lg text-2xl">
                <FiUsers />
              </div>
              <div>
                <h4 className="text-lg font-semibold">Total Users</h4>
                <p className="text-gray-500 text-sm">2,450</p>
              </div>
            </div>
          </div>

          {/* Active Users Today */}
          <div className="col-lg-4 col-md-6 col-sm-12">
            <div className="bg-white shadow-md p-5 rounded-xl flex items-center gap-4 hover:shadow-lg transition">
              <div className="bg-green-100 text-green-600 p-3 rounded-lg text-2xl">
                <FiActivity />
              </div>
              <div>
                <h4 className="text-lg font-semibold">Active Users Today</h4>
                <p className="text-gray-500 text-sm">320</p>
              </div>
            </div>
          </div>

          {/* New Registrations Today */}
          <div className="col-lg-4 col-md-6 col-sm-12">
            <div className="bg-white shadow-md p-5 rounded-xl flex items-center gap-4 hover:shadow-lg transition">
              <div className="bg-purple-100 text-purple-600 p-3 rounded-lg text-2xl">
                <FiUserPlus />
              </div>
              <div>
                <h4 className="text-lg font-semibold">New Registrations Today</h4>
                <p className="text-gray-500 text-sm">21</p>
              </div>
            </div>
          </div>

        </div>
        <Charts />

      </div>
    </Layout>

  )
}

export default AdminHome