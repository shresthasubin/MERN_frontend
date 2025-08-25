import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {toast} from 'react-toastify'
import { privateAPI, publicAPI } from '../../utils/config';

const EmployeeManager = () => {
    const [employees, setEmployees] = useState([])
    const [departments, setDepartments] = useState([])
    const [formData, setFormData] = useState({})
    const [profileImage, setProfileImage] = useState(null)
    const [editingId, setEditingId] = useState(null)

    useEffect(() => {
        
        fetchDepartments();
        fetchEmployees();
    }, [])

    const fetchEmployees = async () => {
        try {
            // const token = Cookies.get('token');
            // console.log(token)
            const res = await privateAPI.get('/employees/get')
            setEmployees(res.data.data)
            console.log(res.data.data);
            
        } catch (err) {
            console.error('Error fetching employees:', err.message)
        }
    }

    const fetchDepartments = async () => {
        try {
            const res = await publicAPI.get('/department/All/get')
            setDepartments(res.data.data);
        } catch (err) {
            console.log('Error fetching departments:', err)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({...prev, [name]:value}))
    }
    const handleCancelEdit = (e) => {
        setEditingId(null)
        setFormData({
            name: '',
            email: '',
            password: '',
            designation: '',
            salary: '',
            phoneNumber: '',
            address: '',
            role: 'employee',
            department: ''
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const data = new FormData();
            
            Object.entries(formData).forEach(([key, value]) => {
                console.log(key, value);
                data.append(key, value)
            });
            if (profileImage) {
                data.append('profileImage', profileImage);
            }

            if (editingId) {
                await publicAPI.put(`/employees/update/${editingId}`,data)
                toast.success('Successfully Updated 🎉', {
                    position: 'top-right',
                    autoClose: 2000,
                    hideProgressBar: false,
                })
            } else {
                await publicAPI.post('/employees/create',data)
                toast.success('Successfully Created 🎉', {
                    position: 'top-right',
                    autoClose: 2000,
                    hideProgressBar: false,
                })

            }   
            fetchEmployees()
            setFormData({})
            setProfileImage(null)
            setEditingId(null)
        } catch (err) {
            console.log('Error saving employee:', err.message)
            toast.error('Something went wrong ❌', {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: false,
            });
        }
        }
        const handleEdit = (emp) => {
            setEditingId(emp._id);
            setFormData({
                name: emp.name || "",
                email: emp.email || "",
                password: "",
                designation: emp.designation || "",
                salary: emp.salary || "",
                phoneNumber: emp.phoneNumber || "",
                address: emp.address || "",
                role: emp.role || "employee",
            });
        }

        const handleDelete = async (id) => {
            try {
                await publicAPI.delete(`/employees/delete/${id}`)

                toast.success('Successfully Deleted 🎉', {
                    position: 'top-right',
                    autoClose: 2000,
                    hideProgressBar: false,
                })
                fetchEmployees();
            } catch (err) {
                console.log('Error deleting data: ', err)
                toast.error('Ohh Noooo 🎉', {
                    position: 'top-right',
                    autoClose: 2000,
                    hideProgressBar: false,
                })
            }
        }
    
  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
        <h2 className='text-3xl font-bold mb-6 text-blue-700'>
            Employee Manager
        </h2>
        <form 
            onSubmit={handleSubmit} 
            encType='multipart/form-data' 
            className='bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-4 mb-10'
        >
            <input 
                name='name' 
                value={formData.name} 
                onChange={handleChange} 
                placeholder='Full Name' 
                required 
                className='p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400'  
            />
            <input 
                name='email' 
                value={formData.email} 
                onChange={handleChange} 
                placeholder='Email' 
                required 
                className='p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400'  
            />
            {
                !editingId && (
                    <input
                        name='password'
                        type='password'
                        value= {formData.password}
                        onChange = {handleChange}
                        placeholder='Password'
                        required
                        className='p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400'
                    />
                )
            }
            <input  
                name='designation' 
                value={formData.designation} 
                onChange={handleChange} 
                placeholder='Designation' 
                required 
                className='p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400'  
            />
            <input 
                name='salary' 
                type='number'
                value={formData.salary} 
                onChange={handleChange} 
                placeholder='Salary' 
                required 
                className='p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400'  
            />
            <input 
                name='phoneNumber' 
                value={formData.phoneNumber} 
                onChange={handleChange} 
                placeholder='Phone Number' 
                required
                className='p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400'  
            />
            <input 
                name='address'
                value={formData.address}
                onChange={handleChange}
                placeholder='Address'
                required
                className='p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400'
            />
            <input 
                name='role'
                value={formData.role}
                onChange={handleChange}
                placeholder='Role'
                required
                className='p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400'
            />
            <input
                type='file'
                name='profileImage'
                value={formData.profileImage}
                onChange={handleChange}
                placeholder='Profile Image'
                accept='image/'
                required
                className='p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400'
            />
            {/* <input 
                name='department' 
                value={formData.department} 
                onChange={handleChange} 
                placeholder='Department' 
                required 
                className='p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400'  
            /> */}

            <select name='department' className='border-2' value={formData.department} onChange={handleChange}>
                <option value="">Select Department</option>
                {
                    departments.map((dept) => {
                        return (
                            <option key={dept._id} value={dept._id}>{dept.name}</option>
                        )
                    })
                }   
            </select>

            <div className='flex gap-2'>
                <button type='submit' className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'>
                    {editingId? 'Update Employee':'Add employee'}
                </button>
                {
                    editingId && (
                        <button
                            type='button'
                            onClick={handleCancelEdit}
                            className='bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500'
                        >
                            Cancel
                        </button>
                    )
                }
            </div>
        </form>
        <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Employment List</h3>
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Designation</th>
              <th className="border px-4 py-2">Salary</th>
              <th className="border px-4 py-2">Phone Number</th>
              <th className="border px-4 py-2">Address</th>
              <th className="border px-4 py-2">Role</th>
              <th className="border px-4 py-2">Department</th> 
              <th className="border px-4 py-2">Actions</th> 
              
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id}>
                <td className="border px-4 py-2">{emp.name}</td>
                <td className="border px-4 py-2">{emp.email}</td>
                <td className="border px-4 py-2">{emp.designation}</td>
                <td className="border px-4 py-2">{emp.salary}</td>
                <td className="border px-4 py-2">{emp.phoneNumber}</td>
                <td className="border px-4 py-2">{emp.address}</td>
                <td className="border px-4 py-2">{emp.role}</td>
                <td className="border px-4 py-2">{emp.department.name || 'N/A'}</td>
                <td className="border px-4 py-2 flex gap-2 justify-center">
                  <button
                    onClick={() => handleEdit(emp)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(emp._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {employees.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No Employee found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default EmployeeManager
