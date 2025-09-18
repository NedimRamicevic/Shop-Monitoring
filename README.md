# Advanced Repair Shop Monitoring & Management System

A comprehensive, modern web application for managing aircraft repair shop operations with advanced analytics, performance tracking, and intelligent automation.

## 🚀 Enhanced Features

### 🔐 Advanced Authentication System
- **Role-based Login**: Choose between Manager or Technician roles
- **User Selection**: Pick from predefined users with photos and detailed profiles
- **Secure Session Management**: JWT-based authentication with proper logout
- **Profile Management**: Detailed user profiles with skills and performance history

### 👨‍💼 Enhanced Manager Dashboard
- **Multi-Tab Interface**: Kanban Board, Shop Analytics, Personnel Performance, Assignments & Controls
- **Real-time Statistics**: Comprehensive overview with KPI cards and trend analysis
- **Advanced Kanban Board**: Visual drag-and-drop with employee workload boxes
- **Smart Auto-Assignment**: Priority-based algorithm respecting 8-hour daily capacity
- **Bulk Operations**: Select and manage multiple parts simultaneously
- **Notification System**: Real-time alerts for capacity, overdue parts, and performance issues

### 📊 Advanced Analytics & Monitoring
- **Shop Health Dashboard**: MTTR, scrap rates, backlog trends, and workload distribution
- **Personnel Performance Tracking**: Individual technician metrics with charts and leaderboards
- **Performance Alerts**: Automated notifications for efficiency issues and achievements
- **Visual Analytics**: Interactive charts using Recharts (bar, line, pie, area charts)
- **Heatmap Visualization**: Workload distribution across technicians and statuses

### 🔧 Enhanced Technician Experience
- **Gamified Workspace**: Badge system, daily progress tracking, and achievement milestones
- **Personal Dashboard**: "My Parts Today" with countdown timers and progress bars
- **Performance Metrics**: Real-time efficiency tracking and skill development
- **Note System**: Add comments and observations to parts for traceability
- **Achievement Badges**: Speed Demon, Quality Master, Efficiency Expert, Team Player

### 📋 Part History & Traceability
- **Complete Timeline**: Full audit trail of every part movement and status change
- **Technician Notes**: Collaborative documentation system
- **Performance Tracking**: Estimated vs actual repair times
- **Status History**: Who did what, when, and why for complete accountability

### 🔔 Intelligent Notification System
- **Capacity Alerts**: Warnings when technicians approach or exceed 8-hour limits
- **Overdue Notifications**: Alerts for parts stuck in status too long
- **Performance Alerts**: Notifications for high scrap rates or efficiency issues
- **Milestone Celebrations**: Achievement notifications for technicians
- **Critical Part Alerts**: Immediate notifications for high-priority items

## 🛠 Technology Stack

- **Frontend**: React 18 with Next.js 14
- **Language**: TypeScript for comprehensive type safety
- **Styling**: TailwindCSS for modern, responsive design
- **State Management**: Zustand for efficient global state management
- **Charts**: Recharts for interactive data visualization
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for advanced date manipulation
- **Architecture**: Component-based with custom hooks and utilities

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd repair-shop-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 👥 Demo Users

### Managers
- **Robert Taylor** - Senior Operations Manager
- **Lisa Anderson** - Quality Assurance Manager

### Technicians (with Skills & Performance Data)
- **John Smith** - Hydraulics, Avionics, Engine Systems (85.3% efficiency, 32 parts/month)
- **Sarah Johnson** - Landing Gear, Fuel Systems, Navigation (78.9% efficiency, 28 parts/month)
- **Mike Davis** - Engine Repair, APU Systems, Troubleshooting (91.2% efficiency, 45 parts/month)
- **Emily Wilson** - Cabin Systems, Environmental Control, Electrical (82.7% efficiency, 38 parts/month)
- **David Brown** - Structural Repair, Composite Materials, Quality Control (76.4% efficiency, 31 parts/month)

## 📖 Usage Guide

### For Managers

#### 🎯 Kanban Board Management
1. **Visual Workflow**: Drag parts between status columns (To Be Repaired → Repairing → Repaired → Shipped)
2. **Employee Assignment**: Drag parts to technician boxes or use "Auto Assign" button
3. **Capacity Monitoring**: Visual indicators show technician workload and available hours
4. **Real-time Updates**: All changes reflect immediately across the system

#### 📊 Analytics & Performance
1. **Shop Health**: Monitor MTTR, scrap rates, backlog trends, and overall shop performance
2. **Personnel Analytics**: View detailed performance metrics, efficiency trends, and leaderboards
3. **Performance Alerts**: Get notified of capacity issues, overdue parts, and efficiency problems
4. **Visual Charts**: Interactive graphs showing trends and distributions

#### ⚙️ Assignment & Controls
1. **Advanced Filtering**: Filter parts by status, priority, aircraft, technician, and customer
2. **Bulk Operations**: Select multiple parts for batch assignments or status updates
3. **Smart Assignment**: Auto-assign based on priority, capacity, and technician skills
4. **Part Timeline**: View complete history and traceability for any part

### For Technicians

#### 🎮 Gamified Workspace
1. **Daily Progress**: Track hours worked, parts completed, and remaining capacity
2. **Achievement System**: Earn badges for milestones (Speed Demon, Quality Master, etc.)
3. **Performance Tracking**: Monitor your efficiency, repair times, and success rates
4. **Skill Development**: View your expertise areas and performance metrics

#### 🔧 Part Management
1. **My Parts Today**: View all assigned parts with priority and estimated hours
2. **Status Updates**: Easy buttons to update part status with actual hours tracking
3. **Note System**: Add observations and findings to parts for team collaboration
4. **Timeline View**: See complete history of parts you've worked on

## 🎯 Key Features

### 🧠 Intelligent Assignment System
- **Priority-based**: Critical parts assigned first, then by estimated hours
- **Capacity-aware**: Respects 8-hour daily limits with visual warnings
- **Skill matching**: Considers technician expertise and specializations
- **Load balancing**: Distributes work evenly across the team
- **Auto-assignment**: One-click distribution of all unassigned parts

### 📈 Advanced Performance Analytics
- **Real-time Metrics**: Live tracking of efficiency, repair times, and success rates
- **Historical Trends**: Performance data over time with visual charts
- **Comparative Analysis**: Technician performance comparison and leaderboards
- **Predictive Insights**: Identify potential issues before they become problems
- **Customizable Views**: Filter and analyze data by time periods and criteria

### 🔔 Smart Notification System
- **Capacity Alerts**: Warnings when technicians approach or exceed daily limits
- **Overdue Notifications**: Alerts for parts stuck in status too long
- **Performance Alerts**: Notifications for efficiency issues and achievements
- **Critical Alerts**: Immediate notifications for high-priority parts
- **Milestone Celebrations**: Achievement notifications and badge awards

### 🔄 Real-time Collaboration
- **Live Updates**: Changes reflect immediately across all user interfaces
- **Multi-user Support**: Multiple users can work simultaneously
- **Audit Trail**: Complete history of all part movements and decisions
- **Collaborative Notes**: Team members can add observations and findings
- **Status Synchronization**: All views stay synchronized in real-time

## 📁 Enhanced Project Structure

```
src/
├── app/                           # Next.js app directory
│   ├── globals.css               # Global styles with custom components
│   ├── layout.tsx                # Root layout with providers
│   └── page.tsx                  # Main application with Zustand integration
├── components/                   # React components
│   ├── LoginScreen.tsx           # Authentication interface
│   ├── EnhancedManagerDashboard.tsx # Advanced manager interface
│   ├── EnhancedTechnicianWorkspace.tsx # Gamified technician interface
│   ├── KanbanBoard.tsx           # Drag-and-drop board with employee boxes
│   ├── PersonnelPerformance.tsx  # Performance analytics and charts
│   ├── ShopAnalytics.tsx         # Shop health and KPI dashboard
│   └── PartTimeline.tsx          # Complete part history and traceability
├── store/                        # Zustand state management
│   └── useStore.ts               # Global state with actions and reducers
├── data/                         # Enhanced mock data
│   ├── mockData.ts               # Original data structure
│   └── enhancedMockData.ts       # Enhanced data with performance metrics
├── types/                        # TypeScript definitions
│   └── index.ts                  # Comprehensive type definitions
└── utils/                        # Utility functions
    ├── personnelStats.ts         # Performance calculations
    └── notificationSystem.ts     # Smart notification engine
```

## 🎨 Design System

### Color Coding
- **Green**: On track, completed, efficient performance
- **Yellow**: Risk, delays, capacity nearing limits
- **Red**: Problems, overdue, overload, excessive scrap
- **Blue**: Information, shipped parts, neutral status

### Visual Indicators
- **Progress Bars**: Daily capacity and completion tracking
- **Badge System**: Achievement recognition and skill indicators
- **Status Icons**: Intuitive icons for different part statuses
- **Heatmaps**: Visual workload distribution across teams

## 🔧 Advanced Configuration

### Notification Settings
- **Check Intervals**: Configurable notification check frequency
- **Thresholds**: Customizable alert thresholds for capacity and performance
- **Notification Types**: Info, warning, error, and success notifications
- **Auto-clearing**: Configurable notification retention and cleanup

### Performance Metrics
- **Efficiency Calculation**: Based on estimated vs actual repair times
- **Capacity Management**: 8-hour daily limits with overtime tracking
- **Quality Metrics**: Scrap rates and on-time delivery tracking
- **Skill Assessment**: Performance tracking by technical specialization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.

## 🎯 Roadmap

### Planned Features
- **Mobile App**: Native mobile application for technicians
- **Advanced Reporting**: PDF reports and data export capabilities
- **Integration APIs**: Connect with external systems and databases
- **Machine Learning**: Predictive analytics for repair times and capacity planning
- **Multi-shop Support**: Manage multiple repair shop locations
- **Advanced Scheduling**: Shift planning and resource optimization#   S h o p - M o n i t o r i n g  
 