import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import studentService from '../../services/student';
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
import GradeIcon from '@mui/icons-material/Grade';
import PersonIcon from '@mui/icons-material/Person';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SchoolIcon from '@mui/icons-material/School';
import LogoutIcon from '@mui/icons-material/Logout';
import DownloadIcon from '@mui/icons-material/Download';
import MenuIcon from '@mui/icons-material/Menu';
import '../../styles/StudentDashboard.css';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [subjectCode, setSubjectCode] = useState('');
  const [termCode, setTermCode] = useState('');
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: null,
  });
  const [rankingType, setRankingType] = useState('classroom-term');
  const [classroomCode, setClassroomCode] = useState('');
  const [gradeCode, setGradeCode] = useState('');
  const [rankingTermCode, setRankingTermCode] = useState('');
  const [rankings, setRankings] = useState([]);
  const [classroomOptions, setClassroomOptions] = useState([]);
  const [gradeOptions, setGradeOptions] = useState([]);
  const [termOptions, setTermOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [examOptions, setExamOptions] = useState([]);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [academicPerformanceType, setAcademicPerformanceType] = useState('classroom-term');
  const [academicPerformanceLevel, setAcademicPerformanceLevel] = useState('');
  const [academicPerformanceData, setAcademicPerformanceData] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const academicPerformanceLevels = ['Yếu', 'Trung bình', 'Khá', 'Giỏi', 'Xuất sắc'];

  const scoreColumns = [
    { field: 'exam_name', headerName: 'Tên bài kiểm tra', width: 200 },
    { field: 'subject_code', headerName: 'Mã môn học', width: 120 },
    { field: 'score_value', headerName: 'Điểm', width: 100 },
    { field: 'date', headerName: 'Ngày', width: 150 },
  ];

  const rankingColumns = [
    { field: 'rank', headerName: 'Xếp hạng', width: 100 },
    { field: 'student_code', headerName: 'Mã học sinh', width: 150 },
    { field: 'name', headerName: 'Tên học sinh', width: 200 },
    { field: 'term_average', headerName: 'Điểm trung bình', width: 150 },
  ];

  const academicPerformanceColumns = [
    { field: 'student_code', headerName: 'Mã học sinh', width: 150 },
    { field: 'name', headerName: 'Tên học sinh', width: 200 },
    { field: 'average_score', headerName: 'Điểm trung bình', width: 150 },
    { field: 'academic_performance', headerName: 'Học lực', width: 150 },
  ];

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

        const classrooms = await getAll.getAllClassrooms();
        setClassroomOptions(classrooms.map((classroom) => ({
          classroom_code: classroom.classroom_code,
          classroom_name: classroom.classroom_name,
        })));

        const grades = await getAll.getAllGrades();
        setGradeOptions(grades.map((grade) => ({
          grade_code: grade.grade_code,
          grade_name: grade.grade_name,
        })));

        const terms = await getAll.getAllTerms();
        setTermOptions(terms.map((term) => ({
          term_code: term.term_code,
          term_name: term.term_name,
        })));

        const subjects = await getAll.getAllSubjects();
        setSubjectOptions(subjects.map((subject) => ({
          subject_code: subject.subject_code,
          subject_name: subject.subject_name,
        })));

        const exams = await getAll.getAllExams();
        setExamOptions(exams.map((exam) => ({
          exam_code: exam.exam_code,
          exam_name: exam.exam_name,
        })));
      } catch (error) {
        toast.error('Không thể lấy thông tin hoặc dữ liệu cần thiết.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleTabChange = (newValue) => {
    if (newValue === 4) {
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

  const handleFetchScores = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const scoresData = await studentService.getStudentScores(subjectCode, termCode);
      const mappedScores = scoresData.map((score, index) => {
        const exam = examOptions.find((e) => e.exam_code === score.exam_code);
        return {
          ...score,
          id: score.exam_code || `score-${index}`,
          exam_name: exam ? exam.exam_name : score.exam_code || 'N/A',
          subject_code: score.subject_code || subjectCode || 'N/A',
        };
      });
      setScores(mappedScores);
      toast.success('Lấy điểm thành công!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể lấy điểm.');
      setScores([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchRankings = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let rankingsData;
      switch (rankingType) {
        case 'classroom-term':
          if (!classroomCode || !rankingTermCode) {
            toast.error('Vui lòng chọn lớp và học kỳ.');
            setLoading(false);
            return;
          }
          rankingsData = await getAll.getClassroomTermRankings(classroomCode, rankingTermCode);
          break;
        case 'grade-term':
          if (!gradeCode || !rankingTermCode) {
            toast.error('Vui lòng chọn khối và học kỳ.');
            setLoading(false);
            return;
          }
          rankingsData = await getAll.getGradeTermRankings(gradeCode, rankingTermCode);
          break;
        case 'classroom-yearly':
          if (!classroomCode) {
            toast.error('Vui lòng chọn lớp.');
            setLoading(false);
            return;
          }
          rankingsData = await getAll.getClassroomYearlyRankings(classroomCode);
          break;
        case 'grade-yearly':
          if (!gradeCode) {
            toast.error('Vui lòng chọn khối.');
            setLoading(false);
            return;
          }
          rankingsData = await getAll.getGradeYearlyRankings(gradeCode);
          break;
        default:
          throw new Error('Loại xếp hạng không hợp lệ.');
      }
      if (!rankingsData || !Array.isArray(rankingsData.rankings)) {
        throw new Error('Dữ liệu xếp hạng không hợp lệ.');
      }
      const mappedRankings = rankingsData.rankings.map((ranking, index) => ({
        id: ranking.student_code || `ranking-${index}`,
        rank: ranking.classroom_rank || ranking.grade_rank || 'N/A',
        student_code: ranking.student_code || 'N/A',
        name: ranking.name || 'N/A',
        term_average: ranking.term_average || 'N/A',
      }));
      setRankings(mappedRankings);
      toast.success('Lấy xếp hạng thành công!');
    } catch (error) {
      toast.error(error.message || 'Không thể lấy xếp hạng.');
      setRankings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchAcademicPerformance = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let performanceData;
      switch (academicPerformanceType) {
        case 'classroom-term':
          if (!classroomCode || !rankingTermCode || !academicPerformanceLevel) {
            toast.error('Vui lòng chọn lớp, học kỳ và mức học lực.');
            setLoading(false);
            return;
          }
          performanceData = await getAll.getClassroomTermAcademicPerformance(
            classroomCode,
            rankingTermCode,
            academicPerformanceLevel
          );
          break;
        case 'classroom-yearly':
          if (!classroomCode || !academicPerformanceLevel) {
            toast.error('Vui lòng chọn lớp và mức học lực.');
            setLoading(false);
            return;
          }
          performanceData = await getAll.getClassroomYearlyAcademicPerformance(
            classroomCode,
            academicPerformanceLevel
          );
          break;
        case 'grade-term':
          if (!gradeCode || !rankingTermCode || !academicPerformanceLevel) {
            toast.error('Vui lòng chọn khối, học kỳ và mức học lực.');
            setLoading(false);
            return;
          }
          performanceData = await getAll.getGradeTermAcademicPerformance(
            gradeCode,
            rankingTermCode,
            academicPerformanceLevel
          );
          break;
        case 'grade-yearly':
          if (!gradeCode || !academicPerformanceLevel) {
            toast.error('Vui lòng chọn khối và mức học lực.');
            setLoading(false);
            return;
          }
          performanceData = await getAll.getGradeYearlyAcademicPerformance(
            gradeCode,
            academicPerformanceLevel
          );
          break;
        default:
          throw new Error('Loại học lực không hợp lệ.');
      }
      if (!performanceData.students || !Array.isArray(performanceData.students)) {
        throw new Error('Dữ liệu học lực không hợp lệ.');
      }
      const mappedPerformanceData = performanceData.students.map((student, index) => ({
        id: student.student_code || `student-${index}`,
        student_code: student.student_code || 'N/A',
        name: student.name || 'N/A',
        average_score: student.term_average || student.yearly_average || 'N/A',
        academic_performance: student.academic_performance || academicPerformanceLevel,
      }));
      setAcademicPerformanceData(mappedPerformanceData);
      toast.success('Lấy danh sách học sinh theo học lực thành công!');
    } catch (error) {
      toast.error(error.message || 'Không thể lấy danh sách học sinh theo học lực.');
      setAcademicPerformanceData([]);
    } finally {
      setLoading(false);
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
      const updatedData = await studentService.updateStudentProfile(formData);
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

  const handleExportStudentScores = async () => {
    setLoading(true);
    try {
      const response = await studentService.exportStudentScores();
      setDownloadUrl(response.downloadUrl);
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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 250, bgcolor: '#2D3748', height: '100%', color: '#FFFFFF' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', bgcolor: '#4A90E2' }}>
        <Avatar src={user?.avatarUrl} sx={{ mr: 2 }} />
        <Typography variant="h6">{user?.name || 'Học Sinh'}</Typography>
      </Box>
      <Divider sx={{ bgcolor: '#718096' }} />
      <List>
        {[
          { text: 'Xem điểm', icon: <GradeIcon />, value: 0 },
          { text: 'Thông tin cá nhân', icon: <PersonIcon />, value: 1 },
          { text: 'Xem xếp hạng', icon: <EmojiEventsIcon />, value: 2 },
          { text: 'Học lực', icon: <SchoolIcon />, value: 3 },
          { text: 'Đăng xuất', icon: <LogoutIcon sx={{ color: 'red' }} />, value: 4}
          
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
          display: { xs: 'block', sm: 'none' },
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
            boxSizing: 'border-box' ,
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
          width: { xs: '100%', sm: 'calc(100% - 250px)'}, 
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
          STUDENT
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
                Xem Điểm
              </Typography>
              <form onSubmit={handleFetchScores} className="dashboard-form">
                <FormControl className="dashboard-form-control">
                  <InputLabel>Môn học</InputLabel>
                  <Select
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                    label="Môn học"
                  >
                    {subjectOptions.map((subject) => (
                      <MenuItem key={subject.subject_code} value={subject.subject_code}>
                        {subject.subject_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl className="dashboard-form-control">
                  <InputLabel>Học kỳ</InputLabel>
                  <Select
                    value={termCode}
                    onChange={(e) => setTermCode(e.target.value)}
                    label="Học kỳ"
                  >
                    {termOptions.map((term) => (
                      <MenuItem key={term.term_code} value={term.term_code}>
                        {term.term_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    className="dashboard-button"
                  >
                    Xem điểm
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={handleExportStudentScores}
                    disabled={loading}
                    className="dashboard-button secondary"
                  >
                    Export Điểm
                  </Button>
                </Box>
              </form>
              {scores.length > 0 ? (
                <Box className="dashboard-data-grid">
                  <DataGrid
                    rows={scores}
                    columns={scoreColumns}
                    initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
                    pageSizeOptions={[5, 10, 20]}
                    autoHeight
                  />
                </Box>
              ) : (
                <Typography className="dashboard-no-data">
                  Không có điểm nào cho môn học và học kỳ này.
                </Typography>
              )}
            </CardContent>
          </Card>
        )}

        {tabValue === 1 && (
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
                        <Typography>Mã học sinh:</Typography>
                        <Typography>{user.student_code || 'Không có thông tin'}</Typography>
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
                        <Typography>Mã học sinh:</Typography>
                        <Typography>{user.student_code || 'Không có thông tin'}</Typography>
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

        {tabValue === 2 && (
          <Card className="dashboard-card">
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Xem Xếp Hạng
              </Typography>
              <form onSubmit={handleFetchRankings} className="dashboard-form">
                <FormControl className="dashboard-form-control">
                  <InputLabel>Loại xếp hạng</InputLabel>
                  <Select
                    value={rankingType}
                    onChange={(e) => setRankingType(e.target.value)}
                    label="Loại xếp hạng"
                    required
                  >
                    <MenuItem value="classroom-term">Xếp hạng theo lớp và học kỳ</MenuItem>
                    <MenuItem value="grade-term">Xếp hạng theo khối và học kỳ</MenuItem>
                    <MenuItem value="classroom-yearly">Xếp hạng theo lớp cả năm</MenuItem>
                    <MenuItem value="grade-yearly">Xếp hạng theo khối cả năm</MenuItem>
                  </Select>
                </FormControl>
                {(rankingType === 'classroom-term' || rankingType === 'classroom-yearly') && (
                  <FormControl className="dashboard-form-control">
                    <InputLabel>Lớp học</InputLabel>
                    <Select
                      value={classroomCode}
                      onChange={(e) => setClassroomCode(e.target.value)}
                      label="Lớp học"
                      required
                    >
                      {classroomOptions.map((classroom) => (
                        <MenuItem key={classroom.classroom_code} value={classroom.classroom_code}>
                          {classroom.classroom_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
                {(rankingType === 'grade-term' || rankingType === 'grade-yearly') && (
                  <FormControl className="dashboard-form-control">
                    <InputLabel>Khối</InputLabel>
                    <Select
                      value={gradeCode}
                      onChange={(e) => setGradeCode(e.target.value)}
                      label="Khối"
                      required
                    >
                      {gradeOptions.map((grade) => (
                        <MenuItem key={grade.grade_code} value={grade.grade_code}>
                          {grade.grade_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
                {(rankingType === 'classroom-term' || rankingType === 'grade-term') && (
                  <FormControl className="dashboard-form-control">
                    <InputLabel>Học kỳ</InputLabel>
                    <Select
                      value={rankingTermCode}
                      onChange={(e) => setRankingTermCode(e.target.value)}
                      label="Học kỳ"
                      required
                    >
                      {termOptions.map((term) => (
                        <MenuItem key={term.term_code} value={term.term_code}>
                          {term.term_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
                <Button type="submit" variant="contained" className="dashboard-button">
                  Xem xếp hạng
                </Button>
              </form>
              {rankings.length > 0 ? (
                <Box className="dashboard-data-grid">
                  <DataGrid
                    rows={rankings}
                    columns={rankingColumns}
                    initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
                    pageSizeOptions={[5, 10, 20]}
                    autoHeight
                    getRowClassName={(params) =>
                      params.row.student_code === user?.student_code ? 'highlight-row' : ''
                    }
                  />
                </Box>
              ) : (
                <Typography className="dashboard-no-data">
                  Không có xếp hạng nào.
                </Typography>
              )}
            </CardContent>
          </Card>
        )}

        {tabValue === 3 && (
          <Card className="dashboard-card">
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Xem Học Lực
              </Typography>
              <form onSubmit={handleFetchAcademicPerformance} className="dashboard-form">
                <FormControl className="dashboard-form-control">
                  <InputLabel>Loại học lực</InputLabel>
                  <Select
                    value={academicPerformanceType}
                    onChange={(e) => setAcademicPerformanceType(e.target.value)}
                    label="Loại học lực"
                    required
                  >
                    <MenuItem value="classroom-term">Học lực theo lớp và học kỳ</MenuItem>
                    <MenuItem value="grade-term">Học lực theo khối và học kỳ</MenuItem>
                    <MenuItem value="classroom-yearly">Học lực theo lớp cả năm</MenuItem>
                    <MenuItem value="grade-yearly">Học lực theo khối cả năm</MenuItem>
                  </Select>
                </FormControl>
                {(academicPerformanceType === 'classroom-term' || academicPerformanceType === 'classroom-yearly') && (
                  <FormControl className="dashboard-form-control">
                    <InputLabel>Lớp học</InputLabel>
                    <Select
                      value={classroomCode}
                      onChange={(e) => setClassroomCode(e.target.value)}
                      label="Lớp học"
                      required
                    >
                      {classroomOptions.map((classroom) => (
                        <MenuItem key={classroom.classroom_code} value={classroom.classroom_code}>
                          {classroom.classroom_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
                {(academicPerformanceType === 'grade-term' || academicPerformanceType === 'grade-yearly') && (
                  <FormControl className="dashboard-form-control">
                    <InputLabel>Khối</InputLabel>
                    <Select
                      value={gradeCode}
                      onChange={(e) => setGradeCode(e.target.value)}
                      label="Khối"
                      required
                    >
                      {gradeOptions.map((grade) => (
                        <MenuItem key={grade.grade_code} value={grade.grade_code}>
                          {grade.grade_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
                {(academicPerformanceType === 'classroom-term' || academicPerformanceType === 'grade-term') && (
                  <FormControl className="dashboard-form-control">
                    <InputLabel>Học kỳ</InputLabel>
                    <Select
                      value={rankingTermCode}
                      onChange={(e) => setRankingTermCode(e.target.value)}
                      label="Học kỳ"
                      required
                    >
                      {termOptions.map((term) => (
                        <MenuItem key={term.term_code} value={term.term_code}>
                          {term.term_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
                <FormControl className="dashboard-form-control">
                  <InputLabel>Mức học lực</InputLabel>
                  <Select
                    value={academicPerformanceLevel}
                    onChange={(e) => setAcademicPerformanceLevel(e.target.value)}
                    label="Mức học lực"
                    required
                  >
                    {academicPerformanceLevels.map((level) => (
                      <MenuItem key={level} value={level}>
                        {level}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button type="submit" variant="contained" className="dashboard-button">
                  Xem học lực
                </Button>
              </form>
              {academicPerformanceData.length > 0 ? (
                <Box className="dashboard-data-grid">
                  <DataGrid
                    rows={academicPerformanceData}
                    columns={academicPerformanceColumns}
                    initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
                    pageSizeOptions={[5, 10, 20]}
                    autoHeight
                    getRowClassName={(params) =>
                      params.row.student_code === user?.student_code ? 'highlight-row' : ''
                    }
                  />
                </Box>
              ) : (
                <Typography className="dashboard-no-data">
                  Không có học sinh nào phù hợp với mức học lực này.
                </Typography>
              )}
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default StudentDashboard;