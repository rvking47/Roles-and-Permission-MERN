import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useState } from 'react';

const base_url = "http://localhost:7001";

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const result = await axios.post(`${base_url}/api/auth/login`, { username, password }, {
                headers: { "Authorization": "application/json" },
                validateStatus: () => true
            });
            console.log(result);
            if (result.status === 200) {
                localStorage.setItem("token", result.data.token);
                localStorage.setItem("role", result.data.user.role);
                localStorage.setItem("user", JSON.stringify(result.data.user));
                toast.success(result.data.message);
                setUsername("");
                setPassword("");
                setTimeout(() => {
                    if (result.data.user.role === "admin") {
                        navigate("/users/admin")
                    }
                    else if (result.data.user.role === "manager") {
                        navigate("/users/manager")
                    }
                    else {
                        navigate("/users/user")
                    }
                }, 2000)
            }
            else if (result.status === 404) {
                toast.error(result.data.message);
            }
            else {
                toast.error("Something Wronge!!");
            }
        }
        catch (err) {
            toast.error("Server Error", err);
        }
    }

    return (
        <>
        <div className="flex items-center justify-center min-h-screen bg-gray-100 slabo-27px-regular">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-2xl font-semibold text-center mb-6 text-gray-800">
                    Login
                </h1>
                <form className="space-y-4 my-4">
                    <div className='form-group'>
                        <label className='form-label'>Username</label>
                        <input type='text' className='form-control' value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className='form-group'>
                        <label className='form-label'>Password</label>
                        <input type='password' className='form-control mb-4' value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <hr />
                    <button className='btn btn-primary mx-2  px-4' onClick={handleLogin}> LogIn </button>
                    <span className='mx-3'>You have no Account ? <Link to="/signup">Signup</Link></span>
                </form>
            </div>
        </div>
        <Toaster />
        </>
    )
}

export default Login