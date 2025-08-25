import {useEffect, useState} from 'react';
import {privateAPI, publicAPI} from '../../utils/config.js'
import { toast } from 'react-toastify';

const AttendanceManager = () => {
    const [attendance, setAttendance] = useState([])
    const [employees, setEmployee] = useState([])
    const [loading, setLoading] = useState(true)
    const [editingId, setEditingId] = useState(null)

    const [formData, setFormData] = useState({
        userId: "",
        date: "",
        clockIn: "",
        clockOut: "",
        status: "present",
        notes: "",
    })

    const handleChange = (e) => {
        const {name, value} = e.target
        setFormData(prev => ({...prev, [name]: value}))
    }

    const fetchAttendance = async () => {
        try {
            const res = await publicAPI.get('attendance/get');
            setAttendance(res.data.data)
            setLoading(false)
        } catch (err) {
            console.error('Error fetching attendance', err)
            setLoading(true)
        }
    } 

    const fetchEmployee = async() => {
        try {
            const res = await publicAPI.get('/employees/get');
            setEmployee(res.data.data)
        } catch (err) {
            console.error('Error fetching employees', err)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fullClockIn = formData.clockIn
        ? new Date(`${formData.date}T${formData.clockIn}`)
        : null

        const fullClockOut = formData.clockOut
        ? new Date(`${formData.date}T${formData.clockOut}`)
        : null

        try {
            if(editingId) {
                await publicAPI.put(`attendance/update/${editingId}`, {
                    ...formData,
                    clockIn: fullClockIn,
                    clockOut: fullClockOut,
                })

                toast.success('successfully updated', {
                    position: 'top-right',
                    autoClose: 2000,
                    hideProgressBar: false
                })
                setEditingId(null)
            } else {
                await publicAPI.post('attendance/create', {
                    ...formData,
                    clockIn: fullClockIn,
                    clockOut: fullClockOut,
                })
                toast.success('Successfully created', {
                    position: 'top-right',
                    autoClose: 2000,
                    hideProgressBar: false
                })
            }
            fetchAttendance()
            setFormData({
                userId: "",
                date: "",
                clockIn: "",
                clockOut: "",
                status: "present",
                notes: "",
            })
        } catch (err) {
            console.error('Error saving attendance', err)
        }
            
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this record?")) return;
        try {
            await publicAPI.delete(`attendance/delete/${id}`);
            toast.success('Deleted successfully',{
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: false
            })
        } catch (err) {
            console.err('Error deleting data', err)
            toast.error('Deleting failed', {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: false
            })
        }
    }

    useEffect(() => {
        fetchAttendance();
        fetchEmployee();
    }, [])
    return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Attendance Manager</h2>
 
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <select
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name}
                {/* ({emp.email}) */}
              </option>
            ))}
          </select>
 
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="time"
            name="clockIn"
            value={formData.clockIn}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="time"
            name="clockOut"
            value={formData.clockOut}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="half-day">Half Day</option>
            <option value="leave">Leave</option>
          </select>
          <input
            type="text"
            name="notes"
            placeholder="Notes"
            value={formData.notes}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded col-span-1 md:col-span-3"
          >
            {editingId? 'Edit Attendance' : 'Add Attendance'}
          </button>
        </form>
      </div>
 
      <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b p-2">Employee</th>
              <th className="border-b p-2">Date</th>
              <th className="border-b p-2">Clock In</th>
              <th className="border-b p-2">Clock Out</th>
              <th className="border-b p-2">Status</th>
              <th className="border-b p-2">Notes</th>
              <th className="border-b p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((record) => (
              <tr key={record._id}>
                <td className="border-b p-2">{record.userId?.name || "N/A"}</td>
                <td className="border-b p-2">
                  {new Date(record.date).toLocaleDateString()}
                </td>
                <td className="border-b p-2">
                  {record.clockIn
                    ? new Date(record.clockIn).toLocaleTimeString()
                    : "-"}
                </td>
                <td className="border-b p-2">
                  {record.clockOut
                    ? new Date(record.clockOut).toLocaleTimeString()
                    : "-"}
                </td>
                <td className="border-b p-2 capitalize">{record.status}</td>
                <td className="border-b p-2">{record.notes}</td>
                <td className="border-b p-2">
                  <button
                    onClick={() => {
                      setFormData({
                        userId: record.userId._id,
                        date: record.date.split("T")[0],
                        clockIn: record.clockIn
                          ? new Date(record.clockIn).toTimeString().slice(0, 5)
                          : "",
                        clockOut: record.clockOut
                          ? new Date(record.clockOut).toTimeString().slice(0, 5)
                          : "",
                        status: record.status,
                        notes: record.notes,
                      });
                      setEditingId(record._id);
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded mx-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(record._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {attendance.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center p-4">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
 
export default AttendanceManager;