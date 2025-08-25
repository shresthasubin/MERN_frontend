import React, {useState} from 'react'
import Dashboard from '../Dashboard'
import SideBar from '../../components/Admin/SideBar'

const EmployeeDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard')
    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return <Dashboard/>
            case "attendance":
                return <div>My Attendance Records</div>
            case "leave-requests":
                return <div>My leave requests</div>
            default:
                return <Dashboard/>
        }
    }

    return (
        <div className='flex min-h-screen bg-gray-100'>
            <SideBar activeTab={activeTab} setActiveTab={setActiveTab}/>
            <div className='flex-1 p-8'>{renderContent()}</div>
        </div>
    )
}

export default EmployeeDashboard
