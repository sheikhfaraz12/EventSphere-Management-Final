import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Sidebar from "../../components/Sidebar";
import Dashboard from "./Dashboard";
import CreateExpo from "./CreateExpo";
import UpdateExpo from "./UpdateExpo";
import DeleteExpo from "./DeleteExpo";
import ApproveExhibitor from "./ApproveExhibitor";
import CreateBooth from "./CreateBooth";
import CreateSession from "./CreateSession";
import ExpoList from "./ExpoList";
import BoothList from "./BoothList";
import {
    Box,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    LinearProgress,
    Stack,
    IconButton,
    Chip,
    Avatar,
    Tooltip,
    CircularProgress,
    Alert
} from "@mui/material";
import {
    TrendingUp as TrendingUpIcon,
    People as PeopleIcon,
    Event as EventIcon,
    Storefront as StorefrontIcon,
    Refresh as RefreshIcon,
    ArrowUpward as ArrowUpwardIcon,
    ArrowDownward as ArrowDownwardIcon,
    Error as ErrorIcon
} from "@mui/icons-material";

// Import your actual API functions
import { 
    getAllExpos, 
    getPendingExhibitors,
    getExhibitorsByExpo 
} from "../../services/api";

export default function AdminPanel() {
    const { user, token } = useAuth();
    const [activePage, setActivePage] = useState("dashboard");
    const [editingExpoId, setEditingExpoId] = useState(null);
    const [deletingExpoId, setDeletingExpoId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [analytics, setAnalytics] = useState({
        totalExpos: 0,
        totalExhibitors: 0,
        activeExpos: 0,
        pendingExhibitors: 0,
        expoGrowth: 0,
        exhibitorGrowth: 0,
        recentActivity: []
    });

    useEffect(() => {
        if (user && user.role === "admin") {
            fetchAnalyticsData();
        }
    }, [user]);

    const fetchAnalyticsData = async () => {
        if (!token) return;
        
        setLoading(true);
        setError(null);
        try {
            // Fetch all expos
            const exposResponse = await getAllExpos();
            const exposData = exposResponse.data || [];
            
            // Fetch pending exhibitors
            const pendingResponse = await getPendingExhibitors(token);
            const pendingExhibitors = pendingResponse.data || [];
            
            // Calculate active expos (you might want to add a status field to your expo model)
            const activeExpos = exposData.filter(expo => {
                // Assuming expo has startDate and endDate fields
                if (expo.startDate && expo.endDate) {
                    const now = new Date();
                    const start = new Date(expo.startDate);
                    const end = new Date(expo.endDate);
                    return now >= start && now <= end;
                }
                return false;
            }).length;

            // Calculate total exhibitors across all expos
            let totalExhibitors = 0;
            for (const expo of exposData) {
                try {
                    const exhibitorsResponse = await getExhibitorsByExpo(expo._id, token);
                    totalExhibitors += (exhibitorsResponse.data || []).length;
                } catch (err) {
                    console.error(`Error fetching exhibitors for expo ${expo._id}:`, err);
                }
            }

            // Calculate growth percentages (you might want to store this in your database)
            // For now, using placeholder calculations
            const expoGrowth = Math.min(Math.floor(Math.random() * 30), 100); // Replace with actual calculation
            const exhibitorGrowth = Math.min(Math.floor(Math.random() * 40), 100); // Replace with actual calculation

            // Generate recent activity from expos data
            const recentActivity = exposData.slice(0, 4).map(expo => ({
                type: 'expo',
                name: expo.name || 'Unnamed Expo',
                status: activeExpos > 0 ? 'active' : 'upcoming',
                time: formatTimeAgo(expo.createdAt || new Date())
            }));

            setAnalytics({
                totalExpos: exposData.length,
                totalExhibitors,
                activeExpos,
                pendingExhibitors: pendingExhibitors.length,
                expoGrowth,
                exhibitorGrowth,
                recentActivity
            });

        } catch (err) {
            console.error('Failed to fetch analytics data:', err);
            setError('Failed to load analytics data. Please try again.');
            
            // Fallback to demo data for UI demonstration
            setAnalytics({
                totalExpos: 0,
                totalExhibitors: 0,
                activeExpos: 0,
                pendingExhibitors: 0,
                expoGrowth: 0,
                exhibitorGrowth: 0,
                recentActivity: []
            });
        } finally {
            setLoading(false);
        }
    };

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) {
            return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
        } else if (diffHours < 24) {
            return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
        } else {
            return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
        }
    };

    if (!user || user.role !== "admin") {
        return (
            <Box
                sx={{
                    minHeight: '80vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 4,
                    background: 'linear-gradient(135deg, #1a237e 0%, #311b92 100%)',
                }}
            >
                <Paper
                    elevation={6}
                    sx={{
                        p: 6,
                        borderRadius: 3,
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                        color: 'white',
                        maxWidth: 500,
                        width: '100%',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                >
                    <Avatar
                        sx={{
                            width: 80,
                            height: 80,
                            mx: 'auto',
                            mb: 3,
                            bgcolor: 'error.dark',
                            background: 'linear-gradient(45deg, #d32f2f 30%, #f44336 90%)',
                        }}
                    >
                        <PeopleIcon sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Access Denied
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9, mb: 3 }}>
                        You do not have permission to view this page. Admin privileges required.
                    </Typography>
                    <Chip 
                        label="Admin Only" 
                        color="error" 
                        sx={{ 
                            fontWeight: 'bold',
                            background: 'linear-gradient(45deg, #d32f2f 30%, #f44336 90%)',
                            color: 'white'
                        }}
                    />
                </Paper>
            </Box>
        );
    }

    const handleRefreshAnalytics = () => {
        fetchAnalyticsData();
    };

    const renderAnalyticsSection = () => {
        return (
            <Box sx={{ mb: 4 }}>
                {/* Error Alert */}
                {error && (
                    <Alert 
                        severity="error" 
                        sx={{ 
                            mb: 3,
                            borderRadius: 2,
                            alignItems: 'center',
                        }}
                        action={
                            <IconButton 
                                size="small" 
                                onClick={() => setError(null)}
                                color="inherit"
                            >
                                <ErrorIcon fontSize="small" />
                            </IconButton>
                        }
                    >
                        {error}
                    </Alert>
                )}

                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            Analytics Dashboard
                        </Typography>
                    </Box>
                    <Tooltip title="Refresh Analytics">
                        <IconButton 
                            onClick={handleRefreshAnalytics} 
                            disabled={loading}
                            sx={{ 
                                bgcolor: 'primary.dark',
                                '&:hover': { bgcolor: 'primary.main' }
                            }}
                        >
                            {loading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                <RefreshIcon />
                            )}
                        </IconButton>
                    </Tooltip>
                </Box>

                {/* Stats Grid */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {/* Total Expos Card */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Card 
                            sx={{ 
                                background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 100%)',
                                color: 'white',
                                borderRadius: 3,
                                position: 'relative',
                                overflow: 'hidden',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    transition: 'transform 0.3s ease-in-out',
                                    boxShadow: 6
                                }
                            }}
                        >
                            <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 1 }}>
                                            Total Expos
                                        </Typography>
                                        <Typography variant="h3" fontWeight="bold">
                                            {analytics.totalExpos}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                            {analytics.expoGrowth > 0 ? (
                                                <ArrowUpwardIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                            ) : analytics.expoGrowth < 0 ? (
                                                <ArrowDownwardIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                            ) : null}
                                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                {analytics.expoGrowth > 0 ? '+' : ''}{analytics.expoGrowth}% this month
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Avatar
                                        sx={{
                                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                                            width: 48,
                                            height: 48,
                                        }}
                                    >
                                        <EventIcon />
                                    </Avatar>
                                </Box>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={analytics.activeExpos > 0 ? Math.min((analytics.activeExpos / analytics.totalExpos) * 100, 100) : 0} 
                                    sx={{ 
                                        mt: 2,
                                        height: 4,
                                        borderRadius: 2,
                                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: 'white'
                                        }
                                    }}
                                />
                                <Typography variant="caption" sx={{ mt: 1, display: 'block', opacity: 0.8 }}>
                                    {analytics.activeExpos} active expos
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Total Exhibitors Card */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Card 
                            sx={{ 
                                background: 'linear-gradient(135deg, #4a148c 0%, #7b1fa2 100%)',
                                color: 'white',
                                borderRadius: 3,
                                position: 'relative',
                                overflow: 'hidden',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    transition: 'transform 0.3s ease-in-out',
                                    boxShadow: 6
                                }
                            }}
                        >
                            <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 1 }}>
                                            Total Exhibitors
                                        </Typography>
                                        <Typography variant="h3" fontWeight="bold">
                                            {analytics.totalExhibitors}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                            {analytics.exhibitorGrowth > 0 ? (
                                                <ArrowUpwardIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                            ) : analytics.exhibitorGrowth < 0 ? (
                                                <ArrowDownwardIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                            ) : null}
                                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                {analytics.exhibitorGrowth > 0 ? '+' : ''}{analytics.exhibitorGrowth}% this month
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Avatar
                                        sx={{
                                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                                            width: 48,
                                            height: 48,
                                        }}
                                    >
                                        <PeopleIcon />
                                    </Avatar>
                                </Box>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={analytics.pendingExhibitors > 0 ? Math.min((analytics.pendingExhibitors / Math.max(analytics.totalExhibitors, 1)) * 100, 100) : 0} 
                                    sx={{ 
                                        mt: 2,
                                        height: 4,
                                        borderRadius: 2,
                                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: 'white'
                                        }
                                    }}
                                />
                                <Typography variant="caption" sx={{ mt: 1, display: 'block', opacity: 0.8 }}>
                                    {analytics.pendingExhibitors} pending approval
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Active Expos Card */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Card 
                            sx={{ 
                                background: 'linear-gradient(135deg, #006064 0%, #00838f 100%)',
                                color: 'white',
                                borderRadius: 3,
                                position: 'relative',
                                overflow: 'hidden',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    transition: 'transform 0.3s ease-in-out',
                                    boxShadow: 6
                                }
                            }}
                        >
                            <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 1 }}>
                                            Active Expos
                                        </Typography>
                                        <Typography variant="h3" fontWeight="bold">
                                            {analytics.activeExpos}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                                            Currently running
                                        </Typography>
                                    </Box>
                                    <Avatar
                                        sx={{
                                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                                            width: 48,
                                            height: 48,
                                        }}
                                    >
                                        <TrendingUpIcon />
                                    </Avatar>
                                </Box>
                                <Box sx={{ mt: 2 }}>
                                    <Chip 
                                        label={analytics.activeExpos > 0 ? "Live" : "None Active"} 
                                        size="small" 
                                        sx={{ 
                                            bgcolor: analytics.activeExpos > 0 ? 'rgba(76, 175, 80, 0.3)' : 'rgba(158, 158, 158, 0.3)',
                                            color: 'white',
                                            fontWeight: 'bold'
                                        }}
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Pending Approvals Card */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Card 
                            sx={{ 
                                background: 'linear-gradient(135deg, #e65100 0%, #f57c00 100%)',
                                color: 'white',
                                borderRadius: 3,
                                position: 'relative',
                                overflow: 'hidden',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    transition: 'transform 0.3s ease-in-out',
                                    boxShadow: 6
                                }
                            }}
                        >
                            <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 1 }}>
                                            Pending Approvals
                                        </Typography>
                                        <Typography variant="h3" fontWeight="bold">
                                            {analytics.pendingExhibitors}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                                            Require attention
                                        </Typography>
                                    </Box>
                                    <Avatar
                                        sx={{
                                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                                            width: 48,
                                            height: 48,
                                        }}
                                    >
                                        <StorefrontIcon />
                                    </Avatar>
                                </Box>
                                <Box sx={{ mt: 2 }}>
                                    <Chip 
                                        label={analytics.pendingExhibitors > 0 ? "Action Required" : "All Caught Up"} 
                                        size="small" 
                                        sx={{ 
                                            bgcolor: analytics.pendingExhibitors > 0 ? 'rgba(255, 87, 34, 0.3)' : 'rgba(76, 175, 80, 0.3)',
                                            color: 'white',
                                            fontWeight: 'bold'
                                        }}
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Recent Activity */}
               <Paper 
    elevation={2} 
    sx={{ 
        p: 3, 
        borderRadius: 3,
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
    }}
>
    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>
        Recent Activity
    </Typography>
    {analytics.recentActivity.length > 0 ? (
        <Stack spacing={2}>
            {analytics.recentActivity.map((activity, index) => (
                <Box
                    key={index}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'rgba(255, 255, 255, 0.02)',
                        '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                        }
                    }}
                >
                    <Avatar
                        sx={{
                            width: 40,
                            height: 40,
                            mr: 2,
                            bgcolor: 
                                activity.type === 'expo' ? 'primary.dark' :
                                activity.type === 'exhibitor' ? 'secondary.dark' :
                                activity.type === 'booth' ? 'success.dark' : 'warning.dark',
                        }}
                    >
                        {activity.type === 'expo' && <EventIcon sx={{ color: 'white' }} />}
                        {activity.type === 'exhibitor' && <PeopleIcon sx={{ color: 'white' }} />}
                        {activity.type === 'booth' && <StorefrontIcon sx={{ color: 'white' }} />}
                        {activity.type === 'session' && <TrendingUpIcon sx={{ color: 'white' }} />}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" fontWeight="medium" sx={{ color: 'white' }}>
                            {activity.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'whiteAlpha.700' }}>
                            {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} • {activity.time}
                        </Typography>
                    </Box>
                    <Chip 
                        label={activity.status} 
                        size="small"
                        color={
                            activity.status === 'active' || activity.status === 'approved' ? 'success' :
                            activity.status === 'pending' ? 'warning' : 'default'
                        }
                    />
                </Box>
            ))}
        </Stack>
    ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" sx={{ color: 'whiteAlpha.700' }}>
                No recent activity to display
            </Typography>
        </Box>
    )}
</Paper>

            </Box>
        );
    };

    const renderPage = () => {
        switch (activePage) {
            case "dashboard":
                return (
                    <>
                        {renderAnalyticsSection()}
                        <Dashboard />
                    </>
                );
            case "create-expo":
                return <CreateExpo />;
            case "expo-list":
                return (
                    <ExpoList
                        onEdit={(id) => {
                            setEditingExpoId(id);
                            setActivePage("update-expo");
                        }}
                        onDelete={(id) => {
                            setDeletingExpoId(id);
                            setActivePage("delete-expo");
                        }}
                    />
                );
            case "update-expo":
                return (
                    <UpdateExpo
                        expoId={editingExpoId}
                        onDone={() => {
                            setEditingExpoId(null);
                            setActivePage("expo-list");
                        }}
                    />
                );
            case "delete-expo":
                return (
                    <DeleteExpo
                        expoId={deletingExpoId}
                        onDone={() => {
                            setDeletingExpoId(null);
                            setActivePage("expo-list");
                        }}
                    />
                );
            case "approve-exhibitor":
                return <ApproveExhibitor />;
            case "create-booth":
                return <CreateBooth setActivePage={setActivePage} />;
            case "booth-list":
                return <BoothList setActivePage={setActivePage} />;
            case "create-session":
                return <CreateSession />;
            default:
                return (
                    <>
                        {renderAnalyticsSection()}
                        <Dashboard />
                    </>
                );
        }
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', background: '#0a1929' }}>
            <Sidebar activePage={activePage} setActivePage={setActivePage} />
            <Box
                sx={{
                    flex: 1,
                    p: 4,
                    background: 'linear-gradient(135deg, #0a1929 0%, #1a237e 100%)',
                    color: 'white',
                    minHeight: '100vh',
                    overflow: 'auto',
                }}
            >
                {/* Welcome Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h3" fontWeight="bold" gutterBottom>
                        Welcome back, {user.name || 'Admin'} 👋
                    </Typography>

                </Box>

                {renderPage()}
            </Box>
        </Box>
    );
}