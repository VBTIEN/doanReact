// src/pages/TeacherDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import teacherService from '../../services/teacher';
import getAll from '../../services/getAll';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ClassIcon from '@mui/icons-material/Class';
import GradeIcon from '@mui/icons-material/Grade';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import '../../styles/TeacherDashboard.css'; 


const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [classroomCode, setClassroomCode] = useState('');
  const [examCode, setExamCode] = useState('');
  const [students, setStudents] = useState([]);
  const [teachersInClassroom, setTeachersInClassroom] = useState([]);
  const [allTeachers, setAllTeachers] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [classroomOptions, setClassroomOptions] = useState([]);
  const [examOptions, setExamOptions] = useState([]);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: null,
  });

  console.log("user img: ", user);
    //Lấy thông tin người dùng
    useEffect(() => {
        const userString = localStorage.getItem('user');
        let userData = null;
        setLoading(true);
        try {
          userData = userString ? JSON.parse(userString) : null;
          setUser(userData.data);
          setFormData({
            name: userData.data.name || '',
            email: userData.data.email || '',
            avatar: null,
          });
        } catch (error) {
            toast.error('Không thể lấy thông tin user');
        } finally {
            setLoading(false);
        }
    }, []);
  // Lấy danh sách tất cả giáo viên, lớp học và kỳ thi
  useEffect(() => {
    const fetchAllTeachers = async () => {
      setLoading(true);
      try {
        const teachers = await teacherService.getAllTeachers();
        const classroomOptionsData = await getAll.getAllClassrooms();
        const examOptionsData = await getAll.getAllExams();
        setAllTeachers(teachers);
        setClassroomOptions(classroomOptionsData);
        setExamOptions(examOptionsData);
      } catch (error) {
        toast.error('Không thể lấy danh sách giáo viên, lớp học và kỳ thi');
      } finally {
        setLoading(false);
      }
    };
    fetchAllTeachers();
  }, []);

  // Xử lý thay đổi tab
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Xử lý tìm kiếm học sinh theo lớp
  useEffect(() => {
    if (classroomCode) {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const studentsData = await teacherService.getStudentsByClassroom(classroomCode);
        setStudents(studentsData);
        setScores(
          studentsData.map((student) => ({
            student_code: student.student_code || student.id,
            score_value: 0,
          }))
        );
        toast.success('Lấy danh sách học sinh thành công!');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Không thể lấy danh sách học sinh.');
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
    }
  }, [classroomCode]);

  // Xử lý tìm kiếm giáo viên trong lớp
  const handleFetchTeachersInClassroom = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const teachersData = await teacherService.getTeachersInClassroom(classroomCode);
      setTeachersInClassroom(teachersData);
      toast.success('Lấy danh sách giáo viên trong lớp thành công!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể lấy danh sách giáo viên trong lớp.');
      setTeachersInClassroom([]);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý nhập điểm
  const handleEnterScores = async (e) => {
    e.preventDefault();
    if (!classroomCode || !examCode || scores.length === 0) {
      toast.error('Vui lòng nhập đầy đủ thông tin: mã lớp, mã kỳ thi và điểm.');
      return;
    }
    setLoading(true);
    try {
      await teacherService.enterScores(classroomCode, examCode, scores);
      toast.success('Nhập điểm thành công!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Nhập điểm thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý gán giáo viên làm chủ nhiệm
  const handleAssignHomeroom = async (e) => {
    e.preventDefault();
    if (!classroomCode) {
      toast.error('Vui lòng chọn mã lớp.');
      return;
    }
    setLoading(true);
    try {
      await teacherService.assignHomeroomClassroom(classroomCode);
      toast.success('Gán giáo viên làm chủ nhiệm thành công!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gán giáo viên làm chủ nhiệm thất bại.');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý gán giáo viên dạy lớp
  const handleAssignTeaching = async (e) => {
    e.preventDefault();
    if (!classroomCode) {
      toast.error('Vui lòng chọn mã lớp.');
      return;
    }
    setLoading(true);
    try {
      await teacherService.assignTeachingClassroom(classroomCode);
      toast.success('Gán giáo viên dạy lớp thành công!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gán giáo viên dạy lớp thất bại.');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý thay đổi điểm của học sinh
  const handleScoreChange = (studentCode, value) => {
    const updatedScores = scores.map((score) =>
      score.student_code === studentCode ? { ...score, score_value: parseFloat(value) || 0 } : score
    );
    setScores(updatedScores);
  };

  // Xử lý thay đổi thông tin cá nhân
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý thay đổi file avatar
  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, avatar: e.target.files[0] }));
  };

  // Xử lý cập nhật thông tin cá nhân
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedData = await teacherService.updateTeacherProfile(formData);
      // Update user state with new data
      setUser((prev) => ({
        ...prev,
        name: updatedData.name || prev.name,
        email: updatedData.email || prev.email,
        avatarUrl: updatedData.avatarUrl || prev.avatarUrl,
      }));
      // Update localStorage
      const updatedUser = {
        ...JSON.parse(localStorage.getItem('user')),
        data: {
          ...JSON.parse(localStorage.getItem('user')).data,
          name: updatedData.name || user.name,
          email: updatedData.email || user.email,
          avatarUrl: updatedData.avatarUrl || user.avatarUrl,
        },
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Cập nhật thông tin cá nhân thành công!');
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cập nhật thông tin cá nhân thất bại.');
    } finally {
      setLoading(false);
    }
  };

  // Cột cho DataGrid hiển thị danh sách giáo viên
  const teacherColumns = [
    { field: 'teacher_code', headerName: 'Mã giáo viên', width: 150 },
    { field: 'name', headerName: 'Tên giáo viên', width: 200 },
  ];

  // Cột cho DataGrid hiển thị danh sách học sinh
  const studentColumns = [
    { field: 'student_code', headerName: 'Mã học sinh', width: 150 },
    { field: 'name', headerName: 'Tên học sinh', width: 200 },
  ];
  const classroomColumns = [
    { field: 'classroom_code', headerName: 'Mã lớp', width: 200 },
    { field: 'classroom_name', headerName: 'Tên lớp', width: 150 },
    { field: 'grade_code', headerName: 'Mã khối', width: 200 },
    { field: 'student_count', headerName: 'Số học sinh', width: 150 },
    { field: 'homeroom_teacher_code', headerName: 'Mã giáo viên chủ nhiệm', width: 200 },
  ];

  return (
    <Box className="teacher-dashboard-container">   
      <Box className="teacher-dashboard-content">
        <Typography variant="h4" className="teacher-dashboard-title">
          Quản lý học sinh - Giáo viên
        </Typography>

        {/* Tabs để chuyển đổi giữa các tính năng */}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          className="teacher-dashboard-tabs"
        >
          <Tab label="Học sinh" icon={<ClassIcon />} />
          <Tab label="Giáo viên trong lớp" icon={<PeopleIcon />} />
          <Tab label="Nhập điểm" icon={<GradeIcon />} />
          <Tab label="Gán lớp" icon={<AssignmentIndIcon />} />
          <Tab label="Danh sách giáo viên" icon={<PeopleIcon />} />
          <Tab label="Thông tin cá nhân" icon={<PersonIcon />} />
        </Tabs>

        {/* Hiển thị loading spinner */}
        {loading && (
          <Box className="teacher-dashboard-loading">
            <CircularProgress />
          </Box>
        )}

        {/* Toast container để hiển thị thông báo */}
        <ToastContainer position="top-right" autoClose={3000} />

        {/* Tab 1: Tìm kiếm học sinh theo lớp */}
        {tabValue === 0 && (
          <Card className="teacher-dashboard-card">
            <CardContent className="teacher-dashboard-card-content">
              <Typography variant="h6" gutterBottom>
                Tìm kiếm học sinh theo lớp
              </Typography>
              <form >
                <FormControl className="teacher-dashboard-form-control">
                  <InputLabel>Mã lớp</InputLabel>
                  <Select
                    value={classroomCode}
                    onChange={(e) => setClassroomCode(e.target.value)}
                    label="Mã lớp"
                    required
                  >
                    {classroomOptions.map((code) => (
                      <MenuItem key={code.classroom_code} value={code.classroom_code}>
                        {code.classroom_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </form>

              {/* Hiển thị danh sách học sinh */}
              {students.length > 0 ? (
                <Box className="teacher-dashboard-data-grid">
                  <DataGrid
                    rows={students}
                    columns={studentColumns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    getRowId={(row) => row.student_code || row.id}
                    autoHeight
                  />
                </Box>
              ) : (
                <Typography className="teacher-dashboard-no-data">
                  Không có học sinh nào trong lớp này.
                </Typography>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tab 2: Tìm kiếm giáo viên trong lớp */}
        {tabValue === 1 && (
          <Card className="teacher-dashboard-card">
            <CardContent className="teacher-dashboard-card-content">
              <Typography variant="h6" gutterBottom>
                Tìm kiếm giáo viên trong lớp
              </Typography>
              <form onSubmit={handleFetchTeachersInClassroom}>
                <FormControl className="teacher-dashboard-form-control">
                  <InputLabel>Mã lớp</InputLabel>
                  <Select
                    value={classroomCode}
                    onChange={(e) => setClassroomCode(e.target.value)}
                    label="Mã lớp"
                    required
                  >
                    {classroomOptions.map((code) => (
                      <MenuItem key={code.classroom_code} value={code.classroom_code}>
                        {code.classroom_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button type="submit" variant="contained" color="primary">
                  Tìm kiếm
                </Button>
              </form>

              {/* Hiển thị danh sách giáo viên trong lớp */}
              {teachersInClassroom.length > 0 ? (
                <Box className="teacher-dashboard-data-grid">
                  <DataGrid
                    rows={teachersInClassroom}
                    columns={teacherColumns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    getRowId={(row) => row.teacher_code || row.id}
                    autoHeight
                  />
                </Box>
              ) : (
                <Typography className="teacher-dashboard-no-data">
                  Không có giáo viên nào trong lớp này.
                </Typography>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tab 3: Nhập điểm cho học sinh */}
        {tabValue === 2 && (
          <Card className="teacher-dashboard-card">
            <CardContent className="teacher-dashboard-card-content">
              <Typography variant="h6" gutterBottom>
                Nhập điểm cho học sinh
              </Typography>
              <form onSubmit={handleEnterScores}>
                <FormControl className="teacher-dashboard-form-control">
                  <InputLabel>Mã lớp</InputLabel>
                  <Select
                    value={classroomCode}
                    onChange={(e) => {
                      setClassroomCode(e.target.value);
                    }}
                    label="Mã lớp"
                    required
                  >
                    {classroomOptions.map((code) => (
                      <MenuItem key={code.classroom_code} value={code.classroom_code}>
                        {code.classroom_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl className="teacher-dashboard-form-control">
                  <InputLabel>Mã kỳ thi</InputLabel>
                  <Select
                    value={examCode}
                    onChange={(e) => setExamCode(e.target.value)}
                    label="Mã kỳ thi"
                    required
                  >
                    {examOptions.map((code) => (
                      <MenuItem key={code.exam_code} value={code.exam_code}>
                        {code.exam_name} | {code.date} | {code.subject_code}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Hiển thị danh sách học sinh để nhập điểm */}
                {students.length > 0 && (
                  <TableContainer component={Paper} className="teacher-dashboard-table-container">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Mã học sinh</TableCell>
                          <TableCell>Tên học sinh</TableCell>
                          <TableCell>Điểm</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {students.map((student) => (
                          <TableRow key={student.student_code || student.id}>
                            <TableCell>{student.student_code || student.id}</TableCell>
                            <TableCell>{student.name || 'Không có tên'}</TableCell>
                            <TableCell>
                              <TextField
                                type="number"
                                inputProps={{ min: 0, max: 10, step: 0.5 }}
                                value={
                                  scores.find((s) => s.student_code === (student.student_code || student.id))
                                    ?.score_value || 0
                                }
                                onChange={(e) =>
                                  handleScoreChange(student.student_code || student.id, e.target.value)
                                }
                                size="small"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className="teacher-dashboard-button"
                  disabled={students.length === 0}
                >
                  Nhập điểm
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Tab 4: Gán giáo viên làm chủ nhiệm hoặc dạy lớp */}
        {tabValue === 3 && (
          <Card className="teacher-dashboard-card">
            <CardContent className="teacher-dashboard-card-content">
              <Typography variant="h6" gutterBottom>
                Gán giáo viên cho lớp
              </Typography>
              <FormControl className="teacher-dashboard-form-control">
                <InputLabel>Mã lớp</InputLabel>
                <Select
                  value={classroomCode}
                  onChange={(e) => setClassroomCode(e.target.value)}
                  label="Mã lớp"
                  required
                >
                  {classroomOptions.map((code) => (
                    <MenuItem key={code.classroom_code} value={code.classroom_code}>
                      {code.classroom_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box className="teacher-dashboard-button-group">
                <Button onClick={handleAssignHomeroom} variant="contained" color="primary">
                  Gán làm chủ nhiệm
                </Button>
                <Button onClick={handleAssignTeaching} variant="contained" color="secondary">
                  Gán dạy lớp
                </Button>
              </Box>
              <Typography variant="h6" gutterBottom sx={{ marginTop: 3 }}>
                Danh sách lớp học
                </Typography>
                {classroomOptions.length > 0 ? (
                <Box className="teacher-dashboard-data-grid">
                  <DataGrid
                    rows={classroomOptions}
                    columns={classroomColumns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    getRowId={(row) => row.classroom_code}
                  />
                </Box>
              ) : (
                <Typography className="teacher-dashboard-no-data">
                  Không có lớp học nào.
                </Typography>
                )}
            </CardContent>
          </Card>
        )}

        {/* Tab 5: Danh sách tất cả giáo viên */}
        {tabValue === 4 && (
          <Card className="teacher-dashboard-card">
            <CardContent className="teacher-dashboard-card-content">
              <Typography variant="h6" gutterBottom>
                Danh sách tất cả giáo viên
              </Typography>
              {allTeachers.length > 0 ? (
                <Box className="teacher-dashboard-data-grid">
                  <DataGrid
                    rows={allTeachers}
                    columns={teacherColumns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    getRowId={(row) => row.teacher_code || row.id}
                    autoHeight
                  />
                </Box>
              ) : (
                <Typography className="teacher-dashboard-no-data">
                  Không có giáo viên nào.
                </Typography>
              )}
            </CardContent>
          </Card>
        )}
        {/* Tab 6: Thông tin cá nhân */}
        {tabValue === 5 && (
          <Card className="teacher-dashboard-card">
            <CardContent className="teacher-dashboard-card-content personal-info-card">
              <Typography variant="h6" gutterBottom className="personal-info-title">
                Thông tin cá nhân
              </Typography>
              {user ? (
                <Box className="personal-info-container">
                  {/* Avatar Display */}
                  <Box className="personal-info-item avatar-section">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt="Avatar"
                        className="personal-info-avatar"
                        style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                      />
                    ) : (
                      <PersonIcon style={{ fontSize: '100px', color: '#ccc' }} />
                    )}
                  </Box>

                  {/* Edit Mode Toggle Button */}
                  <Button
                    variant="contained"
                    color={isEditing ? 'secondary' : 'primary'}
                    onClick={() => setIsEditing(!isEditing)}
                    sx={{ mb: 2 }}
                  >
                    {isEditing ? 'Hủy' : 'Chỉnh sửa thông tin'}
                  </Button>

                  {isEditing ? (
                    // Edit Mode: Form to update profile
                    <form onSubmit={handleUpdateProfile}>
                      <Box className="personal-info-item">
                        <Typography variant="body1" className="personal-info-label">
                          Họ và tên:
                        </Typography>
                        <TextField
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ maxWidth: '300px' }}
                          required
                        />
                      </Box>
                      <Box className="personal-info-item">
                        <Typography variant="body1" className="personal-info-label">
                          Email:
                        </Typography>
                        <TextField
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ maxWidth: '300px' }}
                          type="email"
                          required
                        />
                      </Box>
                      <Box className="personal-info-item">
                        <Typography variant="body1" className="personal-info-label">
                          Avatar:
                        </Typography>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          style={{ marginTop: '10px' }}
                        />
                      </Box>
                      <Box className="personal-info-item">
                        <Typography variant="body1" className="personal-info-label">
                          Vai trò:
                        </Typography>
                        <Typography variant="body1" className="personal-info-value">
                          {user.role_code || 'Không có thông tin'}
                        </Typography>
                      </Box>
                      <Box className="personal-info-item">
                        <Typography variant="body1" className="personal-info-label">
                          Mã giáo viên:
                        </Typography>
                        <Typography variant="body1" className="personal-info-value">
                          {user.teacher_code || 'Không có thông tin'}
                        </Typography>
                      </Box>
                      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                        Lưu thay đổi
                      </Button>
                    </form>
                  ) : (
                    // View Mode: Display user information
                    <>
                      <Box className="personal-info-item">
                        <Typography variant="body1" className="personal-info-label">
                          Họ và tên:
                        </Typography>
                        <Typography variant="body1" className="personal-info-value">
                          {user.name || 'Không có thông tin'}
                        </Typography>
                      </Box>
                      <Box className="personal-info-item">
                        <Typography variant="body1" className="personal-info-label">
                          Email:
                        </Typography>
                        <Typography variant="body1" className="personal-info-value">
                          {user.email || 'Không có thông tin'}
                        </Typography>
                      </Box>
                      <Box className="personal-info-item">
                        <Typography variant="body1" className="personal-info-label">
                          Vai trò:
                        </Typography>
                        <Typography variant="body1" className="personal-info-value">
                          {user.role_code || 'Không có thông tin'}
                        </Typography>
                      </Box>
                      <Box className="personal-info-item">
                        <Typography variant="body1" className="personal-info-label">
                          Mã giáo viên:
                        </Typography>
                        <Typography variant="body1" className="personal-info-value">
                          {user.teacher_code || 'Không có thông tin'}
                        </Typography>
                      </Box>
                    </>
                  )}
                </Box>
              ) : (
                <Typography className="teacher-dashboard-no-data">
                  Không có thông tin người dùng. Vui lòng đăng nhập lại.
                </Typography>
              )}
              </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default TeacherDashboard;