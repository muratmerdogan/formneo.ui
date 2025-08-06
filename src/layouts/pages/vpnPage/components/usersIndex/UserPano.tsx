import {
    Container,
    Typography,
    Card,
    CardContent,
    Avatar,
    Chip,
    IconButton,
    TextField,
    InputAdornment,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    Tooltip,
    Grid
  } from '@mui/material';
  import {
    Email,
    Phone,
    LocationOn,
    Search,
    FilterList,
    People
  } from '@mui/icons-material';
import { useState } from 'react';
import MDButton from 'components/MDButton';

  interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    department: string;
    avatar?: string;
    status: 'active' | 'away' | 'offline';
  }
  
  const mockUsers: User[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      phone: '+1 (555) 123-4567',
      role: 'Project Manager',
      department: 'Development',
      status: 'active'
    },
    {
      id: 2,
      firstName: 'Sarah',
      lastName: 'Wilson',
      email: 'sarah.wilson@company.com',
      phone: '+1 (555) 234-5678',
      role: 'Lead Developer',
      department: 'Development',
      status: 'active'
    },
    {
      id: 3,
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'michael.brown@company.com',
      phone: '+1 (555) 345-6789',
      role: 'UI/UX Designer',
      department: 'Design',
      status: 'away'
    },
    {
      id: 4,
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily.davis@company.com',
      phone: '+1 (555) 456-7890',
      role: 'QA Engineer',
      department: 'Quality Assurance',
      status: 'active'
    },
    {
      id: 5,
      firstName: 'David',
      lastName: 'Miller',
      email: 'david.miller@company.com',
      phone: '+1 (555) 567-8901',
      role: 'DevOps Engineer',
      department: 'Infrastructure',
      status: 'offline'
    },
    {
      id: 6,
      firstName: 'Lisa',
      lastName: 'Garcia',
      email: 'lisa.garcia@company.com',
      phone: '+1 (555) 678-9012',
      role: 'Business Analyst',
      department: 'Business',
      status: 'active'
    }
  ];
  
  function UserPano() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('all');
  
    const departments = ['all', ...new Set(mockUsers.map(user => user.department))];
  
    const filteredUsers = mockUsers.filter(user => {
      const matchesSearch = (user.firstName + ' ' + user.lastName + ' ' + user.email)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesDepartment = selectedDepartment === 'all' || user.department === selectedDepartment;
      return matchesSearch && matchesDepartment;
    });
  
    const handleEmailContact = (email: string, name: string) => {
      window.open(`mailto:${email}`, '_blank');
      console.log(`Opening email to ${name}`);
    };
  
    const getInitials = (firstName: string, lastName: string) => {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`;
    };
  
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          
  
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
            <TextField
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              fullWidth
              sx={{ minWidth: 300 }}
            />
  
            {/* <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Department</InputLabel>
              <Select
                value={selectedDepartment}
                label="Department"
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                {departments.map(dept => (
                  <MenuItem key={dept} value={dept}>
                    {dept === 'all' ? 'All Departments' : dept}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}
          </Box>
  
          {/* <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2, mb: 4 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                  {filteredUsers.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Members
                </Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                  {filteredUsers.filter(u => u.status === 'active').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active
                </Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
                  {filteredUsers.filter(u => u.status === 'away').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Away
                </Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                  {departments.length - 1}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Departments
                </Typography>
              </CardContent>
            </Card>
          </Box> */}
        </Box>
  
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
          {filteredUsers.map((user) => (
            <Box key={user.id} >
              <Card
                className='main-card-render'
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  
                  '&:hover': {
                    transform: 'translateY(4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ position: 'relative', mr: 2 }}>
                      <Avatar 
                        src={user.avatar} 
                        alt={`${user.firstName} ${user.lastName}`}
                        sx={{ 
                          width: 60, 
                          height: 60,
                          bgcolor: 'primary.light'
                        }}
                      >
                        {getInitials(user.firstName, user.lastName)}
                      </Avatar>
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: -2,
                          right: -2,
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          border: '2px solid white',
                          bgcolor: user.status === 'active' ? 'success.main' : 
                                  user.status === 'away' ? 'warning.main' : 'grey.400'
                        }}
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        {user.firstName} {user.lastName}
                      </Typography>
                      {/* <Chip 
                        label={user.status} 
                        size="small" 
                        color={getStatusColor(user.status) as 'success' | 'warning' | 'default'}
                        sx={{ fontSize: '0.75rem' }}
                      /> */}
                    </Box>
                  </Box>
  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="primary.main" sx={{ fontWeight: 'medium', mb: 0.5 }}>
                      {user.role}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {user.department}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <Email /> {user.email}
                    </Typography>
                    
                  </Box>
  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                      <MDButton variant="outlined" color="primary" size="small" onClick={() => handleEmailContact(user.email, `${user.firstName} ${user.lastName}`)}>
                        <Email sx={{ mr: 1.5 }} />
                        <span>Email</span>
                      </MDButton>
                    
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
  
        {filteredUsers.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <People sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              Sonuç bulunamadı
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Lütfen arama kriterlerinizi düzenleyin
            </Typography>
          </Box>
        )}
      </Container>
    );
  }
  
  export default UserPano;