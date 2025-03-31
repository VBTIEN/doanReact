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
  Tabs,
  Tab,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Paper,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GradeIcon from '@mui/icons-material/Grade';
import PersonIcon from '@mui/icons-material/Person';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
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

  // State for rankings
  const [rankingType, setRankingType] = useState('classroom-term');
  const [classroomCode, setClassroomCode] = useState('');
  const [gradeCode, setGradeCode] = useState('');
  const [rankingTermCode, setRankingTermCode] = useState('');
  const [rankings, setRankings] = useState([]);
  const [classroomOptions, setClassroomOptions] = useState([]);
  const [gradeOptions, setGradeOptions] = useState([]);
  const [termOptions, setTermOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [examOptions, setExamOptions] = useState([]); // Renamed from examCode to examOptions for clarity

  // Define columns for the scores DataGrid
  const scoreColumns = [
    { field: 'exam_name', headerName: 'Tên bài kiểm tra', width: 200 }, // Changed to exam_name
    { field: 'subject_code', headerName: 'Mã môn học', width: 120 },
    { field: 'score_value', headerName: 'Điểm', width: 100 },
    { field: 'date', headerName: 'Ngày', width: 150 },
  ];

  // Define columns for the rankings DataGrid
  const rankingColumns = [
    {
      field: 'rank',
      headerName: 'Xếp hạng',
      width: 100,
    },
    { field: 'student_code', headerName: 'Mã học sinh', width: 150 },
    { field: 'name', headerName: 'Tên học sinh', width: 200 },
    { field: 'term_average', headerName: 'Điểm trung bình', width: 150 },
  ];

  // Lấy thông tin người dùng và các tùy chọn (lớp, khối, học kỳ, môn học, bài kiểm tra)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Lấy thông tin người dùng
        const userString = localStorage.getItem('user');
        let userData = null;
        userData = userString ? JSON.parse(userString) : null;
        setUser(userData.data);
        setFormData({
          name: userData.data.name || '',
          email: userData.data.email || '',
          avatar: null,
        });

        // Lấy danh sách lớp học
        const classrooms = await getAll.getAllClassrooms();
        setClassroomOptions([
          ...classrooms.map((classroom) => ({
            classroom_code: classroom.classroom_code,
            classroom_name: classroom.classroom_name,
          })),
        ]);

        // Lấy danh sách khối
        const grades = await getAll.getAllGrades();
        setGradeOptions([
          ...grades.map((grade) => ({
            grade_code: grade.grade_code,
            grade_name: grade.grade_name,
          })),
        ]);

        // Lấy danh sách học kỳ
        const terms = await getAll.getAllTerms();
        setTermOptions([
          ...terms.map((term) => ({
            term_code: term.term_code,
            term_name: term.term_name,
          })),
        ]);

        // Lấy danh sách môn học
        const subjects = await getAll.getAllSubjects();
        setSubjectOptions([
          ...subjects.map((subject) => ({
            subject_code: subject.subject_code,
            subject_name: subject.subject_name,
          })),
        ]);

        // Lấy danh sách bài kiểm tra
        const exams = await getAll.getAllExams();
        setExamOptions([
          ...exams.map((exam) => ({
            exam_code: exam.exam_code,
            exam_name: exam.exam_name,
          })),
        ]);
      } catch (error) {
        toast.error('Không thể lấy thông tin hoặc dữ liệu cần thiết.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Xử lý thay đổi tab
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Xử lý lấy điểm của học sinh
  const handleFetchScores = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const scoresData = await studentService.getStudentScores(subjectCode, termCode);
      // Map scores data to include exam_name instead of exam_code
      const mappedScores = scoresData.map((score, index) => {
        const exam = examOptions.find((e) => e.exam_code === score.exam_code);
        return {
          ...score,
          id: score.exam_code || `score-${index}`, // Ensure unique id
          exam_name: exam ? exam.exam_name : score.exam_code || 'N/A', // Use exam_name if available, otherwise fallback to exam_code
          subject_code: score.subject_code || subjectCode || 'N/A', // Use subject_code from data or fallback to selected subjectCode
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

  // Xử lý lấy xếp hạng
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
          rankingsData = await studentService.getClassroomTermRankings(classroomCode, rankingTermCode);
          break;
        case 'grade-term':
          if (!gradeCode || !rankingTermCode) {
            toast.error('Vui lòng chọn khối và học kỳ.');
            setLoading(false);
            return;
          }
          rankingsData = await studentService.getGradeTermRankings(gradeCode, rankingTermCode);
          break;
        case 'classroom-yearly':
          if (!classroomCode) {
            toast.error('Vui lòng chọn lớp.');
            setLoading(false);
            return;
          }
          rankingsData = await studentService.getClassroomYearlyRankings(classroomCode);
          break;
        case 'grade-yearly':
          if (!gradeCode) {
            toast.error('Vui lòng chọn khối.');
            setLoading(false);
            return;
          }
          rankingsData = await studentService.getGradeYearlyRankings(gradeCode);
          break;
        default:
          throw new Error('Loại xếp hạng không hợp lệ.');
      }
      // Ensure rankingsData.rankings is an array
      if (!rankingsData || !Array.isArray(rankingsData.rankings)) {
        throw new Error('Dữ liệu xếp hạng không hợp lệ.');
      }
      // Map rankings data to create a single 'rank' field
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
      console.error('Error fetching rankings:', error);
      toast.error(error.message || 'Không thể lấy xếp hạng.');
      setRankings([]);
    } finally {
      setLoading(false);
    }
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
      const updatedData = await studentService.updateStudentProfile(formData);
      setUser((prev) => ({
        ...prev,
        name: updatedData.name || prev.name,
        email: updatedData.email || prev.email,
        avatar_url: updatedData.avatar_url || prev.avatar_url,
      }));
      const updatedUser = {
        ...JSON.parse(localStorage.getItem('user')),
        data: {
          ...JSON.parse(localStorage.getItem('user')).data,
          name: updatedData.name || user.name,
          email: updatedData.email || user.email,
          avatar_url: updatedData.avatar_url || user.avatar_url,
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

  return (
    <Box className="student-dashboard-container">
      <Box className="student-dashboard-content">
        <Typography variant="h4" className="student-dashboard-title">
          Trang Quản Lý Học Sinh
        </Typography>

        {/* Tabs để chuyển đổi giữa các tính năng */}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          className="student-dashboard-tabs"
        >
          <Tab label="Xem điểm" icon={<GradeIcon />} />
          <Tab label="Thông tin cá nhân" icon={<PersonIcon />} />
          <Tab label="Xem xếp hạng" icon={<EmojiEventsIcon />} />
        </Tabs>

        {/* Hiển thị loading spinner */}
        {loading && (
          <Box className="student-dashboard-loading">
            <CircularProgress />
          </Box>
        )}

        {/* Toast container để hiển thị thông báo */}
        <ToastContainer position="top-right" autoClose={3000} />

        {/* Tab 1: Xem điểm */}
        {tabValue === 0 && (
          <Card className="student-dashboard-card">
            <CardContent className="student-dashboard-card-content">
              <Typography variant="h6" gutterBottom>
                Xem điểm
              </Typography>
              <form onSubmit={handleFetchScores}>
                <FormControl className="student-dashboard-form-control">
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
                <FormControl className="student-dashboard-form-control">
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
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className="student-dashboard-button"
                >
                  Xem điểm
                </Button>
              </form>

              {/* Hiển thị danh sách điểm với DataGrid */}
              {scores.length > 0 ? (
                <Box className="student-dashboard-data-grid">
                  <DataGrid
                    rows={scores}
                    columns={scoreColumns}
                    initialState={{
                      pagination: {
                        paginationModel: { pageSize: 5 },
                      },
                    }}
                    pageSizeOptions={[5, 10, 20]}
                    autoHeight
                  />
                </Box>
              ) : (
                <Typography className="student-dashboard-no-data">
                  Không có điểm nào cho môn học và học kỳ này.
                </Typography>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tab 2: Thông tin cá nhân */}
        {tabValue === 1 && (
          <Card className="student-dashboard-card">
            <CardContent className="student-dashboard-card-content student-personal-info-card">
              <Typography variant="h6" gutterBottom className="student-personal-info-title">
                Thông tin cá nhân
              </Typography>
              {user ? (
                <Box className="student-personal-info-container">
                  <Box className="student-personal-info-item student-avatar-section">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt="Avatar"
                        className="student-personal-info-avatar"
                        style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                      />
                    ) : (
                      <PersonIcon style={{ fontSize: '100px', color: '#ccc' }} />
                    )}
                  </Box>
                  <Button
                    variant="contained"
                    color={isEditing ? 'secondary' : 'primary'}
                    onClick={() => setIsEditing(!isEditing)}
                    sx={{ mb: 2 }}
                  >
                    {isEditing ? 'Hủy' : 'Chỉnh sửa thông tin'}
                  </Button>
                  {isEditing ? (
                    <form onSubmit={handleUpdateProfile}>
                      <Box className="student-personal-info-item">
                        <Typography variant="body1" className="student-personal-info-label">
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
                      <Box className="student-personal-info-item">
                        <Typography variant="body1" className="student-personal-info-label">
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
                      <Box className="student-personal-info-item">
                        <Typography variant="body1" className="student-personal-info-label">
                          Avatar:
                        </Typography>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          style={{ marginTop: '10px' }}
                        />
                      </Box>
                      <Box className="student-personal-info-item">
                        <Typography variant="body1" className="student-personal-info-label">
                          Mã học sinh:
                        </Typography>
                        <Typography variant="body1" className="student-personal-info-value">
                          {user.student_code || 'Không có thông tin'}
                        </Typography>
                      </Box>
                      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                        Lưu thay đổi
                      </Button>
                    </form>
                  ) : (
                    <>
                      <Box className="student-personal-info-item">
                        <Typography variant="body1" className="student-personal-info-label">
                          Họ và tên:
                        </Typography>
                        <Typography variant="body1" className="student-personal-info-value">
                          {user.name || 'Không có thông tin'}
                        </Typography>
                      </Box>
                      <Box className="student-personal-info-item">
                        <Typography variant="body1" className="student-personal-info-label">
                          Email:
                        </Typography>
                        <Typography variant="body1" className="student-personal-info-value">
                          {user.email || 'Không có thông tin'}
                        </Typography>
                      </Box>
                      <Box className="student-personal-info-item">
                        <Typography variant="body1" className="student-personal-info-label">
                          Mã học sinh:
                        </Typography>
                        <Typography variant="body1" className="student-personal-info-value">
                          {user.student_code || 'Không có thông tin'}
                        </Typography>
                      </Box>
                    </>
                  )}
                </Box>
              ) : (
                <Typography className="student-dashboard-no-data">
                  Không có thông tin người dùng. Vui lòng đăng nhập lại.
                </Typography>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tab 3: Xem xếp hạng */}
        {tabValue === 2 && (
          <Card className="student-dashboard-card">
            <CardContent className="student-dashboard-card-content">
              <Typography variant="h6" gutterBottom>
                Xem xếp hạng
              </Typography>
              <form onSubmit={handleFetchRankings}>
                <FormControl className="student-dashboard-form-control">
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
                  <FormControl className="student-dashboard-form-control">
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
                  <FormControl className="student-dashboard-form-control">
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
                  <FormControl className="student-dashboard-form-control">
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

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className="student-dashboard-button"
                >
                  Xem xếp hạng
                </Button>
              </form>

              {/* Hiển thị danh sách xếp hạng với DataGrid */}
              {rankings.length > 0 ? (
                <Box className="student-dashboard-data-grid">
                  <DataGrid
                    rows={rankings}
                    columns={rankingColumns}
                    initialState={{
                      pagination: {
                        paginationModel: { pageSize: 5 },
                      },
                    }}
                    pageSizeOptions={[5, 10, 20]}
                    autoHeight
                    getRowClassName={(params) =>
                      params.row.student_code === user?.student_code ? 'student-ranking-highlight' : ''
                    }
                  />
                </Box>
              ) : (
                <Typography className="student-dashboard-no-data">
                  Không có xếp hạng nào.
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