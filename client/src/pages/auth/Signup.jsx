import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useState } from 'react';

const base_url = "http://localhost:7001";

const Signup = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const result = await axios.post(`${base_url}/api/auth/register`, { username, email, password, role }, {
                headers: { "Authorization": "application/json" },
                validateStatus: () => true
            });
            console.log(result);
            if (result.status === 201) {
                setUsername("");
                setEmail("");
                setPassword("");
                setRole("");
                toast.success(result.data.message, { duration: 2000 });
                setTimeout(() => {
                    navigate("/login")
                }, 2000);
            }
            else if (result.status === 400) {
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
                        Create an Account
                    </h1>
                    <form className="space-y-4 my-4">
                        <div className='form-group'>
                            <label className='form-label'>Username</label>
                            <input type='text' className='form-control' value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className='form-group'>
                            <label className='form-label'>Email</label>
                            <input type='email' className='form-control' value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className='form-group'>
                            <label className='form-label'>Password</label>
                            <input type='password' className='form-control' value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className='form-group'>
                            <label className='form-label'>Roles</label><br />
                            <span className='form-radios px-3'>
                                <input type='radio' className='form-radio mx-1' name='users' value="admin" onClick={(e) => setRole(e.target.value)} />Admin
                            </span>
                            <span className='form-radios px-3'>
                                <input type='radio' className='form-radio mx-1' name='users' value="manager" onClick={(e) => setRole(e.target.value)} />Manager
                            </span>
                            <span className='form-radios px-3'>
                                <input type='radio' className='form-radio mx-1' name='users' value="user" onClick={(e) => setRole(e.target.value)} />User
                            </span>
                        </div>
                        <hr />
                        <button className='btn btn-primary mx-2 px-3' onClick={handleSignUp}>SignUp</button>
                        <span className='mx-3'>You have already Account ? <Link to="/login">Login</Link></span>
                    </form>
                </div>
            </div>
            <Toaster />
        </>
    )
}

export default Signup;