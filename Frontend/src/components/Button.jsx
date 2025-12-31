import React from 'react';
import {
  Button as MuiButton,
  CircularProgress,
  Tooltip
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

export const Button = ({
  children,
  onClick,
  variant = 'contained',
  color = 'primary',
  disabled = false,
  loading = false,
  fullWidth = false,
  startIcon,
  endIcon,
  size = 'medium',
  className = '',
  tooltip = '',
  sx = {},
  ...props
}) => {
  // Map custom color names to MUI colors
  const getMuiColor = (color) => {
    const colorMap = {
      primary: 'primary',
      secondary: 'secondary',
      success: 'success',
      error: 'error',
      warning: 'warning',
      info: 'info',
      blue: 'primary',
      gray: 'default',
      red: 'error',
      green: 'success',
      purple: 'secondary'
    };
    return colorMap[color] || color;
  };

  // Custom gradient styles for different variants
  const getVariantStyles = (variant, color) => {
    if (variant === 'contained') {
      const gradients = {
        primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        success: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
        error: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
        warning: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
        info: 'linear-gradient(135deg, #4fc3f7 0%, #29b6f6 100%)',
      };
      
      return gradients[color] ? {
        background: gradients[color],
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
          transform: 'translateX(-100%)',
          transition: 'transform 0.6s',
        },
        '&:hover::before': {
          transform: 'translateX(100%)',
        },
        '&:hover': {
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
          transform: 'translateY(-2px)',
        },
        '&:active': {
          transform: 'translateY(0)',
        },
        transition: 'all 0.3s ease',
      } : {};
    }

    if (variant === 'outlined') {
      const borderColors = {
        primary: '#667eea',
        secondary: '#f093fb',
        success: '#4caf50',
        error: '#f44336',
        warning: '#ff9800',
        info: '#4fc3f7',
      };
      
      return borderColors[color] ? {
        borderColor: borderColors[color],
        color: borderColors[color],
        '&:hover': {
          borderColor: borderColors[color],
          backgroundColor: `${borderColors[color]}15`,
          boxShadow: `0 4px 20px ${borderColors[color]}20`,
          transform: 'translateY(-1px)',
        },
        transition: 'all 0.3s ease',
      } : {};
    }

    return {};
  };

  // Size styles
  const sizeStyles = {
    small: {
      padding: '4px 12px',
      fontSize: '0.875rem',
      minHeight: '32px',
    },
    medium: {
      padding: '8px 20px',
      fontSize: '1rem',
      minHeight: '40px',
    },
    large: {
      padding: '12px 28px',
      fontSize: '1.125rem',
      minHeight: '48px',
    },
  };

  // Combine all styles
  const combinedStyles = {
    borderRadius: 2,
    fontWeight: 600,
    textTransform: 'none',
    ...sizeStyles[size],
    ...getVariantStyles(variant, color),
    '&.Mui-disabled': {
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'rgba(255, 255, 255, 0.3)',
      border: variant === 'outlined' ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
    },
    ...sx,
  };

  // Render loading button if loading prop is true
  const renderButton = () => {
    const buttonProps = {
      variant,
      color: getMuiColor(color),
      disabled: disabled || loading,
      onClick,
      fullWidth,
      startIcon: loading ? null : startIcon,
      endIcon: loading ? null : endIcon,
      size,
      className,
      sx: combinedStyles,
      ...props
    };

    if (loading) {
      return (
        <LoadingButton
          {...buttonProps}
          loading={loading}
          loadingIndicator={
            <CircularProgress
              size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
              color="inherit"
            />
          }
        >
          {children}
        </LoadingButton>
      );
    }

    return (
      <MuiButton {...buttonProps}>
        {children}
      </MuiButton>
    );
  };

  // Wrap with tooltip if provided
  if (tooltip) {
    return (
      <Tooltip title={tooltip} arrow>
        <span>
          {renderButton()}
        </span>
      </Tooltip>
    );
  }

  return renderButton();
};

// Additional button variants as separate components
export const GradientButton = (props) => (
  <Button variant="contained" sx={{ 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    '&:hover': {
      background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
    },
    ...props.sx 
  }} {...props} />
);

export const GlassButton = (props) => (
  <Button variant="outlined" sx={{
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: 'white',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
    },
    ...props.sx
  }} {...props} />
);

export const IconButton = ({ icon, children, ...props }) => (
  <Button
    startIcon={icon}
    sx={{
      gap: 1,
      '& .MuiButton-startIcon': {
        marginRight: 0.5,
      },
      ...props.sx
    }}
    {...props}
  >
    {children}
  </Button>
);

// Floating Action Button
export const FabButton = (props) => (
  <Button
    variant="contained"
    sx={{
      position: 'fixed',
      bottom: 32,
      right: 32,
      borderRadius: '50%',
      minWidth: 56,
      width: 56,
      height: 56,
      padding: 0,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      '&:hover': {
        transform: 'scale(1.1)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
      },
      ...props.sx
    }}
    {...props}
  />
);

// Pill Button
export const PillButton = (props) => (
  <Button
    sx={{
      borderRadius: 50,
      ...props.sx
    }}
    {...props}
  />
);

// Ghost Button (minimal)
export const GhostButton = (props) => (
  <Button
    variant="text"
    sx={{
      color: 'white',
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.1)',
      },
      ...props.sx
    }}
    {...props}
  />
);