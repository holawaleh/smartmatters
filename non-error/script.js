// Sample data
const attendanceData = [
    { label: 'Present', value: 2627, color: '#10b981', percentage: 99.85 },
    { label: 'Absent', value: 4, color: '#ef4444', percentage: 0.15 }
];

const exceptionData = [
    { date: '2019-09-11', value: 0 },
    { date: '2019-09-15', value: 500 },
    { date: '2019-09-19', value: 1000 },
    { date: '2019-09-23', value: 1500 },
    { date: '2019-09-27', value: 2000 },
    { date: '2019-10-01', value: 2500 },
    { date: '2019-10-05', value: 2200 },
    { date: '2019-10-09', value: 1800 }
];

const realtimeData = [
    { time: '00:00', value: 0 },
    { time: '01:13', value: 1 },
    { time: '02:26', value: 0 },
    { time: '03:39', value: 0 },
    { time: '04:52', value: 0 },
    { time: '06:05', value: 0 },
    { time: '07:18', value: 0 },
    { time: '08:31', value: 0 },
    { time: '09:44', value: 0 },
    { time: '10:57', value: 1 },
    { time: '12:10', value: 0 },
    { time: '13:23', value: 0 },
    { time: '14:36', value: 1 }
];

const attendanceRecords = [
    {
        id: '1',
        employeeId: '31800179',
        name: 'Codie',
        action: 'Auto add',
        time: '15:16:17',
        location: '255',
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
        id: '2',
        employeeId: '31800179',
        name: 'Codie',
        action: 'Auto add',
        time: '15:16:12',
        location: '255',
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
        id: '3',
        employeeId: '101001',
        name: 'Employee',
        action: 'Auto add',
        time: '15:07:58',
        location: '255'
    },
    {
        id: '4',
        employeeId: '101001',
        name: 'Employee',
        action: 'Auto add',
        time: '11:04:41',
        location: '255'
    },
    {
        id: '5',
        employeeId: '101001',
        name: 'Employee',
        action: 'Auto add',
        time: '10:54:00',
        location: '255'
    }
];

// Pie Chart Function
function drawPieChart(canvasId, data) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    
    let currentAngle = -Math.PI / 2; // Start from top
    
    data.forEach(item => {
        const sliceAngle = (item.percentage / 100) * 2 * Math.PI;
        
        // Draw slice
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = item.color;
        ctx.fill();
        
        // Add subtle stroke
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        currentAngle += sliceAngle;
    });
}

// Line Chart Function
function drawLineChart(canvasId, data) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const valueRange = maxValue - minValue || 1;
    
    // Draw grid
    ctx.strokeStyle = '#f3f4f6';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (i / 5) * chartHeight;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
    }
    
    // Calculate points
    const points = data.map((point, index) => {
        const x = padding + (index / (data.length - 1)) * chartWidth;
        const y = padding + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
        return { x, y, value: point.value };
    });
    
    // Draw line
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    points.forEach((point, index) => {
        if (index === 0) {
            ctx.moveTo(point.x, point.y);
        } else {
            ctx.lineTo(point.x, point.y);
        }
    });
    ctx.stroke();
    
    // Draw points
    points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = '#3b82f6';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
    
    // Draw labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'end';
    ctx.fillText(maxValue.toString(), padding - 10, padding + 5);
    ctx.fillText(minValue.toString(), padding - 10, canvas.height - padding + 5);
}

// Bar Chart Function
function drawBarChart(canvasId, data) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    
    const maxValue = Math.max(...data.map(d => d.value));
    const barWidth = chartWidth / data.length * 0.8;
    const barSpacing = chartWidth / data.length * 0.2;
    
    // Draw grid
    ctx.strokeStyle = '#f3f4f6';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (i / 5) * chartHeight;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
    }
    
    // Draw bars
    data.forEach((item, index) => {
        const barHeight = maxValue > 0 ? (item.value / maxValue) * chartHeight : 0;
        const x = padding + index * (barWidth + barSpacing);
        const y = canvas.height - padding - barHeight;
        
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Add subtle stroke
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, barWidth, barHeight);
    });
    
    // Draw labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'end';
    ctx.fillText(maxValue.toString(), padding - 10, padding + 5);
    ctx.fillText('0', padding - 10, canvas.height - padding + 5);
}

// Populate Attendance Table
function populateAttendanceTable() {
    const tbody = document.getElementById('attendanceTableBody');
    tbody.innerHTML = '';
    
    attendanceRecords.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="employee-info">
                    ${record.avatar ? 
                        `<img src="${record.avatar}" alt="${record.name}" class="employee-avatar">` :
                        `<div class="employee-placeholder"><i class="fas fa-user"></i></div>`
                    }
                    <div class="employee-details">
                        <div class="employee-id">${record.employeeId}</div>
                        <div class="employee-name">${record.name}</div>
                    </div>
                </div>
            </td>
            <td>
                <div class="action-info">
                    <i class="fas fa-calendar"></i>
                    <span>${record.action}</span>
                </div>
            </td>
            <td>
                <div class="time-info">
                    <i class="fas fa-clock"></i>
                    <span>${record.time}</span>
                </div>
            </td>
            <td>${record.location}</td>
            <td>
                <div class="status-info">
                    <i class="fas fa-check-circle"></i>
                    <span>Auto add</span>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Add hover effects to action buttons
function addInteractivity() {
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Add click animation
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    // Add hover effects to table rows
    const tableRows = document.querySelectorAll('.attendance-table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            row.style.backgroundColor = '#f8fafc';
        });
        row.addEventListener('mouseleave', () => {
            row.style.backgroundColor = '';
        });
    });
}

// Simulate real-time updates
function simulateRealTimeUpdates() {
    setInterval(() => {
        // Update notification badge randomly
        const badge = document.querySelector('.notification-badge');
        const currentCount = parseInt(badge.textContent);
        const newCount = Math.max(0, currentCount + Math.floor(Math.random() * 3) - 1);
        badge.textContent = newCount;
        
        // Update active count
        const statNumber = document.querySelector('.stat-number');
        const currentActive = parseInt(statNumber.textContent);
        const newActive = Math.max(0, currentActive + Math.floor(Math.random() * 3) - 1);
        statNumber.textContent = newActive;
        
        // Redraw bar chart with updated data
        realtimeData.forEach(item => {
            item.value = Math.floor(Math.random() * 3);
        });
        drawBarChart('barChart', realtimeData);
    }, 5000); // Update every 5 seconds
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in (simple demo check)
    const isLoggedIn = sessionStorage.getItem('biotime_logged_in');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            sessionStorage.removeItem('biotime_logged_in');
            window.location.href = 'login.html';
        });
    }

    // Draw charts
    drawPieChart('pieChart', attendanceData);
    drawLineChart('lineChart', exceptionData);
    drawBarChart('barChart', realtimeData);
    
    // Populate table
    populateAttendanceTable();
    
    // Add interactivity
    addInteractivity();
    
    // Start real-time updates
    simulateRealTimeUpdates();
    
    console.log('ZKTeco Attendance Dashboard initialized successfully!');
});