import React from 'react';
import {
  Paper,
  Card as MuiCard,
  CardContent,
  CardActions,
  CardHeader,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Divider,
  Chip,
  Avatar,
  alpha
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

export const Card = ({
  children,
  title,
  subtitle,
  avatar,
  image,
  imageHeight = 200,
  actions,
  footer,
  variant = 'elevation',
  elevation = 1,
  className = '',
  sx = {},
  onClick,
  hover = true,
  border = false,
  glass = false,
  gradient = false,
  ...props
}) => {
  const cardStyles = {
    borderRadius: 2,
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    ...(hover && {
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
      }
    }),
    ...(border && {
      border: '1px solid rgba(255, 255, 255, 0.1)',
    }),
    ...(glass && {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    }),
    ...(gradient && {
      background: 'linear-gradient(135deg, rgba(30, 60, 114, 0.9) 0%, rgba(42, 82, 152, 0.9) 100%)',
    }),
    ...sx,
  };

  const renderCard = () => {
    if (image || title || subtitle || avatar) {
      return (
        <MuiCard
          variant={variant}
          elevation={elevation}
          className={className}
          sx={cardStyles}
          onClick={onClick}
          {...props}
        >
          {image && (
            <CardMedia
              component="img"
              height={imageHeight}
              image={image}
              alt={title || 'Card image'}
              sx={{
                objectFit: 'cover',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                }
              }}
            />
          )}

          {(title || subtitle || avatar) && (
            <CardHeader
              avatar={
                avatar && (
                  <Avatar
                    sx={{
                      bgcolor: avatar.color || 'primary.main',
                      width: 40,
                      height: 40
                    }}
                  >
                    {typeof avatar === 'string' ? avatar[0].toUpperCase() : avatar.content}
                  </Avatar>
                )
              }
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
              title={
                <Typography variant="h6" component="div" sx={{ fontWeight: 600, color: 'white' }}>
                  {title}
                </Typography>
              }
              subheader={
                subtitle && (
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {subtitle}
                  </Typography>
                )
              }
              sx={{
                '& .MuiCardHeader-content': {
                  overflow: 'hidden',
                }
              }}
            />
          )}

          {children && (
            <CardContent>
              {typeof children === 'string' ? (
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  {children}
                </Typography>
              ) : (
                children
              )}
            </CardContent>
          )}

          {(actions || footer) && (
            <>
              {children && <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mx: 2 }} />}
              <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                {actions}
                {footer && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {footer}
                  </Box>
                )}
              </CardActions>
            </>
          )}
        </MuiCard>
      );
    }

    return (
      <Paper
        variant={variant}
        elevation={elevation}
        className={className}
        sx={cardStyles}
        onClick={onClick}
        {...props}
      >
        {children}
      </Paper>
    );
  };

  return renderCard();
};

// Specialized Card Variants

export const StatsCard = ({ title, value, icon, trend, subtitle, color = 'primary', ...props }) => (
  <Card
    glass
    sx={{
      p: 3,
      textAlign: 'center',
      borderLeft: `4px solid ${color}.main`,
      ...props.sx
    }}
    {...props}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
      <Avatar
        sx={{
          bgcolor: `${color}.main`,
          width: 56,
          height: 56
        }}
      >
        {icon}
      </Avatar>
    </Box>
    <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
      {value}
    </Typography>
    <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
      {title}
    </Typography>
    {trend && (
      <Chip
        label={trend}
        size="small"
        sx={{
          bgcolor: trend.startsWith('+') ? 'success.main' : 'error.main',
          color: 'white',
          fontWeight: 600
        }}
      />
    )}
    {subtitle && (
      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', display: 'block', mt: 1 }}>
        {subtitle}
      </Typography>
    )}
  </Card>
);

export const FeatureCard = ({ icon, title, description, actionText, onClick, ...props }) => (
  <Card
    hover
    glass
    sx={{
      p: 3,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      ...props.sx
    }}
    {...props}
  >
    <Box sx={{ color: 'primary.main', mb: 2 }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ color: 'white', mb: 1, fontWeight: 600 }}>
      {title}
    </Typography>
    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3, flexGrow: 1 }}>
      {description}
    </Typography>
    {actionText && (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: 'primary.main',
          cursor: 'pointer',
          '&:hover': {
            color: 'primary.light'
          }
        }}
        onClick={onClick}
      >
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {actionText}
        </Typography>
        <ArrowForwardIcon sx={{ fontSize: 16, ml: 0.5 }} />
      </Box>
    )}
  </Card>
);

export const UserCard = ({ name, role, avatar, email, stats, actions, ...props }) => (
  <Card
    sx={{
      p: 3,
      textAlign: 'center',
      ...props.sx
    }}
    {...props}
  >
    <Avatar
      src={avatar}
      sx={{
        width: 80,
        height: 80,
        mx: 'auto',
        mb: 2,
        border: '3px solid',
        borderColor: 'primary.main'
      }}
    />
    <Typography variant="h6" sx={{ color: 'white', mb: 0.5 }}>
      {name}
    </Typography>
    <Chip
      label={role}
      size="small"
      sx={{
        bgcolor: 'primary.dark',
        color: 'white',
        mb: 2
      }}
    />
    {email && (
      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
        {email}
      </Typography>
    )}
    {stats && (
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 3 }}>
        {stats.map((stat, index) => (
          <Box key={index} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: 'white' }}>
              {stat.value}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              {stat.label}
            </Typography>
          </Box>
        ))}
      </Box>
    )}
    {actions}
  </Card>
);

export const InteractiveCard = ({ children, onClick, ...props }) => (
  <Card
    hover
    onClick={onClick}
    sx={{
      cursor: 'pointer',
      '&:active': {
        transform: 'scale(0.98)',
      },
      ...props.sx
    }}
    {...props}
  >
    {children}
  </Card>
);

export default Card;