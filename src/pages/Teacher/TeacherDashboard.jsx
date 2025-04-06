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
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ClassIcon from '@mui/icons-material/Class';
import GradeIcon from '@mui/icons-material/Grade';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import DownloadIcon from '@mui/icons-material/Download';
import MenuIcon from '@mui/icons-material/Menu';
import '../../styles/TeacherDashboard.css';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [classroomCode, setClassroomCode] = useState('');
  const [examCode, setExamCode] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [students, setStudents] = useState([]);
  const [teachersInClassroom, setTeachersInClassroom] = useState([]);
  const [allTeachers, setAllTeachers] = useState([]);
  const [scores, setScores] = useState([]);
  const [classroomScores, setClassroomScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [classroomOptions, setClassroomOptions] = useState([]);
  const [examOptions, setExamOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: null,
  });
  const [teacherFilter, setTeacherFilter] = useState('all');
  const [exportUrls, setExportUrls] = useState({
    scores: null,
    termAverages: null,
    yearlyAverages: null,
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const teacherColumns = [
    { field: 'teacher_code', headerName: 'Mã giáo viên', width: 150 },
    { field: 'name', headerName: 'Tên giáo viên', width: 200 },
    { field: 'email', headerName: 'Email', width: 200 },
  ];

  const studentColumns = [
    { field: 'student_code', headerName: 'Mã học sinh', width: 150 },
    { field: 'name', headerName: 'Tên học sinh', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
  ];

  const classroomScoreColumns = [
    { field: 'student_code', headerName: 'Mã học sinh', width: 150 },
    { field: 'name', headerName: 'Tên học sinh', width: 200 },
    { field: 'score_value', headerName: 'Điểm', width: 100 },
    { field: 'exam_name', headerName: 'Tên kỳ thi', width: 350 },
  ];

  const classroomColumns = [
    { field: 'classroom_code', headerName: 'Mã lớp', width: 200 },
    { field: 'classroom_name', headerName: 'Tên lớp', width: 150 },
    { field: 'grade_code', headerName: 'Mã khối', width: 200 },
    { field: 'student_count', headerName: 'Số học sinh', width: 150 },
    { field: 'homeroom_teacher_code', headerName: 'Mã giáo viên chủ nhiệm', width: 200 },
  ];

  const displayedTeachers = teacherFilter === 'all' ? allTeachers : teachersInClassroom;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userString = localStorage.getItem('user');
        let userData = userString ? JSON.parse(userString) : null;
        setUser(userData.data);
        setFormData({
          name: userData.data.name || '',
          email: userData.data.email || '',
          avatar: null,
        });

        const teachers = await teacherService.getAllTeachers();
        const classroomOptionsData = await getAll.getAllClassrooms();
        const examOptionsData = await getAll.getAllExams();
        const subjectOptionsData = await getAll.getAllSubjects();
        setAllTeachers(teachers);
        setClassroomOptions(classroomOptionsData);
        setExamOptions(examOptionsData);
        setSubjectOptions(subjectOptionsData);
      } catch (error) {
        toast.error('Không thể lấy thông tin user, giáo viên, lớp học, kỳ thi hoặc môn học');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleTabChange = (newValue) => {
    if (newValue === 6) {
      handleLogout();
    } else {
      setTabValue(newValue);
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      localStorage.clear();
      toast.success('Đăng xuất thành công!');
      navigate('/login');
    }
  };

  useEffect(() => {
    if (classroomCode) {
      const fetchStudents = async () => {
        setLoading(true);
        try {
          const studentsData = await teacherService.getStudentsByClassroom(classroomCode);
          setStudents(studentsData);
          setScores(studentsData.map((student) => ({
            student_code: student.student_code || student.id,
            score_value: 0,
          })));
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

  const handleFetchTeachersInClassroom = async (e) => {
    e.preventDefault();
    if (!classroomCode) {
      toast.error('Vui lòng chọn mã lớp.');
      return;
    }
    setLoading(true);
    try {
      const teachersData = await teacherService.getTeachersInClassroom(classroomCode);
      setTeachersInClassroom(teachersData);
      setTeacherFilter('classroom');
      toast.success('Lấy danh sách giáo viên trong lớp thành công!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể lấy danh sách giáo viên trong lớp.');
      setTeachersInClassroom([]);
    } finally {
      setLoading(false);
    }
  };

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

  const handleScoreChange = (studentCode, value) => {
    const updatedScores = scores.map((score) =>
      score.student_code === studentCode ? { ...score, score_value: parseFloat(value) || 0 } : score
    );
    setScores(updatedScores);
  };

  const handleFetchClassroomScores = async (e) => {
    e.preventDefault();
    if (!classroomCode) {
      toast.error('Vui lòng chọn mã lớp.');
      return;
    }
    setLoading(true);
    try {
      const scoresData = await teacherService.getClassroomScores(classroomCode, examCode, subjectCode);
      setClassroomScores(scoresData);
      toast.success('Lấy điểm lớp thành công!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể lấy điểm lớp.');
      setClassroomScores([]);
    } finally {
      setLoading(false);
    }
  };

  const handleShowHomeroomClassroom = () => {
    if (!user || !user.teacher_code) {
      toast.error('Không thể xác định giáo viên hiện tại. Vui lòng đăng nhập lại.');
      return;
    }
    const homeroomClassroom = classroomOptions.find(
      (classroom) => classroom.homeroom_teacher_code === user.teacher_code
    );
    if (homeroomClassroom) {
      setClassroomCode(homeroomClassroom.classroom_code);
      toast.success(`Đã chọn lớp chủ nhiệm: ${homeroomClassroom.classroom_name}`);
    } else {
      toast.info('Bạn hiện không phải là giáo viên chủ nhiệm của lớp nào.');
      setClassroomCode('');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, avatar: e.target.files[0] }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedData = await teacherService.updateTeacherProfile(formData);
      setUser((prev) => ({
        ...prev,
        name: updatedData.name || prev.name,
        email: updatedData.email || prev.email,
        avatarUrl: updatedData.avatarUrl || prev.avatarUrl,
      }));
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
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cập nhật thông tin cá nhân thất bại.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportScores = async () => {
    setLoading(true);
    try {
      const response = await getAll.exportScores();
      setExportUrls((prev) => ({ ...prev, scores: response.downloadUrl }));
      toast.success(
        <div>
          {response.message}
          <br />
          <a href={response.downloadUrl} target="_blank" rel="noopener noreferrer">
            Tải xuống
          </a>
        </div>
      );
      window.open(response.downloadUrl, '_blank');
    } catch (error) {
      toast.error('Không thể export điểm. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportStudentTermAverages = async () => {
    setLoading(true);
    try {
      const response = await getAll.exportStudentTermAverages();
      setExportUrls((prev) => ({ ...prev, termAverages: response.downloadUrl }));
      toast.success(
        <div>
          {response.message}
          <br />
          <a href={response.downloadUrl} target="_blank" rel="noopener noreferrer">
            Tải xuống
          </a>
        </div>
      );
      window.open(response.downloadUrl, '_blank');
    } catch (error) {
      toast.error('Không thể export điểm trung bình học kỳ. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportStudentYearlyAverages = async () => {
    setLoading(true);
    try {
      const response = await getAll.exportStudentYearlyAverages();
      setExportUrls((prev) => ({ ...prev, yearlyAverages: response.downloadUrl }));
      toast.success(
        <div>
          {response.message}
          <br />
          <a href={response.downloadUrl} target="_blank" rel="noopener noreferrer">
            Tải xuống
          </a>
        </div>
      );
      window.open(response.downloadUrl, '_blank');
    } catch (error) {
      toast.error('Không thể export điểm trung bình cả năm. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 250, bgcolor: '#2D3748', height: '100%', color: '#FFFFFF' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', bgcolor: '#4A90E2' }}>
        <Avatar src={user?.avatarUrl} sx={{ mr: 2 }} />
        <Typography variant="h6">{user?.name || 'Giáo Viên'}</Typography>
      </Box>
      <Divider sx={{ bgcolor: '#718096' }} />
      <List>
        {[
          { text: 'Học sinh', icon: <ClassIcon />, value: 0 },
          { text: 'Danh sách giáo viên', icon: <PeopleIcon />, value: 1 },
          { text: 'Nhập điểm', icon: <GradeIcon />, value: 2 },
          { text: 'Gán lớp', icon: <AssignmentIndIcon />, value: 3 },
          { text: 'Thông tin cá nhân', icon: <PersonIcon />, value: 4 },
          { text: 'Xem điểm học sinh', icon: <VisibilityIcon />, value: 5 },
          { text: 'Đăng xuất', icon: <LogoutIcon sx={{ color: 'red' }} />, value: 6}
        ].map((item) => (
          <ListItem
            key={item.text}
            onClick={() => handleTabChange(item.value)}
            sx={{
              '&:hover': { bgcolor: '#4A90E2' },
              bgcolor: tabValue === item.value ? '#4A90E2' : 'transparent',
            }}
          >
            <ListItemIcon sx={{ color: '#FFFFFF' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Drawer for mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { width: 250, boxSizing: 'border-box' },
        }}
      >
        {drawer}
      </Drawer>

      {/* Drawer for desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { 
            width: 250, 
            boxSizing: 'border-box',
            position: 'fixed', 
            height: '100%',
            zIndex: 1200, 
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: '#F7F9FC',
          width: { xs: '100%', sm: 'calc(100% - 250px)' },
          marginLeft: { xs: 0, sm: '250px' }, 
          transition: 'margin-left 0.3s',
        }}
      >
        <Box sx={{ display: { xs: 'block', sm: 'none' }, mb: 2 }}>
          <Button onClick={handleDrawerToggle}>
            <MenuIcon />
          </Button>
        </Box>
        <Typography variant="h4" className="dashboard-title">
          TEACHER
        </Typography>
        {loading && (
          <Box className="dashboard-loading">
            <CircularProgress />
          </Box>
        )}
        <ToastContainer position="top-right" autoClose={3000} />

        {tabValue === 0 && (
          <Card className="dashboard-card">
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Xem Danh Sách Học Sinh Theo Lớp
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <form className="dashboard-form" style={{ flex: 1 }}>
                  <FormControl className="dashboard-form-control" fullWidth>
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
                <Button
                  variant="contained"
                  startIcon={<HomeIcon />}
                  onClick={handleShowHomeroomClassroom}
                  className="dashboard-button"
                >
                  Lớp chủ nhiệm
                </Button>
              </Box>
              {students.length > 0 ? (
                <Box className="dashboard-data-grid">
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
                <Typography className="dashboard-no-data">
                  Không có học sinh nào trong lớp này.
                </Typography>
              )}
            </CardContent>
          </Card>
        )}

        {tabValue === 1 && (
          <Card className="dashboard-card">
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Danh Sách Giáo Viên
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }} className="dashboard-form">
                <FormControl className="dashboard-form-control">
                  <InputLabel>Hiển thị</InputLabel>
                  <Select
                    value={teacherFilter}
                    onChange={(e) => setTeacherFilter(e.target.value)}
                    label="Hiển thị"
                  >
                    <MenuItem value="all">Tất cả giáo viên</MenuItem>
                    <MenuItem value="classroom">Giáo viên trong lớp</MenuItem>
                  </Select>
                </FormControl>
                {teacherFilter === 'classroom' && (
                  <form onSubmit={handleFetchTeachersInClassroom} className="dashboard-form">
                    <FormControl className="dashboard-form-control">
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
                    <Button type="submit" variant="contained" className="dashboard-button">
                      Tìm kiếm
                    </Button>
                  </form>
                )}
              </Box>
              {displayedTeachers.length > 0 ? (
                <Box className="dashboard-data-grid">
                  <DataGrid
                    rows={displayedTeachers}
                    columns={teacherColumns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    getRowId={(row) => row.teacher_code || row.id}
                    autoHeight
                  />
                </Box>
              ) : (
                <Typography className="dashboard-no-data">
                  {teacherFilter === 'all' ? 'Không có giáo viên nào.' : 'Không có giáo viên nào trong lớp này.'}
                </Typography>
              )}
            </CardContent>
          </Card>
        )}

        {tabValue === 2 && (
          <Card className="dashboard-card">
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Nhập Điểm Cho Học Sinh
              </Typography>
              <form onSubmit={handleEnterScores} className="dashboard-form">
                <FormControl className="dashboard-form-control">
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
                <FormControl className="dashboard-form-control">
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
                {students.length > 0 && (
                  <TableContainer component={Paper} className="dashboard-table-container">
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
                  className="dashboard-button"
                  disabled={students.length === 0}
                >
                  Nhập điểm
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {tabValue === 3 && (
          <Card className="dashboard-card">
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Gán Giáo Viên Cho Lớp
              </Typography>
              <FormControl className="dashboard-form-control">
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
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button onClick={handleAssignHomeroom} variant="contained" className="dashboard-button">
                  Gán làm chủ nhiệm
                </Button>
                <Button onClick={handleAssignTeaching} variant="contained" className="dashboard-button secondary">
                  Gán dạy lớp
                </Button>
              </Box>
              <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
                Danh Sách Lớp Học
              </Typography>
              {classroomOptions.length > 0 ? (
                <Box className="dashboard-data-grid">
                  <DataGrid
                    rows={classroomOptions}
                    columns={classroomColumns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    getRowId={(row) => row.classroom_code}
                    autoHeight
                  />
                </Box>
              ) : (
                <Typography className="dashboard-no-data">
                  Không có lớp học nào.
                </Typography>
              )}
            </CardContent>
          </Card>
        )}

        {tabValue === 4 && (
          <Card className="dashboard-card">
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Thông Tin Cá Nhân
              </Typography>
              {user ? (
                <Box className="profile-container">
                  <Box className="profile-avatar-section">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt="Avatar" className="profile-avatar" />
                    ) : (
                      <PersonIcon className="profile-avatar-placeholder" />
                    )}
                  </Box>
                  <Button
                    variant="contained"
                    onClick={() => setIsEditing(!isEditing)}
                    className={`dashboard-button ${isEditing ? 'secondary' : ''}`}
                  >
                    {isEditing ? 'Hủy' : 'Chỉnh sửa thông tin'}
                  </Button>
                  {isEditing ? (
                    <form onSubmit={handleUpdateProfile} className="profile-form">
                      <Box className="profile-item">
                        <Typography>Họ và tên:</Typography>
                        <TextField
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          variant="outlined"
                          size="small"
                          fullWidth
                          required
                        />
                      </Box>
                      <Box className="profile-item">
                        <Typography>Email:</Typography>
                        <TextField
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          variant="outlined"
                          size="small"
                          fullWidth
                          type="email"
                          required
                        />
                      </Box>
                      <Box className="profile-item">
                        <Typography>Avatar:</Typography>
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                      </Box>
                      <Box className="profile-item">
                        <Typography>Mã giáo viên:</Typography>
                        <Typography>{user.teacher_code || 'Không có thông tin'}</Typography>
                      </Box>
                      <Button type="submit" variant="contained" className="dashboard-button">
                        Lưu thay đổi
                      </Button>
                    </form>
                  ) : (
                    <Box className="profile-details">
                      <Box className="profile-item">
                        <Typography>Họ và tên:</Typography>
                        <Typography>{user.name || 'Không có thông tin'}</Typography>
                      </Box>
                      <Box className="profile-item">
                        <Typography>Email:</Typography>
                        <Typography>{user.email || 'Không có thông tin'}</Typography>
                      </Box>
                      <Box className="profile-item">
                        <Typography>Mã giáo viên:</Typography>
                        <Typography>{user.teacher_code || 'Không có thông tin'}</Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              ) : (
                <Typography className="dashboard-no-data">
                  Không có thông tin người dùng. Vui lòng đăng nhập lại.
                </Typography>
              )}
            </CardContent>
          </Card>
        )}

        {tabValue === 5 && (
          <Card className="dashboard-card">
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Xem Điểm Học Sinh
              </Typography>
              <form onSubmit={handleFetchClassroomScores} className="dashboard-form">
                <FormControl className="dashboard-form-control">
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
                <FormControl className="dashboard-form-control">
                  <InputLabel>Mã kỳ thi</InputLabel>
                  <Select
                    value={examCode}
                    onChange={(e) => setExamCode(e.target.value)}
                    label="Mã kỳ thi"
                  >
                    <MenuItem value="">Tất cả</MenuItem>
                    {examOptions.map((code) => (
                      <MenuItem key={code.exam_code} value={code.exam_code}>
                        {code.exam_name} | {code.date} | {code.subject_code}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl className="dashboard-form-control">
                  <InputLabel>Mã môn học</InputLabel>
                  <Select
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                    label="Mã môn học"
                  >
                    <MenuItem value="">Tất cả</MenuItem>
                    {subjectOptions.map((subject) => (
                      <MenuItem key={subject.subject_code} value={subject.subject_code}>
                        {subject.subject_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button type="submit" variant="contained" className="dashboard-button">
                  Xem điểm
                </Button>
              </form>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={handleExportScores}
                  className="dashboard-button secondary"
                >
                  Export Tất Cả Điểm
                </Button>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={handleExportStudentTermAverages}
                  className="dashboard-button secondary"
                >
                  Export Điểm TB Học Kỳ
                </Button>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={handleExportStudentYearlyAverages}
                  className="dashboard-button secondary"
                >
                  Export Điểm TB Cả Năm
                </Button>
              </Box>
              {classroomScores.length > 0 ? (
                <Box className="dashboard-data-grid">
                  <DataGrid
                    rows={classroomScores.map((score, index) => {
                      const student = students.find((s) => s.student_code === score.student_code);
                      const exam = examOptions.find((e) => e.exam_code === score.exam_code);
                      return {
                        id: `${score.student_code}-${score.exam_code || index}-${score.subject_code || index}`,
                        student_code: score.student_code || 'N/A',
                        name: student ? student.name : score.name || 'Không có tên',
                        score_value: score.score_value || 'N/A',
                        exam_name: exam ? exam.exam_name : score.exam_name || score.exam_code || 'N/A',
                      };
                    })}
                    columns={classroomScoreColumns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    autoHeight
                  />
                </Box>
              ) : (
                <Typography className="dashboard-no-data">
                  Không có điểm nào cho lớp này.
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